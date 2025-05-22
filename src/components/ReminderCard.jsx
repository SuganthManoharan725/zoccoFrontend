// ReminderCard.jsx
import React from 'react';
import { PencilIcon, TrashIcon, CheckCircle2, Clock, PawPrint } from 'lucide-react';
import { formatAMPM } from './utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ReminderCard({ reminder, onDelete, onEdit, onComplete, isCompleted }) {
  const navigate = useNavigate();

  const completed = reminder.goals?.filter(g => g.completed) || [];
  const pending = reminder.goals?.filter(g => !g.completed) || [];

  const handleDelete = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reminders/${reminder._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');
      toast.success('Reminder deleted successfully');
      onDelete(reminder._id); // Call parent callback
    } catch (err) {
      toast.error('Failed to delete reminder.');
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 relative">
      {/* Edit/Delete Buttons */}
     <div className="absolute top-3 right-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">

  {/* Edit */}
  { isCompleted ? '': <button
    onClick={() => navigate(`/reminder/${reminder._id}`, { state: { reminder } })}
    title="Edit"
    className="p-1 rounded hover:bg-blue-100 transition"
  >
    <PencilIcon size={18} className="text-blue-600" />
  </button> }

  {/* Delete */}
  <button
    onClick={handleDelete}
    title="Delete"
    className="p-1 rounded hover:bg-red-100 transition"
  >
    <TrashIcon size={18} className="text-red-600" />
  </button>

  {/* Mark as Completed (only if not done) */}
  {!reminder.done && onComplete && (
    <button
      onClick={() => onComplete(reminder._id)}
      title="Mark as Completed"
      className="p-1 rounded hover:bg-green-100 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-green-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )}
</div>


      <h3
      className={`text-lg font-bold mb-1 ${
        isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'
      }`}
    >
      {reminder.title}
    </h3>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1"><PawPrint size={14} />{reminder.pet}</div>
        <div className="flex items-center gap-1"><Clock size={14} />{reminder.time ? formatAMPM(reminder.time) : 'No time'}</div>
        <div className="flex items-center gap-1">⇆ {reminder.frequencyreminder}</div>
      </div>

      {/* Goals */}
      <div className="mt-4">
        {pending.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Pending</h4>
            <ul className="space-y-1">{pending.map((g, i) => <li key={i}>{g.text}</li>)}</ul>
          </div>
        )}
        {completed.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-1">Completed</h4>
            <ul className="space-y-1">
              {completed.map((g, i) => (
                <li key={i} className="line-through text-gray-400 flex justify-between items-center">
                  <span>{g.text}</span>
                  <CheckCircle2 size={16} className="text-green-500" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
