import { NavLink } from "react-router-dom";
import Avatar from "./Avatar.js";
import { useAuthContext } from "../hooks/useAuthContext.js";

// styles and images
import "./Sidebar.css";
import DashboardIcon from "../assets/dashboard_icon.svg";
import AddIcon from "../assets/add_icon.svg";

export default function Sidebar() {
  const { user } = useAuthContext();

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user">
          <Avatar src={user.photoURL} />
          <p>Hello, {user.displayName}</p>
        </div>
        <nav className="links">
          <ul>
            <li>
              <NavLink to="/">
                <img src={DashboardIcon} alt="Dashboard Icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="create">
                <img src={AddIcon} alt="Add Project Icon" />
                <span>New Project</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
