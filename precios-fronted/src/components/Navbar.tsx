import React, { useState, useEffect } from 'react'
import { FiLogOut, FiMenu, FiUser, FiBell } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import EpemaLogo from '../images/logo-epema.svg'
import DarkModeToggle from './DarkModeToggle'

interface NavbarProps {
  handleLogout: () => void
  toggleSidebar: () => void
  isSidebarOpen: boolean
  isMobile: boolean
}

interface UserData {
  nombres: string
  avatar?: string
}

const Navbar: React.FC<NavbarProps> = ({ handleLogout, toggleSidebar, isSidebarOpen }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined)
 

  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUserData = localStorage.getItem('userData')
        if (savedUserData) {
          const userData: UserData = JSON.parse(savedUserData)
          setUserName(userData.nombres)
          setUserAvatar(userData.avatar)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }

    loadUserData()
    window.addEventListener('storage', loadUserData)
    return () => window.removeEventListener('storage', loadUserData)
  }, [])

  const onLogoutClick = async () => {
    setIsLoggingOut(true)
    setError(null)

    try {
      await handleLogout()
    } catch (err) {
      setError('Error al cerrar sesión')
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (

    
    <nav className="fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-900/90 backdrop-blur-md z-50 transition-all border-b border-gray-100 dark:border-gray-800">
      <div className="w-full h-16 flex items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Botón de menú (solo visible en ≤1024px) */}
        <button
          onClick={toggleSidebar}
          className={`lg:hidden p-2 rounded-full transition-all ${
            isSidebarOpen
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }`}
          aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Link
          to="/home"
          className="flex items-center space-x-3 hover:opacity-90 transition-all absolute left-1/2 -translate-x-1/2 lg:static lg:transform-none"
        >
          <div className="relative">
            <img
              src={EpemaLogo}
              alt="Asotema Logo"
              className="h-9 w-auto object-contain"
              role="img"
              aria-label="Logo de Asotema"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden md:block">
            EP-EMA
          </span>
        </Link>

        {/* Controles de usuario */}
        <div className="flex items-center gap-3">
          {/* Modo oscuro */}
          <DarkModeToggle />

          {/* Usuario */}
          {userName && (
            <div className="hidden md:flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full">
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">Bienvenido</span>
                <span
                  className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px] lg:max-w-[200px]"
                  title={userName}
                >
                  {userName}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-4 h-4" />
                )}
              </div>
            </div>
          )}

          {/* Botón de salida */}
          <button
            onClick={onLogoutClick}
            disabled={isLoggingOut}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-all
              ${
                isLoggingOut
                  ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-white text-red-500 border border-red-200 hover:bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20 active:scale-95'
              }`}
            aria-busy={isLoggingOut}
          >
            <FiLogOut className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </nav>
  )
}

export default React.memo(Navbar)
