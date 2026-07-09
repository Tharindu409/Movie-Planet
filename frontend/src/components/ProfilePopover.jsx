import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaBookmark, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { useUserContext } from "../contexts/UserContext";
import "../css/ProfilePopover.css";

const ProfilePopover = ({ avatarUrl, onLogout }) => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const popoverRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((open) => !open);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-popover" ref={popoverRef}>
      <button className="nav-avatar-btn" onClick={toggle} title="Open profile menu">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile avatar" className="nav-avatar" />
        ) : (
          <span className="nav-avatar-placeholder">me</span>
        )}
      </button>

      {isOpen && (
        <div className="popover-panel">
          <div className="popover-header">
            <img src={avatarUrl} alt="Avatar" className="popover-avatar" />
            <div>
              <div className="popover-name">{user?.name}</div>
              <div className="popover-username">{user?.email?.split("@")[0]}</div>
            </div>
          </div>

          <div className="popover-section">MY ACCOUNT</div>
          <button className="popover-item" onClick={() => { close(); navigate('/profile'); }}>
            <FaCog /> Account Settings
          </button>
          <button className="popover-item" onClick={() => { close(); navigate('/watchlist'); }}>
            <FaBookmark /> My Watchlist
          </button>
          <button className="popover-item" onClick={() => { close(); alert('Support is not available yet'); }}>
            <FaQuestionCircle /> Support
          </button>

          <div className="popover-divider" />
          <button className="popover-signout" onClick={() => { close(); onLogout(); }}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePopover;
