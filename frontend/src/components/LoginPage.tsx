import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 

function LoginPage() {
    const navigate = useNavigate();
    const [inputStates, setInputStates] = useState({ username: "", newUsername: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setInputStates((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    function checkUserName(username) {
        return true;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const username = formData.get('username'); // Use correct name attribute
        let inDataBase = checkUserName(username);
        if (inDataBase) {
            navigate("/Forum");
        } else {
            alert("Such a username does not exist!")
        }
        
    }

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
