import React from 'react';
import '../styles/CustomHeader.css';

const CustomHeader = () => {
  return (
    <div className="custom-header">
      <img src="/icons/volvo_logo.png" alt="Volvo Logo" className="logo" />
      <div className="header-text volvo-font">
        <h3>Volvo Support Assistant</h3>
      </div>
    </div>
  );
};

export default CustomHeader;
