import React from 'react';
import { LoaderProps } from '../types/loaderProps';

const Loader: React.FC<LoaderProps> = ({ isLoading, progress = 0, message = 'Calculating...' }) => {
  if (!isLoading) return null;  

  return (
    <div className="loading-overlay">
      <div className="calculating-loader-container">
        <div className="calculating-text">{message}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-percentage">{progress}%</div>
      </div>
    </div>
  );
};

export default Loader; 