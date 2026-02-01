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
  // Optional: if we want to support specific drag handle in the future
  dragHandleProps?: any;
}

export function TaskCard({ task, index, onClick, dragHandleProps }: TaskCardProps) {
  const priorityColor = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
  }[task.priority || "medium"];

  return (
    <div className="touch-none">
      <Card 
        className="group relative hover:shadow-md transition-all cursor-pointer border-border/60 hover:border-primary/50"
        onClick={() => onClick(task)}
      >
        {/* If we wanted a specific drag handle, we would use dragHandleProps here. 
            For now, the parent handles dragging via the wrapper. */}
        <div 
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
          <CardTitle className="text-sm font-medium leading-tight mt-1 line-clamp-2">
            {task.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-3 pt-2">
          <div className="flex items-center justify-between mt-2">
            {task.dueDate ? (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {format(new Date(task.dueDate), "MMM d")}
              </div>
            ) : (
              <div />
            )}
            
            {/* Placeholder for assignee - could be real data later */}
            <div className="flex -space-x-2">
               {/* This would map over assignees if we had them populated */}
               {/* Example avatar placeholder */}
               {/* <Avatar className="h-5 w-5 border-2 border-background">
                 <AvatarFallback className="text-[9px]">U</AvatarFallback>
               </Avatar> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
