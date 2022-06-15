import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout.js";
import { useAuthContext } from "../hooks/useAuthContext.js";

// styles & images
import "./Navbar.css";
import Temple from "../assets/temple.svg";

export default function Navbar() {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();

  return (
    <div className="navbar">
      <div className="navbar-content">
        <ul>
          <li className="logo">
            <img src={Temple} alt="dojo logo" />
            <span>The Dojo</span>
          </li>
          {!user && (
            <>
              <li>
                <Link to="login">Login</Link>
              </li>
              <li>
                <Link to="signup">Signup</Link>
              </li>
            </>
          )}
          {user && (
            <>
              {!isPending && (
                <button className="btn" onClick={logout}>
                  Logout
                </button>
              )}
              {isPending && (
                <button className="btn" disabled>
                  Logging out...
                </button>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
