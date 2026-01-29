import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateOnly } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date | string;
  userId: string;
  dueDate?: Date | string | null;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) => {
  const handleToggleComplete = () => {
    onToggleComplete?.(task.id);
  };

  const handleEdit = () => {
    onEdit?.(task.id);
  };

  const handleDelete = () => {
    onDelete?.(task.id);
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-md border-l-4 ${task.completed ? 'border-l-green-500 bg-secondary/10' : 'border-l-blue-500 bg-card'}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            className={`mt-1 h-5 w-5 rounded border-2 ${task.completed ? 'bg-green-500 border-green-500' : 'border-primary'} focus:ring-0 focus:ring-offset-0`}
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </h3>

                {task.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 2v4M8 2v4m-5 4h18M3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9" />
                    </svg>
                    Created: {formatDateOnly(task.createdAt)}
                  </span>

                  {task.dueDate && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${task.completed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.7127C21.0027 12.944 21.0027 13.1761 21.0027 13.4089C21.0027 18.9329 16.5267 23.4089 11.0027 23.4089C5.47875 23.4089 1.00275 18.9329 1.00275 13.4089C1.00275 7.88493 5.47875 3.40894 11.0027 3.40894C12.2727 3.40894 13.5027 3.61894 14.6527 3.99894" />
                        <path d="M16.5 8.5L21 13" />
                        <path d="M21 8.5V13.5H16" />
                      </svg>
                      Due: {formatDateOnly(task.dueDate)}
                    </span>
                  )}

                  {task.completed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="M22 4L12 14.01L9 11.01" />
                      </svg>
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <button
                  onClick={handleEdit}
                  className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Edit task "${task.title}"`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>

                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label={`Delete task "${task.title}"`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};