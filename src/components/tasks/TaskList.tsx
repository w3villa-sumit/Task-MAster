import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Task } from '../../types';
import { getUserTasks, deleteTask } from '../../utils/localStorage';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import TaskListItem from './TaskListItem';

const TaskList: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Load tasks
  useEffect(() => {
    if (state.user) {
      const userTasks = getUserTasks(state.user.id);
      // Sort by updated date descending
      userTasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setTasks(userTasks);
      setFilteredTasks(userTasks);
    }
  }, [state.user]);
  
  // Filter tasks
  useEffect(() => {
    if (tasks.length) {
      let result = [...tasks];
      
      // Apply search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        result = result.filter(
          (task) => 
            task.title.toLowerCase().includes(search) || 
            task.description.toLowerCase().includes(search)
        );
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        result = result.filter((task) => task.status === statusFilter);
      }
      
      // Apply priority filter
      if (priorityFilter !== 'all') {
        result = result.filter((task) => task.priority === priorityFilter);
      }
      
      setFilteredTasks(result);
    }
  }, [tasks, searchTerm, statusFilter, priorityFilter]);
  
  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };
  
  const handleEditTask = (taskId: string) => {
    navigate(`/tasks/edit/${taskId}`);
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">My Tasks</h1>
        <Button 
          variant="primary" 
          onClick={() => navigate('/tasks/new')}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Task
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2 md:gap-4">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No tasks found.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/tasks/new')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Create your first task
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskListItem 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask} 
              onDelete={handleDeleteTask} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;