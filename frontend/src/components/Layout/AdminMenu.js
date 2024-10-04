import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Divider } from '@mui/material';
import { ExpandLess, ExpandMore, Dashboard, People, Schedule, BarChart, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const AdminMenu = () => {
  const [openUsers, setOpenUsers] = useState(false);
  const [openWaste, setOpenWaste] = useState(false);

  // Handle expanding/collapsing sub-menus
  const handleClickUsers = () => {
    setOpenUsers(!openUsers);
  };

  const handleClickWaste = () => {
    setOpenWaste(!openWaste);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {/* Dashboard */}
          <ListItem button component={Link} to="/admin/dashboard">
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <Divider />

          {/* User Management */}
          <ListItem button onClick={handleClickUsers}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="User Management" />
            {openUsers ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openUsers} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/admin/users/residents">
                <ListItemText primary="Residents" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/admin/users/collectors">
                <ListItemText primary="Waste Collectors" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/admin/users/admins">
                <ListItemText primary="Admins" />
              </ListItem>
            </List>
          </Collapse>

          <Divider />

          {/* Waste Collection Management */}
          <ListItem button onClick={handleClickWaste}>
            <ListItemIcon>
              <Schedule />
            </ListItemIcon>
            <ListItemText primary="Waste Collection" />
            {openWaste ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openWaste} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/schedule-management">
                <ListItemText primary="Schedule Management" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/admin/waste/history">
                <ListItemText primary="Collection History" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/admin/waste/reports">
                <ListItemText primary="Collection Reports" />
              </ListItem>
            </List>
          </Collapse>

          <Divider />

          {/* Analytics */}
          <ListItem button component={Link} to="/admin/reports">
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText primary="Reports & Analytics" />
          </ListItem>

          <Divider />

          {/* Settings */}
          <ListItem button component={Link} to="/admin/settings">
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="System Settings" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminMenu;
