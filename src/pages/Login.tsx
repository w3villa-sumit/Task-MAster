import React from 'react';
import AuthForm from '../components/auth/AuthForm';
import AuthLayout from '../components/layout/AuthLayout';

const Login: React.FC = () => {
  return (
    <AuthLayout>
      <AuthForm type="login" />
    </AuthLayout>
  );
};

export default Login;