import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  People,
  ShoppingBag,
  Dashboard as DashboardIcon,
  Settings,
  ExitToApp,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Products from './Products';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5001/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, count: null },
    { id: 'products', label: 'Products', icon: <ShoppingBag />, count: stats.products },
    { id: 'settings', label: 'Settings', icon: <Settings />, count: null },
  ];

  const StatCard = ({ title, value, icon }) => (
    <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: 'white', opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (selectedMenu) {
      case 'products':
        return <Products />;
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5">Settings</Typography>
            <Typography variant="body1">Settings page is under construction.</Typography>
          </Box>
        );
      default:
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Stats Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Products" value={stats.products} icon={<ShoppingBag fontSize="large" />} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Orders" value={stats.orders} icon={<ShoppingBag fontSize="large" />} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Revenue" value={`$${stats.revenue}`} icon={<DashboardIcon fontSize="large" />} />
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Welcome to your dashboard. Use the menu to navigate to different sections.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Paper
        sx={{
          width: 240,
          minHeight: '100vh',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          position: 'fixed',
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Admin Panel
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.id}
              selected={selectedMenu === item.id}
              onClick={() => setSelectedMenu(item.id)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#e8eaf6',
                  '&:hover': {
                    backgroundColor: '#e8eaf6',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: selectedMenu === item.id ? '#1a237e' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{ color: selectedMenu === item.id ? '#1a237e' : 'inherit' }}
              />
              {item.count && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {item.count}
                </Typography>
              )}
            </ListItem>
          ))}
          <Divider sx={{ my: 2 }} />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Paper>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, ml: '240px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <AppBar 
          position="static" 
          sx={{ 
            backgroundColor: 'white',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <Toolbar>
            <IconButton edge="start" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: 'black', flexGrow: 1 }}>
              {menuItems.find(item => item.id === selectedMenu)?.label}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'black' }}>
              Welcome, {user?.name}
            </Typography>
          </Toolbar>
        </AppBar>

        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard; 