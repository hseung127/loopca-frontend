import { Link, useLocation } from "react-router-dom";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import "./../styles/BottomNav.css";

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}>
        <HomeIcon className="icon" />
        <span>Home</span>
      </Link>
      <Link to="/profile" className={`nav-btn ${location.pathname === "/profile" ? "active" : ""}`}>
        <UserIcon className="icon" />
        <span>Profile</span>
      </Link>
    </nav>
  );
}
