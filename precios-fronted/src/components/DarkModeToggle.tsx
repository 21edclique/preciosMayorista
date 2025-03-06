import React, { useEffect, useState } from 'react'
import { MdSunny, MdDarkMode } from 'react-icons/md' // Íconos más similares a los de la imagen

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
        className="sr-only peer"
        aria-label="Toggle dark mode"
      />
      {/* Deslizador */}
      <div className={`w-16 h-8 rounded-full flex items-center px-2 transition-colors duration-300
                      ${darkMode ? 'bg-gray-600' : 'bg-green-600'}`}>
        {/* Icono dentro del botón deslizante */}
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-300
                        ${darkMode ? 'translate-x-7 bg-gray-900 text-white' : 'translate-x-0 bg-white text-green-600'}`}>
          {darkMode ? <MdDarkMode size={18} /> : <MdSunny size={18} />}
        </div>
      </div>
    </label>
  )
}

export default DarkModeToggle
