import { useState, useMemo } from "react";
import { useParams } from "wouter";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useProject } from "@/hooks/use-projects";
import { useMoveTask, useCreateColumn, useDeleteColumn } from "@/hooks/use-kanban";
import { TaskCard } from "@/components/task-card";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Trash2, KanbanSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Task } from "@shared/schema";
import { useDroppable } from "@dnd-kit/core";

// Droppable Column Component
function KanbanColumn({ column, children, onDelete }: { column: any, children: React.ReactNode, onDelete: () => void }) {
  const { setNodeRef } = useDroppable({
    id: String(column.id),
  });

  return (
    <div className="w-80 flex-shrink-0 flex flex-col max-h-full">
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
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 rounded-xl bg-secondary/30 border border-border/50 p-2 flex flex-col min-h-[150px]"
      >
        <ScrollArea className="flex-1">
          <div className="px-1 py-1">
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default function ProjectKanban() {
  const { id } = useParams();
  const projectId = Number(id);
  
  const { data: project, isLoading } = useProject(projectId);
  const { mutate: moveTask } = useMoveTask();
  const { mutate: createColumn } = useCreateColumn();
  const { mutate: deleteColumn } = useDeleteColumn();

  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<number | null>(null);
  const [newColumnName, setNewColumnName] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const columns = useMemo(() => {
    return project?.columns.sort((a, b) => a.order - b.order) || [];
  }, [project]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as Task;
    setActiveDragTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragTask(null);

    if (!over) return;

    const taskId = Number(active.id);
    // Determine target column ID. 
    // If dropped on a column (droppable), ID is column ID.
    // If dropped on a task (draggable), we need to find that task's column or handle sort order.
    // For simplicity in this demo, let's assume we drop onto columns.
    // To support reordering within columns, we'd need more complex logic with sortable strategies.
    
    // In dnd-kit, if we drop on another Sortable item, `over.id` is that item's ID. 
    // We need to map that back to the column. Or we make columns Droppable.
    // Here, I made columns Droppable with ID = column.id.
    // If we drop on a task, `over.id` is task ID.
    
    let targetColumnId = Number(over.id);
    
    // If dropped on a task, find its column
    if (isNaN(targetColumnId)) {
      // Trying to find column of the task we dropped ON.
      // This requires searching our state.
      const overTask = columns.flatMap(c => c.tasks).find(t => String(t.id) === String(over.id));
      if (overTask) {
        targetColumnId = overTask.columnId;
      }
    }

    if (activeDragTask && targetColumnId && !isNaN(targetColumnId)) {
       // Only move if column changed or we implement reordering logic
       if (activeDragTask.columnId !== targetColumnId) {
         moveTask({
           taskId,
           columnId: targetColumnId,
           order: 0, // Append to top/bottom or calculate index
           projectId,
         });
       }
    }
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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditTaskOpen(true);
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
      <div className="px-6 py-4 border-b flex items-center justify-between bg-background/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <KanbanSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground text-xs">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Project actions */}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-muted/10 p-6">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-6">
            {columns.map((column) => (
              <KanbanColumn 
                key={column.id} 
                column={column} 
                onDelete={() => deleteColumn({ id: column.id, projectId })}
              >
                <SortableContext 
                  items={column.tasks.map(t => String(t.id))}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2 pb-2">
                    {column.tasks
                      .sort((a, b) => a.order - b.order)
                      .map((task, index) => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          index={index} 
                          onClick={handleTaskClick}
                        />
                      ))}
                  </div>
                </SortableContext>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground mt-1 h-9"
                  onClick={() => openCreateTask(column.id)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </KanbanColumn>
            ))}

            {/* Add Column Section */}
            <div className="w-80 flex-shrink-0">
              {isAddingColumn ? (
                <form onSubmit={handleAddColumn} className="bg-card p-3 rounded-xl border shadow-sm ring-1 ring-primary/20">
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
                  className="w-full h-12 border-dashed bg-transparent hover:bg-secondary/50 text-muted-foreground"
                  onClick={() => setIsAddingColumn(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Column
                </Button>
              )}
            </div>
          </div>

          <DragOverlay>
            {activeDragTask ? (
              <div className="opacity-90 rotate-2 cursor-grabbing">
                <TaskCard task={activeDragTask} index={0} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>

        </DndContext>
      </div>

      {activeColumnId && (
        <CreateTaskDialog 
          open={createTaskOpen} 
          onOpenChange={setCreateTaskOpen}
          columnId={activeColumnId}
          projectId={projectId}
        />
      )}

      {selectedTask && (
        <EditTaskDialog
          open={editTaskOpen}
          onOpenChange={setEditTaskOpen}
          task={selectedTask}
          projectId={projectId}
        />
      )}
    </div>
  );
}
