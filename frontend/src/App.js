import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import SignupForm from './SignupForm';  // Assuming you have this component
import Login from './Login';  // Assuming you have this component
import Update from './Update';
import RequestBlood from './RequestBlood';

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          {/* Define Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/update" element={<Update />} />
          <Route path="/request" element={<RequestBlood />} />  
        </Routes>
      </div>
    </Router>
  );
}

export default App;
