import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, BarChart2, Settings } from 'lucide-react';
import { cn } from './ui/Button';

export const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe">
      <div className="max-w-md mx-auto flex justify-between px-2">
        <NavItem to="/" icon={<Home size={24} />} label="Heute" />
        <NavItem to="/history" icon={<CalendarDays size={24} />} label="Verlauf" />
        <NavItem to="/weekly" icon={<BarChart2 size={24} />} label="Wochen" />
        <NavItem to="/settings" icon={<Settings size={24} />} label="Menü" />
      </div>
    </nav>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center w-full py-3 gap-1 rounded-xl transition-colors",
          isActive 
            ? "text-blue-600 dark:text-blue-400" 
            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        )
      }
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};
