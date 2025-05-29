import React from 'react';
import { Typography, Container } from '@mui/material';

const LandingPage = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Lunevia Clothing
      </Typography>
    </Container>
  );
};

export default LandingPage; 