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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ForumIcon from '@mui/icons-material/Forum';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import { motion } from 'framer-motion';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
    },
    secondary: {
      main: '#f50057', // Pink
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          height: '100%',
          width: '100%',
        },
        body: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        },
        '#root': {
          height: '100%',
          width: '100%',
        },
      },
    },
  },
});

// Create a wrapper component that will apply styles to ensure the background covers the whole screen
const GlobalStyles = () => (
  <style jsx global>{`
    html, body, #root {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      overflow-x: hidden;
    }
    body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-attachment: fixed;
      background-size: cover;
    }
  `}</style>
);

function LoginPage() {
    const navigate = useNavigate();
    const [inputStates, setInputStates] = useState({ username: "", newUsername: "" });
    const [error, setError] = useState(null); // State to track errors
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputStates((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (error) setError(null);
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

        setIsLoading(true);

        try {
            if (username) {
                inDataBase = await checkUserName(username);
            } else if (newUsername) {
                inDataBase = await RegisterUserName(newUsername);
            }

            if (inDataBase) {
                navigate("/Forum", { state: { username: username || newUsername } });
            } else {
                setError(username 
                    ? "Username not found. Try signing up instead." 
                    : "This username could not be registered. Please try another one.");
            }
        } catch (err) {
            setError("Connection error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    width: '100%',
                    padding: 2,
                    boxSizing: 'border-box',
                    margin: 0,
                }}
            >
                <Container maxWidth="sm">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper 
                            elevation={12}
                            sx={{ 
                                borderRadius: 4,
                                overflow: 'hidden',
                            }}
                        >
                            <Box 
                                sx={{ 
                                    backgroundColor: 'primary.main',
                                    padding: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    color: 'white',
                                }}
                            >
                                <ForumIcon sx={{ fontSize: 60, mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    Welcome to CommuNation
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mt: 1, textAlign: 'center' }}>
                                    Connect with others and join the conversation
                                </Typography>
                            </Box>
                            
                            <CardContent sx={{ padding: 4 }}>
                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={3}>
                                        <Box sx={{ position: 'relative' }}>
                                            <TextField
                                                name="username"
                                                label="Username"
                                                variant="outlined"
                                                value={inputStates.username}
                                                onChange={handleInputChange}
                                                disabled={inputStates.newUsername.length > 0}
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: <LoginIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                    }
                                                }}
                                            />
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                            <Divider sx={{ flexGrow: 1 }} />
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    mx: 2, 
                                                    fontWeight: 'bold',
                                                    color: 'text.secondary'
                                                }}
                                            >
                                                OR
                                            </Typography>
                                            <Divider sx={{ flexGrow: 1 }} />
                                        </Box>

                                        <TextField
                                            name="newUsername"
                                            label="Sign Up with New Username"
                                            variant="outlined"
                                            value={inputStates.newUsername}
                                            onChange={handleInputChange}
                                            disabled={inputStates.username.length > 0}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <PersonAddIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                }
                                            }}
                                        />
                                        
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Alert 
                                                    severity="error" 
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        boxShadow: 1
                                                    }}
                                                >
                                                    {error}
                                                </Alert>
                                            </motion.div>
                                        )}
                                        
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                disabled={isLoading}
                                                sx={{ 
                                                    py: 1.5, 
                                                    borderRadius: 2,
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold',
                                                    boxShadow: 3,
                                                    background: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)',
                                                    '&:hover': {
                                                        boxShadow: 6,
                                                    }
                                                }}
                                            >
                                                {isLoading ? "Connecting..." : "Enter Hub"}
                                            </Button>
                                        </motion.div>
                                    </Stack>
                                </form>
                            </CardContent>
                        </Paper>
                    </motion.div>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default LoginPage;