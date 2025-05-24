import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Task } from '../../types';
import { getUserTasks } from '../../utils/localStorage';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { CheckCircle, Circle, Clock, AlertTriangle, Plus } from 'lucide-react';
import TaskListItem from '../tasks/TaskListItem';

const DashboardOverview: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    highPriority: 0,
  });
  
  useEffect(() => {
    if (state.user) {
      const userTasks = getUserTasks(state.user.id);
      // Sort by updated date descending and limit to recent 5
      const recentTasks = [...userTasks]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);
      
      setTasks(recentTasks);
      
      // Calculate stats
      setStats({
        total: userTasks.length,
        completed: userTasks.filter((task) => task.status === 'completed').length,
        inProgress: userTasks.filter((task) => task.status === 'in-progress').length,
        pending: userTasks.filter((task) => task.status === 'pending').length,
        highPriority: userTasks.filter((task) => task.priority === 'high').length,
      });
    }
  }, [state.user]);
  
  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      navigate('/tasks');
    }
  };
  
  const handleEditTask = (taskId: string) => {
    navigate(`/tasks/edit/${taskId}`);
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Dashboard</h1>
        <Button 
          variant="primary" 
          onClick={() => navigate('/tasks/new')}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Circle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.completed}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full mr-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.inProgress}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">High Priority</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.highPriority}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/tasks')}
          >
            View All
          </Button>
        </div>
        
        {tasks.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No tasks yet. Create your first task to get started.</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/tasks/new')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create your first task
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
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
    </div>
  );
};

export default DashboardOverview;