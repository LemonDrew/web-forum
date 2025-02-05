import PostContainer from "./PostContainer";
import { useLocation } from "react-router-dom";

import AddPost from "./AddPost";
import React, { useState } from "react";
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

// Slide transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Page where the forum is located
function Forum() {
  const location = useLocation();
  const user = location.state?.username; //Retrieves username from login page

  const data = [
    { Topic: "This is the first post", Comments: [{ Name: "Jack", Message: "What??" }, { Name: "Jane", Message: "Hello" }] },
    { Topic: "This is the second post", Comments: [{ Name: "Jack", Message: "What??" }] }
  ];

  const [open, setOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null); // To hold the currently selected post for dialog

  const handleClickOpen = (post) => {
    setCurrentPost(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentPost(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <AddPost user={user} />
      <Box sx={{ marginTop: 3 }}>
        {data.map((post, index) => (
          <Card key={index} sx={{ marginBottom: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                {post.Topic}
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

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
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
          {currentPost ? (
            <>
              <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                {currentPost.Topic}
              </Typography>
              <Divider sx={{ marginBottom: 3 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                Comments:
              </Typography>
              <List>
                {currentPost.Comments.map((comment, i) => (
                  <ListItem key={i} sx={{ paddingLeft: 0 }}>
                    <ListItemText
                      primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{comment.Name}</Typography>}
                      secondary={<Typography variant="body2">{comment.Message}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Typography variant="body1">No post selected.</Typography>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}

export default Forum;