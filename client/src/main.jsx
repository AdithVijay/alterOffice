import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './redux/Store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <GoogleOAuthProvider clientId="461750813528-fh0oohkab4fjsq691h0soud0ll0bjqe4.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
      <ToastContainer/>
      </BrowserRouter>
    </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
