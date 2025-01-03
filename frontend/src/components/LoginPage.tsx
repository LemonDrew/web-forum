import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 

function LoginPage() {
    const navigate = useNavigate();
    const [inputStates, setInputStates] = useState({ username: "", newUsername: "" });
    const [isValid, setIsValid] = useState(null); // State to track username validity

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setInputStates((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const checkUserName = async (username) => {
        try {
            const response = await fetch('http://localhost:8000/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username }),
            });
            const data = await response.json();
            console.log("-----------DATA IS---------", data);
            return data.success; 
        } catch (error) {
            console.error("Error during fetch:", error);
            return false; 
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = inputStates.username;

        if (!username) {
            alert("Please enter a username.");
            return;
        }

        const inDataBase = await checkUserName(username);
        if (inDataBase) {
            navigate("/Forum");
        } else {
            alert("Such a username does not exist!");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <p>Please enter your username:</p>
                <input
                    name="username"
                    value={inputStates.username}
                    onChange={handleInputChange}
                    disabled={inputStates.newUsername.length > 0} // Disable if the other field has content
                />
                <br />
                <p>Sign Up</p>
                <input
                    name="newUsername"
                    value={inputStates.newUsername}
                    onChange={handleInputChange}
                    disabled={inputStates.username.length > 0} // Disable if the other field has content
                />
            </label>
            <p></p>
            <button type="submit">Enter</button>
        </form>
    );
}

export default LoginPage;
