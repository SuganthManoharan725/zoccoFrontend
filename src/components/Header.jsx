import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';


export default function Header() {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">🐾 Pet Reminder</h1>
        <nav className="flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:underline">Home</Link>
          <Link
            to="/add"
            className="fixed bottom-6 right-6 bg-green-600 text-white text-3xl font-bold w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition duration-200"
            title="Add Reminder"
          >
            <FiPlus size={24} />
          </Link>

        </nav>
      </div>
    </header>
  );
}
