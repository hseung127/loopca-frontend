import { PencilSquareIcon, ArrowLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import "./../styles/Header.css";
import { useNavigate } from "react-router-dom";

export default function Header({ title, showEditBtn, showBackBtn, showSettingsBtn }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h2 className="title">{title}</h2>

      {showEditBtn && (
        <button className="icon-btn">
          <PencilSquareIcon className="icon" />
        </button>
      )}
      {showBackBtn && (
        <button className="back-btn">
          <ArrowLeftIcon className="icon" onClick={() => navigate("/")}  />
        </button>
      )}
      {showSettingsBtn && (
        <button className="icon-btn">
          <Cog6ToothIcon className="icon" />
        </button>
      )}
    </header>
  );
}
