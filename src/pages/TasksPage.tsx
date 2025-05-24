import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import TaskList from '../components/tasks/TaskList';

const TasksPage: React.FC = () => {
  return (
    <AuthLayout requireAuth>
      <TaskList />
    </AuthLayout>
  );
};

export default TasksPage;