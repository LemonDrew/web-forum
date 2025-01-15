import React, { useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./AddPost.css";

function AddPost() {
    const [topic, setTopic] = useState("");
    const [type, setType] = useState("");

    const handleTopic = (event) => {
        setTopic(event.target.value);
    };

    const handleType = (event) => {
        setType(event.target.value);
    };

    const onPressLearnMore = async () => {
        try {
            // Debugging: Log values being sent to the server
            console.log("Sending request with:", { topic, type });
    
            const response = await fetch('http://localhost:8000/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "Topic" : topic, "Type" : type, "ID": 1 }),
            });
    
            // Check for HTTP errors
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
    
            console.log("-----------DATA IS---------", data);
    
            if (data.success) {
                alert("Successfully added Post");
            } else {
                alert(`Failed to add post: ${data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            alert("Failed to add post. Please check the console for details.");
        }
    };
    

    // Determine if the button should be disabled
    const isButtonDisabled = topic.trim() === "" || type.trim() === "";

    return (
        <div>
            <div className="addPost">
                <input
                    type="text"
                    placeholder="Enter Topic"
                    value={topic}
                    onChange={handleTopic}
                    className="input-field"
                />
                <FormControl fullWidth style={{ marginTop: "1rem" }}>
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
                <Button
                    onClick={onPressLearnMore}
                    variant="contained"
                    color="secondary"
                    aria-label="Add Post"
                    style={{ marginTop: "1rem" }}
                    disabled={isButtonDisabled} // Disable the button if inputs are empty
                >
                    Add Post
                </Button>
            </div>
        </div>
    );
}

export default AddPost;
