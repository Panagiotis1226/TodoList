import React from 'react';
import './App.css';
import TodoList from './components/Todo';
import { Container, CssBaseline, Typography, Box } from '@mui/material';

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Todo Application
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
            This application demonstrates various design patterns including Creational, Structural, and Behavioral patterns.
          </Typography>
          <TodoList />
        </Box>
      </Container>
    </div>
  );
}

export default App;
