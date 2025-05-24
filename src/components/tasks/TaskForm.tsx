import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../contexts/AuthContext';
import { Task } from '../../types';
import { getStoredTasks, saveTask } from '../../utils/localStorage';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { ArrowLeft, Save } from 'lucide-react';

const TaskForm: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const isEditing = !!taskId;
  
  // Load task data if editing
  useEffect(() => {
    if (isEditing && state.user) {
      const tasks = getStoredTasks();
      const task = tasks.find((t) => t.id === taskId);
      
      if (task && task.userId === state.user.id) {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
      } else {
        // Task not found or doesn't belong to user
        navigate('/tasks');
      }
    }
  }, [isEditing, taskId, state.user, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (state.user) {
      const now = new Date().toISOString();
      
      const task: Task = {
        id: isEditing ? taskId : uuidv4(),
        userId: state.user.id,
        title,
        description,
        status,
        priority,
        createdAt: isEditing ? getStoredTasks().find((t) => t.id === taskId)?.createdAt || now : now,
        updatedAt: now,
      };
      
      // Save the task
      saveTask(task);
      
      // Redirect back to tasks page
      navigate('/tasks');
    }
  };
  
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];
  
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/tasks')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h1>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Task Title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter task title"
              disabled={isLoading}
            />
            
            <Textarea
              label="Description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              disabled={isLoading}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Status"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'pending' | 'in-progress' | 'completed')}
                options={statusOptions}
                disabled={isLoading}
              />
              
              <Select
                label="Priority"
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                options={priorityOptions}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tasks')}
                className="mr-4"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                <Save className="h-4 w-4 mr-1" />
                {isEditing ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskForm;