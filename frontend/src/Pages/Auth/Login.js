import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../context/auth';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Grid,
    Snackbar,
    Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// StyledCard definition
const StyledCard = styled(Card)({
    maxWidth: 400,
    margin: 'auto',
    marginTop: '8rem', // Use fixed value instead of theme.spacing
    padding: '2rem', // Use fixed value instead of theme.spacing
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)', // Use fixed box shadow
});

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post(`/api/v1/auth/login`, { email, password });
            setLoading(false);

            if (data.success) {
                setAuth({ user: data.user, token: data.token });
                localStorage.setItem('auth', JSON.stringify({ user: data.user, token: data.token }));

                setSnackbarMessage('Login successful!');
                setOpenSnackbar(true);

                // Redirect based on user role
                if (data.user.role === 1) {
                    navigate('/admin-profile');
                } else if (data.user.role === "Resident") {
                    navigate('/resident-profile');
                } else if (data.user.role === "Waste Collector") {
                    navigate('/waste-collector-profile');
                } else {
                    navigate('/');
                }
            } else {
                setSnackbarMessage(data.message);
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setSnackbarMessage("Login failed. Please check your email and password.");
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <StyledCard>
                <CardContent>
                    <Typography variant="h5" align="center">
                        Login
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            style={{ marginBottom: 16 }}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                            style={{ marginBottom: 16 }}
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            type="submit" 
                            fullWidth 
                            style={{ marginTop: 16 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </form>
                </CardContent>
            </StyledCard>

            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default Login;
