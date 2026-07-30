import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SquarePen, CalendarSearch ,TrendingUp } from 'lucide-react';
import logoImage from '../../assests/logo.png';
import './Sidebar.css';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const location = useLocation();
  
  const isTestCreationActive = location.pathname.startsWith('/tests');

  return (
    <aside className={`sidebar-container ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="sidebar-logo-box">
        <img src={logoImage} alt="PrepRoute Logo" className="sidebar-logo" />
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <TrendingUp size={18} strokeWidth={2} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/tests/create"
          className={`sidebar-item ${isTestCreationActive ? 'active' : ''}`}
        >
          <SquarePen size={18} strokeWidth={2} />
          <span>Test Creation</span>
        </NavLink>

        <div className="sidebar-item disabled">
          <CalendarSearch size={18} strokeWidth={2} />
          <span>Test Tracking</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
