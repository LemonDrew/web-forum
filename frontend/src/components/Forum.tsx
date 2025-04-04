import PostContainer from "./PostContainer";
import { useLocation } from "react-router-dom";
import AddPost from "./AddPost";
import Navbar from "./Navbar";
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import PostDialog from './PostDialog';
import ForumIcon from '@mui/icons-material/Forum';
import PersonIcon from '@mui/icons-material/Person';
import CommentIcon from '@mui/icons-material/Comment';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f7fa',
    },
  },
});

function Forum() {
  const location = useLocation();
  const user = location.state?.username;

  const [open, setOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const retrieveData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/retrieve', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("-----------DATA IS---------", result);

      if (result && Array.isArray(result)) {
        setData(result);
      } else {
        alert("Failed to retrieve posts: Data is not in expected format.");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Failed to retrieve posts. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  const refreshData = () => {
    retrieveData();
  };

  const handleClickOpen = (post) => {
    setCurrentPost(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentPost(null);
  };

  const handleAddComment = async (commentText) => {
    const newCommentObj = {
      Name: user,
      Message: commentText,
    };

    const updatedPost = {
      ...currentPost,
      user_comments: [...currentPost.user_comments, newCommentObj],
    };

    setCurrentPost(updatedPost);

    try {
      const response = await fetch(`http://localhost:8000/update/${currentPost.identity_number}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        // Success notification could be improved with a snackbar instead of alert
        alert("Comment added successfully!");
      } else {
        alert("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error during comment submission:", error);
      alert("Failed to add comment. Please check the console for details.");
    }
  };

  // Function to get initial letter for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // Function to generate a consistent color based on username
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh',
        pt: 10, 
        pb: 5 
      }}>
        <Navbar user={user} />
        <Container maxWidth="md">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <ForumIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Community Forum
            </Typography>
          </Box>
          
          <AddPost user={user} refreshData={refreshData} />
          
          <Box sx={{ mt: 4 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : data.length === 0 ? (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No posts yet. Be the first to start a discussion!
                </Typography>
              </Card>
            ) : (
              [...data].reverse().map((post, index) => (
                <Card 
                  key={index} 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            bgcolor: stringToColor(post.username),
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                          }}
                        >
                          {getInitial(post.username)}
                        </Avatar>
                      </Grid>
                      <Grid item xs={12} sm={10}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            {post.topic}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              Posted by {post.username}
                            </Typography>
                          </Box>
                          {post.user_comments && (
                            <Chip 
                              icon={<CommentIcon />}
                              label={`${post.user_comments.length} comment${post.user_comments.length !== 1 ? 's' : ''}`}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                          )}
                        </Box>
                        <Button
                          variant="contained"
                          onClick={() => handleClickOpen(post)}
                          sx={{ 
                            borderRadius: 8,
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 8px rgba(63, 81, 181, 0.2)',
                            '&:hover': {
                              boxShadow: '0 6px 12px rgba(63, 81, 181, 0.3)',
                            }
                          }}
                        >
                          View Discussion
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Container>

        <PostDialog 
          open={open} 
          handleClose={handleClose} 
          currentPost={currentPost} 
          user={user} 
          handleAddComment={handleAddComment} 
        />
      </Box>
    </ThemeProvider>
  );
}

export default Forum;