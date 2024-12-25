import React from "react";
import Button from "@mui/material/Button";

function AddPost() {
    return (
        <div>
            <p>This is a post</p>
            <Button
                onClick={onPressLearnMore}
                variant="contained"
                color="secondary"
                aria-label="Add Post"
            >
                Add Post
            </Button>
        </div>
    );
}

function onPressLearnMore() {
    alert("Adding Post")
}

export default AddPost;
