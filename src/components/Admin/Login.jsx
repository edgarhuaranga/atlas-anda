import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, CssBaseline } from '@mui/material';
import { login } from '../../api/adminClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ maxWidth: 360, margin: '80px auto', padding: 3 }}>
        <Typography variant="h5" gutterBottom>Admin</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth type="password" label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
          <Button fullWidth type="submit" variant="contained">Entrar</Button>
        </form>
      </Box>
    </>
  );
};

export default Login;
