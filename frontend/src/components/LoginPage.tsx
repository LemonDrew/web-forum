import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function LoginPage() {
    const navigate = useNavigate();
    const [inputStates, setInputStates] = useState({ username: "", newUsername: "" });
    const [error, setError] = useState(null); // State to track errors

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputStates((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const checkUserName = async (username) => {
        try {
            const response = await fetch('http://localhost:8000/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username }),
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error("Error during fetch:", error);
            return false;
        }
    };

    const RegisterUserName = async (username) => {
        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username }),
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error("Error during fetch:", error);
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = inputStates.username;
        const newUsername = inputStates.newUsername;
        let inDataBase = null;

        if (!username && !newUsername) {
            setError("Please enter a username.");
            return;
        }

        if (username) {
            inDataBase = await checkUserName(username);
        } else if (newUsername) {
            inDataBase = await RegisterUserName(newUsername);
        }

        if (inDataBase) {
            navigate("/Forum", { state: { username: username || newUsername } });
        } else {
            setError("Such a username does not exist or could not be registered.");
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Card sx={{ minWidth: 400, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 3, fontWeight: 'bold' }}>
                        Welcome to the Hub
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                name="username"
                                label="Username"
                                value={inputStates.username}
                                onChange={handleInputChange}
                                disabled={inputStates.newUsername.length > 0}
                                fullWidth
                            />
                            <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                OR
                            </Typography>
                            <TextField
                                name="newUsername"
                                label="Sign Up"
                                value={inputStates.newUsername}
                                onChange={handleInputChange}
                                disabled={inputStates.username.length > 0}
                                fullWidth
                            />
                            {error && (
                                <Alert severity="error" sx={{ marginTop: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }}
                            >
                                Enter
                            </Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default LoginPage;