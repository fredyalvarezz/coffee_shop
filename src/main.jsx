import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css';
import './styles/variables.css';
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { AdminProvider } from './context/AdminContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <AdminProvider>
        <App />
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
