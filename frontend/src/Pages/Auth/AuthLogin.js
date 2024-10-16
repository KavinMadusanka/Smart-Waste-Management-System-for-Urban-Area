import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from '../../context/auth';
import { Container,Link, Box, Typography, TextField, Button, Paper } from '@mui/material';
import Header1 from '../../components/Layout/Header1';
import Footer from '../../components/Layout/Footer';

const AuthLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();

    const handleLoginClick = () => {
      navigate('/register-option'); // Redirect to the login page
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const res = await axios.post("/api/v1/auth/login", { email, password });
            if (res && res.data.success) {
                const { token, user, wasteCollector, role } = res.data;
    
                // Update auth context with user/shop/admin details
                setAuth({
                    ...auth,
                    token,
                    user,
                    wasteCollector: role === 2 ? wasteCollector : null,  // Only store shop if the user is a shop owner
                });
    
                // Store the token and user/shop/admin details in localStorage
                localStorage.setItem("auth", JSON.stringify({
                    token,
                    user,
                    wasteCollector: role === 2 ? wasteCollector : null,
                }));
    
                // Redirect based on role
                if (role === 2) {
                    navigate('/whome');  // Redirect shop owners to shop profile
                } else {
                    navigate('/');  // Redirect others to homepage
                }
    
                toast.success("Login successful");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log("Error:", error);
            toast.error("Something went wrong");
        }
    };    
    

    return (
      <Box>
        <Header1/>
            <Container maxWidth="xs">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 8,
                    }}
                >
                    <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                marginBottom: 2,
                            }}
                        >
                            Login
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    sx={{ marginTop: 2 }}
                                >
                                    Login
                                </Button>
                            </Box>
                        </form>
                        <br/>
                        <Box sx={{display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center'}}>
                        <br/>
                        <Typography>If you Don't have an Account, Please
                            <Link component="button" variant="body2" onClick={handleLoginClick} sx={{ cursor: 'pointer', color: 'green', marginLeft: 1 }}>
                            Register
                            </Link>
                        </Typography>
                  </Box>
                </Paper>
            </Box>
            </Container>
            <br/><br/><br/><br/>
            <Footer/>
        <Toaster />
  </Box>
    );
};

export default AuthLogin;
