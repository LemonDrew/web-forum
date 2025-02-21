import React, { useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./AddPost.css";

function AddPost({ user, refreshData }) {  // Receive refreshData as a prop
    const [topic, setTopic] = useState("");
    const [type, setType] = useState("");
  
    const handleTopic = (event) => setTopic(event.target.value);
    const handleType = (event) => setType(event.target.value);
  
    const onPressLearnMore = async () => {
      try {
        console.log("Sending request with:", { topic, type, user });
  
        const response = await fetch('http://localhost:8000/addPost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Topic: topic, Type: type, Username: user }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Post Added Response:", data);
  
        if (data.success) {
          alert("Successfully added post");
          refreshData(); // Trigger forum to refresh its data
        } else {
          alert(`Failed to add post: ${data.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        alert("Failed to add post. Please check the console for details.");
      }
    };
  
    return (
      <div className="addpost">
        <FormControl fullWidth style={{ marginBottom: "1rem" }}>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            onChange={handleType}
            label="Type"
          >
            <MenuItem value={"Help"}>Help</MenuItem>
            <MenuItem value={"Discussion"}>Discussion</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
          </Select>
        </FormControl>
  
        <textarea
          placeholder="Enter Topic"
          value={topic}
          onChange={handleTopic}
          className="input-field"
          style={{
            width: "100%",
            height: "100px",
            resize: "vertical",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
  
        <Button
          onClick={onPressLearnMore}
          variant="contained"
          color="secondary"
          aria-label="Add Post"
          style={{ marginTop: "1rem" }}
          disabled={topic.trim() === "" || type.trim() === ""}
        >
          Add Post
        </Button>
      </div>
    );
  }
  
  export default AddPost;