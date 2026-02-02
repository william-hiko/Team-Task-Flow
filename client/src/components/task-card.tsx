import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Task } from "@shared/schema";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(task.id),
    data: { task, index }, // Useful for drag events
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const priorityColor = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
    medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    high: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
  }[task.priority || "medium"];

  // Format Estimated Time (ET)
  const formatET = (minutes?: number | null) => {
    if (!minutes) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("mb-3 touch-none", isDragging && "opacity-50 z-50")}
    >
      <Card 
        className={cn(
          "group relative hover:shadow-md transition-all cursor-pointer border-border/60 hover:border-primary/50",
          isDragging && "shadow-xl ring-2 ring-primary/20 rotate-2"
        )}
        onClick={() => onClick(task)}
      >
        <div 
          {...listeners} 
          {...attributes}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 hover:bg-secondary rounded transition-opacity"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        <CardHeader className="p-3 pb-0 space-y-0">
          <div className="flex justify-between items-start gap-2 pr-6">
            <span className="text-[10px] font-mono text-muted-foreground font-medium tracking-wide">
              TASK-{task.id}
            </span>
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 font-medium border uppercase tracking-wider", priorityColor)}>
              {task.priority}
            </Badge>
          </div>
          <CardTitle className="text-sm font-medium leading-snug mt-1.5 line-clamp-2">
            {task.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-3 pt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              {task.dueDate && (
                <div className="flex items-center text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-md">
                  <Calendar className="mr-1.5 h-3 w-3" />
                  {format(new Date(task.dueDate), "MMM d")}
                </div>
              )}
              {task.estimatedTime && (
                <div className="flex items-center text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-md" title="Estimated Time">
                  <Clock className="mr-1.5 h-3 w-3" />
                  {formatET(task.estimatedTime)}
                </div>
              )}
            </div>
            
            <div className="flex -space-x-2">
              {/* Placeholder Avatar */}
              <Avatar className="h-5 w-5 border-2 border-background ring-1 ring-border">
                <AvatarFallback className="text-[8px] bg-primary/10 text-primary">U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
