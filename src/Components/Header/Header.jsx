import React from 'react'
import logo from "../../../src/assets/logo.png"
import "./Header.css"
function Header() {
  return (
    <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title">Quiz Mastery</h1> 
    </header>
  )
}

export default Header
