import PostContainer from "./PostContainer";
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

// Slide transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Page where the forum is located
function Forum() {
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
    <div>
      <AddPost />
      {data.map((post, index) => (
        <div key={index}>
          <p>{post.Topic}</p>
          <Button variant="outlined" onClick={() => handleClickOpen(post)}>
            See Comments
          </Button>
        </div>
      ))}

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
        <div style={{ padding: 20 }}>
          {currentPost ? (
            <>
              <h2>{currentPost.Topic}</h2>
              <h3>Comments:</h3>
              <ul>
                {currentPost.Comments.map((comment, i) => (
                  <li key={i}>
                    <strong>{comment.Name}:</strong> {comment.Message}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No post selected.</p>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default Forum;
