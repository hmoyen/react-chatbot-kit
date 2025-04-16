import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="site-header">
      <div className="logo">
        <img src="/assets/images/volvo_logo.svg" alt="Volvo Logo" />
      </div>
      <nav className="site-navigation">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/chat">Chat Bot</Link></li>
          <li><Link to="/livechat-form">Live Support</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
