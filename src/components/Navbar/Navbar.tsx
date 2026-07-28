import React from 'react';
import logoImage from '../../assests/logo.png';
import { Bell, ChevronDown } from 'lucide-react';
import authService from '../../services/auth';
import './Navbar.css';

interface NavbarProps {
  hideLogo?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ hideLogo = false }) => {
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
        {!hideLogo && (
          <img src={logoImage} alt="PrepRoute Logo" className="header-logo" />
        )}
      </div>

      <div className="header-right">
        <button className="icon-bell-btn">
          <Bell size={18} color="#64748b" />
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
          <ChevronDown size={14} color="#64748b" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
