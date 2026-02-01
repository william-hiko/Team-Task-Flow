import { useState, useMemo } from "react";
import { useParams } from "wouter";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useProject } from "@/hooks/use-projects";
import { useMoveTask, useCreateColumn, useDeleteColumn } from "@/hooks/use-kanban";
import { TaskCard } from "@/components/task-card";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function ProjectKanban() {
  const { id } = useParams();
  const projectId = Number(id);
  
  const { data: project, isLoading } = useProject(projectId);
  const { mutate: moveTask } = useMoveTask();
  const { mutate: createColumn } = useCreateColumn();
  const { mutate: deleteColumn } = useDeleteColumn();

  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<number | null>(null);
  const [newColumnName, setNewColumnName] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  // Derive optimistic state if needed, or just use raw data
  // For simplicity, we use raw data here but in a real app would use local state for optimistic updates
  const columns = useMemo(() => {
    return project?.columns.sort((a, b) => a.order - b.order) || [];
  }, [project]);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Optimistically update UI would go here if using local state
    
    // Call API
    moveTask({
      taskId: Number(draggableId),
      columnId: Number(destination.droppableId),
      order: destination.index,
      projectId,
    });
  };

  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    
    createColumn({ 
      name: newColumnName, 
      projectId, 
      order: columns.length 
    });
    setNewColumnName("");
    setIsAddingColumn(false);
  };

  const openCreateTask = (colId: number) => {
    setActiveColumnId(colId);
    setCreateTaskOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) return <div>Project not found</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground text-sm">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Project actions could go here */}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-muted/30">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full p-6 gap-6">
            {columns.map((column) => (
              <div key={column.id} className="w-80 flex-shrink-0 flex flex-col max-h-full">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                      {column.name}
                    </h3>
                    <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {column.tasks.length}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteColumn({ id: column.id, projectId })}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Column
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Droppable droppableId={String(column.id)}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 rounded-xl bg-secondary/30 border border-border/50 p-2 transition-colors ${
                        snapshot.isDraggingOver ? "bg-secondary/50 ring-2 ring-primary/20" : ""
                      }`}
                    >
                      <ScrollArea className="h-[calc(100vh-280px)]">
                        <div className="px-1 py-1">
                        {column.tasks
                          .sort((a, b) => a.order - b.order)
                          .map((task, index) => (
                            <Draggable 
                              key={task.id} 
                              draggableId={String(task.id)} 
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-3"
                                  style={{ ...provided.draggableProps.style }}
                                >
                                  <TaskCard 
                                    task={task} 
                                    index={index} 
                                    onClick={(t) => console.log("Edit task", t)} // Should open edit dialog
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                        </div>
                      </ScrollArea>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-muted-foreground hover:text-foreground mt-2"
                        onClick={() => openCreateTask(column.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                      </Button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}

            {/* Add Column Section */}
            <div className="w-80 flex-shrink-0">
              {isAddingColumn ? (
                <form onSubmit={handleAddColumn} className="bg-card p-3 rounded-lg border shadow-sm">
                  <Input
                    autoFocus
                    placeholder="Column name"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsAddingColumn(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">Add</Button>
                  </div>
                </form>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-dashed bg-transparent hover:bg-secondary/50"
                  onClick={() => setIsAddingColumn(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Column
                </Button>
              )}
            </div>
          </div>
        </DragDropContext>
      </div>

      {activeColumnId && (
        <CreateTaskDialog 
          open={createTaskOpen} 
          onOpenChange={setCreateTaskOpen}
          columnId={activeColumnId}
          projectId={projectId}
        />
      )}
    </div>
  );
}
