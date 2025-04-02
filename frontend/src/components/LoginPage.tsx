import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
          height: '100%',
          width: '100%',
        },
        body: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          overflow: 'hidden',
        },
        '#root': {
          height: '100%',
          width: '100%',
        },
      },
    },
  },
});

// Interactive Background Canvas
const InteractiveBackground = () => {
  const canvasRef = useRef(null);
  const balls = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  
  // Initialize canvas and balls
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create balls
    balls.current = [];
    for (let i = 0; i < 23; i++) {
      balls.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 100 + 10,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        color: getRandomColor(0.99),
      });
    }
    
    // Mouse move event
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      balls.current.forEach(ball => {
        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
        
        // Ball movement
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Bounce off walls
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
          ball.dx = -ball.dx;
        }
        
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
          ball.dy = -ball.dy;
        }
        
        // Interact with mouse
        const distance = Math.sqrt(
          Math.pow(mouse.current.x - ball.x, 2) + 
          Math.pow(mouse.current.y - ball.y, 2)
        );
        
        if (distance < 100) {
          // Push ball away from cursor
          const angle = Math.atan2(
            ball.y - mouse.current.y,
            ball.x - mouse.current.x
          );
          
          const force = (100 - distance) / 10;
          ball.dx += Math.cos(angle) * force * 0.2;
          ball.dy += Math.sin(angle) * force * 0.2;
          
          // Limit speed
          const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
          if (speed > 10) {
            ball.dx = (ball.dx / speed) * 10;
            ball.dy = (ball.dy / speed) * 10;
          }
        }
        
        // Add friction
        ball.dx *= 0.99;
        ball.dy *= 0.99;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  // Helper function to generate random colors
  const getRandomColor = (opacity) => {
    const colors = [
      `rgba(255, 255, 255, ${opacity})`,
      `rgba(173, 216, 230, ${opacity})`,
      `rgba(240, 248, 255, ${opacity})`,
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};

function LoginPage() {
    const navigate = useNavigate();
    const [inputStates, setInputStates] = useState({ username: "", newUsername: "" });
    const [error, setError] = useState(null);
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
            <InteractiveBackground />
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
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Container maxWidth="sm">
                    <Paper 
                        elevation={12}
                        sx={{ 
                            borderRadius: 4,
                            overflow: 'hidden',
                            animation: 'fadeIn 0.8s ease-out',
                            '@keyframes fadeIn': {
                                '0%': {
                                    opacity: 0,
                                    transform: 'translateY(-20px)'
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'translateY(0)'
                                }
                            },
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-5px)'
                            }
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
                                Welcome to the Hub
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
                                        <Alert 
                                            severity="error" 
                                            sx={{ 
                                                borderRadius: 2,
                                                boxShadow: 1,
                                                animation: 'fadeIn 0.3s ease-out',
                                            }}
                                        >
                                            {error}
                                        </Alert>
                                    )}
                                    
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
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: 6,
                                                transform: 'scale(1.02)'
                                            },
                                            '&:active': {
                                                transform: 'scale(0.98)'
                                            }
                                        }}
                                    >
                                        {isLoading ? "Connecting..." : "Enter Hub"}
                                    </Button>
                                </Stack>
                            </form>
                        </CardContent>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default LoginPage;