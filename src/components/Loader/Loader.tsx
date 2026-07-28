import React from 'react';
import './Loader.css';

interface LoaderProps {
  text?: string;
  fullPage?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ text = 'Loading data...', fullPage = false }) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className="spinner-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
