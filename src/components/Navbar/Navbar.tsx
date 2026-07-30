import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assests/logo.png';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import authService from '../../services/auth';
import './Navbar.css';

interface NavbarProps {
  showLogo?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showLogo = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="header-navbar">
      <div className="header-left">
        {/* {showLogo && (
          <img src={logoImage} alt="PrepRoute Logo" className="header-logo" />
        )} */}
      </div>

      <div className="header-right">
        <button className="icon-bell-btn" aria-label="Notifications">
          <Bell size={20} color="#6b7280" />
          <span className="bell-badge-dot"></span>
        </button>

        <div className="user-profile-container" ref={dropdownRef}>
          <div className="user-profile" onClick={toggleDropdown}>
            <div className="avatar-box">
              <span className="avatar-initials">{getInitials(userName)}</span>
            </div>
            <div className="user-text">
              <span className="user-title">{userName}</span>
              <span className="user-role">{userRole}</span>
            </div>
            <ChevronDown 
              size={18} 
              color="#6b7280" 
              className={`chevron-icon ${isDropdownOpen ? 'rotated' : ''}`}
            />
          </div>

          {isDropdownOpen && (
            <div className="user-dropdown">
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
