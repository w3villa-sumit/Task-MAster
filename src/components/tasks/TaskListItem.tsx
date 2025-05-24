import React from 'react';
import { Task } from '../../types';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Edit, Trash2, Clock } from 'lucide-react';

interface TaskListItemProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, onEdit, onDelete }) => {
  const priorityVariant = {
    low: 'default',
    medium: 'warning',
    high: 'danger',
  } as const;
  
  const statusVariant = {
    'pending': 'default',
    'in-progress': 'primary',
    'completed': 'success',
  } as const;
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="mb-3 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{task.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant={statusVariant[task.status]}>
                {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
              <Badge variant={priorityVariant[task.priority]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </Badge>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Updated {formatDate(task.updatedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(task.id)}
              aria-label={`Edit task ${task.title}`}
            >
              <Edit className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(task.id)}
              aria-label={`Delete task ${task.title}`}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskListItem;