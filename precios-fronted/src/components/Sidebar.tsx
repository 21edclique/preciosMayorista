import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FcRules } from "react-icons/fc";
import { FcKindle, FcBusinessman, FcStatistics } from "react-icons/fc";
import { FiX } from "react-icons/fi";
import { FcStackOfPhotos } from "react-icons/fc";
import { FcGoodDecision } from "react-icons/fc";
import { FcCalculator } from "react-icons/fc";
import { FcCurrencyExchange } from "react-icons/fc";
import { FcSurvey } from "react-icons/fc";

interface SidebarItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  collapsed?: boolean;
  isActive: boolean;
}

interface SidebarProps {
  userData: { id_rol: number } | null;
  isOpen: boolean; // Controla si el sidebar está abierto o cerrado
  toggleSidebar: () => void; // Función para abrir/cerrar el sidebar
  isMobile:boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, collapsed, isActive }) => (
  <li>
    <Link
      to={to}
      className={`flex items-center gap-4 p-4 text-lg font-semibold rounded-xl transition-all duration-300
        ${isActive ? "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100" : "text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"}
      `}
      aria-label={label}
    >
      <Icon className="w-8 h-8" />
      {!collapsed && <span className="ms-3">{label}</span>}
    </Link>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ userData, isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Botón para cerrar el menú en móviles */}
      {/* {isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 lg:hidden"
          aria-label="Cerrar menú"
        >
          <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      )} */}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen pt-20 bg-white dark:bg-gray-900 dark:border-gray-700 transition-all duration-300
          ${isCollapsed ? "w-20" : "w-72"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-full px-2 pb-6 overflow-y-auto bg-white dark:bg-gray-900">
          <ul className="space-y-4 font-medium">
            <SidebarItem to="/home" icon={FcRules} label="Dashboard" collapsed={isCollapsed} isActive={location.pathname === "/home"} />
            <SidebarItem to="/productos" icon={FcStackOfPhotos} label="Productos" collapsed={isCollapsed} isActive={location.pathname === "/productos"} />
            <SidebarItem to="/precios" icon={FcCurrencyExchange} label=" Regsitro de Precios" collapsed={isCollapsed} isActive={location.pathname === "/precios"} />
            <SidebarItem to="/preciosDiarios" icon={FcSurvey} label="Reporte Precios" collapsed={isCollapsed} isActive={location.pathname === "/preciosDiarios"} />
           
            {userData?.id_rol === 1 && (
              <SidebarItem to="/usuarios" icon={FcGoodDecision} label="Usuarios" collapsed={isCollapsed} isActive={location.pathname === "/usuarios"} />
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;