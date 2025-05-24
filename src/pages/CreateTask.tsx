import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import TaskForm from '../components/tasks/TaskForm';

const CreateTask: React.FC = () => {
  return (
    <AuthLayout requireAuth>
      <TaskForm />
    </AuthLayout>
  );
};

export default CreateTask;