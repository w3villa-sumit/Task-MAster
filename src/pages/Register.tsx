import React from 'react';
import AuthForm from '../components/auth/AuthForm';
import AuthLayout from '../components/layout/AuthLayout';

const Register: React.FC = () => {
  return (
    <AuthLayout>
      <AuthForm type="register" />
    </AuthLayout>
  );
};

export default Register;