import React from 'react'
import AdminMenu from '../../components/Layout/AdminMenu';
import Header1 from '../../components/Layout/Header1';
import { Box } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Box>
      <Header1/>
    <div>
    <AdminMenu/>
    <div>Dashboard</div>
    </div>
    </Box>
  )
}

export default AdminDashboard