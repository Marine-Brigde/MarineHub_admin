import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isLight, setIsLight] = useState(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'light'
  })

  useEffect(() => {
    const html = document.documentElement
    
    // Add transition class temporarily for smooth animation
    html.classList.add('no-transition')
    
    // Set theme
    if (isLight) {
      html.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    } else {
      html.removeAttribute('data-theme')
      localStorage.setItem('theme', 'dark')
    }
    
    // Force reflow and remove transition class
    requestAnimationFrame(() => {
      html.classList.remove('no-transition')
    })
  }, [isLight])

  const toggleTheme = () => {
    setIsLight(prev => !prev)
  }

  const value = {
    isLight,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}