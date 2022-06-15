import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext.js";

// pages and components
import Create from "./pages/create/Create.js";
import Dashboard from "./pages/dashboard/Dashboard.js";
import Login from "./pages/login/Login.js";
import Project from "./pages/project/Project.js";
import Signup from "./pages/signup/Signup.js";
import Navbar from "./components/Navbar.js";
import Sidebar from "./components/Sidebar.js";
import OnlineUsers from "./components/OnlineUsers.js";

// styles
import "./App.css";

function App() {
  const { user, authReady } = useAuthContext();

  return (
    <div className="App">
      {authReady && (
        <BrowserRouter>
          {user && <Sidebar />}
          <div className="container">
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={user ? <Dashboard /> : <Navigate to="login" />}
              ></Route>
              <Route
                path="create"
                element={user ? <Create /> : <Navigate to="/login" />}
              ></Route>
              <Route
                path="login"
                element={user ? <Navigate to="/" /> : <Login />}
              ></Route>
              <Route
                path="signup"
                element={user ? <Navigate to="/" /> : <Signup />}
              ></Route>
              <Route
                path="project/:id"
                element={user ? <Project /> : <Navigate to="/login" />}
              ></Route>
            </Routes>
          </div>
          {user && <OnlineUsers />}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
