import { Link, Route, Routes } from "react-router-dom"; 
import LoginPage from "./components/LoginPage";
import Forum from "./components/Forum";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Route to LoginPage */}
        <Route path="/Forum" element={<Forum />} /> {/* Route to Forum */}
      </Routes>
    </div>
  );
}

export default App;
