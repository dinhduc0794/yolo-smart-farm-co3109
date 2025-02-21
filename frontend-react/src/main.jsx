import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import "./CSS/style.module.css";
import "./CSS/login.module.css";
import "./index.css";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
          <App />
  </StrictMode>
);
