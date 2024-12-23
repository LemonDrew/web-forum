import React from 'react';
import { useNavigate } from 'react-router-dom'; 

function LoginPage() {
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const username = formData.get('username'); // Use correct name attribute
        navigate("/Forum");
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <p>Please enter your username:</p>
                <p><input name="username" /> {/* Correct the name to match formData.get */}</p>
            </label>
            <button type="submit">Enter</button>
        </form>
    );
}

export default LoginPage;
