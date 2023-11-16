import React from 'react';
import { Link } from 'react-router-dom';
import illustration from '../../assets/expanse_illustration.png'; // Import your illustration
import './index.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="content">
        <img src={illustration} alt="Expense Tracker Illustration" />
        <h1>Welcome to Expense Tracker</h1>
        <p>Track and manage your expenses with ease.</p>
        <Link to="/signup" className="btn-get-started">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
