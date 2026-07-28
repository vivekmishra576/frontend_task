import React from 'react';
import { NavLink } from 'react-router-dom';
import { TrendingUp, Edit3, ClipboardList } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = true }) => {
  return (
    <aside className={`icon-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <nav className="icon-sidebar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `icon-sidebar-item ${isActive ? 'active' : ''}`}
          title="Dashboard"
        >
          <TrendingUp size={18} />
        </NavLink>

        <NavLink
          to="/tests/create"
          className={({ isActive }) => `icon-sidebar-item ${isActive ? 'active' : ''}`}
          title="Test Creation"
        >
          <Edit3 size={18} />
        </NavLink>

        <div className="icon-sidebar-item disabled" title="Test Tracking">
          <ClipboardList size={18} />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
