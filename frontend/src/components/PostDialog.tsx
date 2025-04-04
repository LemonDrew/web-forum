import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import SendIcon from '@mui/icons-material/Send';
import ForumIcon from '@mui/icons-material/Forum';
import PersonIcon from '@mui/icons-material/Person';
import CommentIcon from '@mui/icons-material/Comment';

// Slide transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PostDialog({ open, handleClose, currentPost, user, handleAddComment }) {
  const [newComment, setNewComment] = useState("");

  console.log("currentPost is", currentPost)
  // Local function to handle comment submission
  const submitComment = () => {
    if (!newComment.trim()) return;
    handleAddComment(newComment);
    setNewComment("");
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

  // Format date (if you have timestamp data)
  const formatDate = (dateString) => {
    if (!dateString) return ""; 
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative', bgcolor: '#3f51b5' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <ForumIcon sx={{ mr: 2 }} />
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            Discussion Thread
          </Typography>
        </Toolbar>
      </AppBar>

      {currentPost ? (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 2,
              bgcolor: '#f8f9ff'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: stringToColor(currentPost.username),
                  mr: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                {getInitial(currentPost.username)}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {currentPost.topic}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Posted by {currentPost.username}
                  </Typography>
                </Box>
                {currentPost.createdAt && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    {formatDate(currentPost.createdAt)}
                  </Typography>
                )}
              </Box>
            </Box>
            
            {currentPost.content && (
              <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                {currentPost.content}
              </Typography>
            )}
          </Paper>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CommentIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Comments ({currentPost.user_comments?.length || 0})
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {currentPost.user_comments && currentPost.user_comments.length > 0 ? (
              <List sx={{ mb: 4 }}>
                {currentPost.user_comments.map((comment, i) => (
                  <Paper 
                    key={i} 
                    elevation={1} 
                    sx={{ 
                      mb: 3, 
                      p: 0, 
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <ListItem 
                      sx={{ 
                        p: 0,
                        display: 'block'
                      }}
                    >
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: '#f5f7fa',
                        borderBottom: '1px solid #e0e0e0',
                        display: 'flex', 
                        alignItems: 'center' 
                      }}>
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            mr: 2,
                            bgcolor: stringToColor(comment[0])
                          }}
                        >
                          {getInitial(comment[0])}
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {comment[0]}
                        </Typography>
                      </Box>
                      <Box sx={{ p: 3 }}>
                        <Typography variant="body1">{comment[1]}</Typography>
                      </Box>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            ) : (
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  mb: 4,
                  borderRadius: 2
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No comments yet. Be the first to comment!
                </Typography>
              </Paper>
            )}
          </Box>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: '#fbfbfb'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 28, 
                  height: 28, 
                  mr: 1.5,
                  fontSize: '0.875rem',
                  bgcolor: stringToColor(user)
                }}
              >
                {getInitial(user)}
              </Avatar>
              Add your comment
            </Typography>
            
            <TextField
              label="Write your thoughts..."
              variant="outlined"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
              rows={4}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#3f51b5',
                  },
                },
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={submitComment}
                endIcon={<SendIcon />}
                disabled={!newComment.trim()}
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
                Post Comment
              </Button>
            </Box>
          </Paper>
        </Container>
      ) : (
        <Container sx={{ py: 5, textAlign: 'center' }}>
          <Typography variant="body1">No post selected.</Typography>
        </Container>
      )}
    </Dialog>
  );
}

export default PostDialog;