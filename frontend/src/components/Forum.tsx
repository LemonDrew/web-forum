import PostContainer from "./PostContainer";
import AddPost from "./AddPost";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 

// Page where the forum is located
function Forum() {



    return <h2>
      <AddPost/>
      <PostContainer/>
      </h2>;
}

const updateForum = async () => {
  try {
    const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
      });
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error during fetch:", error);
    return false; 
  }
};  
  



export default Forum;
  