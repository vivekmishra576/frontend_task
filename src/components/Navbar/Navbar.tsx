import React from 'react';
import logoImage from '../../assests/logo.png';
import { Bell, ChevronDown } from 'lucide-react';
import authService from '../../services/auth';
import './Navbar.css';

interface NavbarProps {
  showLogo?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showLogo = false }) => {
  const user = authService.getUser();
  const userName = user?.name || user?.userId || 'Alex Wando';
  const userRole = user?.role || 'Admin';

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="header-navbar">
      <div className="header-left">
        {showLogo && (
          <img src={logoImage} alt="PrepRoute Logo" className="header-logo" />
        )}
      </div>

      <div className="header-right">
        <button className="icon-bell-btn" aria-label="Notifications">
          <Bell size={20} color="#6b7280" />
          <span className="bell-badge-dot"></span>
        </button>

        <div className="user-profile">
          <div className="avatar-box">
            <span className="avatar-initials">{getInitials(userName)}</span>
          </div>
          <div className="user-text">
            <span className="user-title">{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>
          <ChevronDown size={18} color="#6b7280" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
