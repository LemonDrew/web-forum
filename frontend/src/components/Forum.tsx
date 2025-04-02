import PostContainer from "./PostContainer";
import { useLocation } from "react-router-dom";
import AddPost from "./AddPost";
import Navbar from "./Navbar";
import React, { useState, useEffect } from "react"; // Import useEffect
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

// Slide transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Page where the forum is located
function Forum() {
  const location = useLocation();
  const user = location.state?.username; // Retrieves username from login page

  const [open, setOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null); // To hold the currently selected post for dialog
  const [data, setData] = useState([]); // State to store fetched data
  const [newComment, setNewComment] = useState(""); // State to hold the new comment input


  const retrieveData = async () => {
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

      // Assuming the data is a list of posts
      if (result && Array.isArray(result)) {
        alert("Successfully retrieved posts!");
        setData(result); // Update the state with fetched data
      } else {
        alert("Failed to retrieve posts: Data is not in expected format.");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Failed to retrieve posts. Please check the console for details.");
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    retrieveData(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount


  const refreshData = () => {
    retrieveData();
  }

  const handleClickOpen = (post) => {
    setCurrentPost(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentPost(null);
  };

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Do not submit empty comments

    const newCommentObj = {
      Name: user, // Assuming the username is stored in the `user` variable
      Message: newComment,
    };

    // Add the new comment to the current post
    const updatedPost = {
      ...currentPost,
      user_comments: [...currentPost.user_comments, newCommentObj],
    };

    // Update the current post in the state
    setCurrentPost(updatedPost);

    // Clear the comment input
    setNewComment("");

    // Ideally, send the new comment to the backend to save it
    // For now, we'll just update the state
    try {
      const response = await fetch(`http://localhost:8000/update/${currentPost.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        alert("Comment added successfully!");
      } else {
        alert("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error during comment submission:", error);
      alert("Failed to add comment. Please check the console for details.");
    }
  };




  return (
  
    <Box sx={{ padding: 3, mt: 10 }}> {/* Adjust `mt` based on NavBar height */}
      <Navbar user={user} />
      <AddPost user={user} refreshData={refreshData} />
      <Box sx={{ marginTop: 3 }}>
        {data.map((post, index) => (
          <Card key={index} sx={{ marginBottom: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                {post.topic}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Posted by {post.username}
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleClickOpen(post)}
                sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }}
              >
                See Comments
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog Box - Start */}
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
                  onClick={handleAddComment}
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
      {/* Dialog Box - End */}
    </Box>
  );
}

export default Forum;
