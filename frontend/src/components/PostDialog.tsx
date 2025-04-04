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

// Slide transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PostDialog({ open, handleClose, currentPost, user, handleAddComment }) {
  const [newComment, setNewComment] = useState("");

  // Local function to handle comment submission
  const submitComment = () => {
    if (!newComment.trim()) return;
    handleAddComment(newComment);
    setNewComment("");
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      {/* AppBar inside Dialog for header */}
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Post Details
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 3 }}>
        {/* Render current post's details */}
        {currentPost ? (
          <>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
              {currentPost.topic}
            </Typography>
            <Divider sx={{ marginBottom: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Comments:
            </Typography>

            {/* Comments List */}
            <List>
              {currentPost.user_comments && currentPost.user_comments.length > 0 ? (
                currentPost.user_comments.map((comment, i) => (
                  <ListItem key={i} sx={{ paddingLeft: 0 }}>
                    <ListItemText
                      primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{comment.Name}</Typography>}
                      secondary={<Typography variant="body2">{comment.Message}</Typography>}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2">No comments available.</Typography>
              )}
            </List>

            {/* Add Comment Section */}
            <Box sx={{ marginTop: 3 }}>
              <TextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                multiline
                rows={4}
                sx={{ marginBottom: 2 }}
              />
              <Button
                variant="contained"
                onClick={submitComment}
                sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }}
              >
                Add Comment
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body1">No post selected.</Typography>
        )}
      </Box>
    </Dialog>
  );
}

export default PostDialog;