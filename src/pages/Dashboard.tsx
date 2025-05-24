import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardOverview from '../components/dashboard/DashboardOverview';

const Dashboard: React.FC = () => {
  return (
    <AuthLayout requireAuth>
      <DashboardOverview />
    </AuthLayout>
  );
};

export default Dashboard;