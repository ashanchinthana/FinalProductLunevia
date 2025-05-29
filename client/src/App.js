import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Add other routes here, e.g., for shop, about, product details, etc. */}
          {/* <Route path="/shop" element={<ShopPage />} /> */}
          {/* <Route path="/about" element={<AboutPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App; 