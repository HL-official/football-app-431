import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { TextField, Button, Typography, Paper, Container } from '@mui/material';

const LoginPage = () => {
  // Declare state variables for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setUser, setToken } = useContext(UserContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      // Redirect to user dashboard or load user-specific data
    } else {
      // Handle login failure
    }
  };

  // Render the login form
  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ padding: 20, marginTop: 40 }}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 30 }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
