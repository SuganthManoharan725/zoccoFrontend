import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import ReminderForm from './components/ReminderForm';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<ReminderForm />} />
        <Route path="/reminder/:id" element={<ReminderForm />} />
      </Routes>
    </Router>
  );
}

