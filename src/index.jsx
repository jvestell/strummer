import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import styles
import './styles/index.css';
import './styles/animations.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);