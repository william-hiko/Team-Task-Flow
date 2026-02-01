import { useDraggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(task.id),
    index,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const priorityColor = {
    low: "bg-priority-low/10 text-priority-low hover:bg-priority-low/20 border-priority-low/20",
    medium: "bg-priority-medium/10 text-priority-medium hover:bg-priority-medium/20 border-priority-medium/20",
    high: "bg-priority-high/10 text-priority-high hover:bg-priority-high/20 border-priority-high/20",
  }[task.priority || "medium"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("mb-3 touch-none", isDragging && "opacity-50")}
    >
      <Card 
        className="group relative hover:shadow-md transition-all cursor-pointer border-border/60 hover:border-primary/50"
        onClick={() => onClick(task)}
      >
        <div 
          {...listeners} 
          {...attributes}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 hover:bg-secondary rounded"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        <CardHeader className="p-3 pb-0 space-y-0">
          <div className="flex justify-between items-start gap-2 pr-6">
            <span className="text-xs font-mono text-muted-foreground">
              TASK-{task.id}
            </span>
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 font-medium border", priorityColor)}>
              {task.priority}
            </Badge>
          </div>
          <CardTitle className="text-sm font-medium leading-tight mt-1">
            {task.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-3 pt-2">
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <Calendar className="mr-1 h-3 w-3" />
              {format(new Date(task.dueDate), "MMM d")}
            </div>
          )}
          
          <div className="flex items-center justify-end mt-2">
            {/* Placeholder for assignee - could be real data later */}
            <div className="flex -space-x-2">
               {/* This would map over assignees if we had them populated */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
