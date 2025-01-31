import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import styles
import './styles/animations.css';
import 'tailwindcss/tailwind.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);