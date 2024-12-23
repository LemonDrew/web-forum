function LoginPage() {
    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const username = formData.get('name');
        console.log("User has entered his name", username);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <p>Please enter your username:</p>
                <p><input name="name" /></p>
            </label>
            <button type="submit">Enter Web Forum</button>
        </form>
    );
}

export default LoginPage;
