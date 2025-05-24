import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import TaskForm from '../components/tasks/TaskForm';

const EditTask: React.FC = () => {
  return (
    <AuthLayout requireAuth>
      <TaskForm />
    </AuthLayout>
  );
};

export default EditTask;