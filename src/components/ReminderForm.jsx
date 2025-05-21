import { IoArrowBack } from "react-icons/io5";
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function ReminderForm({onCancel, reminder }) {
  const { id } = useParams(); // e.g. /reminder/682d72e4...
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const [reminderId, setReminderId] = useState('');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [pet, setPet] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [frequencyreminder, setFrequencyreminder] = useState('');

  const reminderFromState = location.state?.reminder;

  const navigate = useNavigate();

  useEffect(() => {
    if (reminderFromState) {
      populateForm(reminderFromState);
      setLoading(false);
    } else if (id) {
      // If not passed in state, fetch it from backend
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reminders/${id}`)
        .then(res => res.json())
        .then(data => {
          populateForm(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch reminder:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  const populateForm = (reminder) => {
     setReminderId(reminder._id || '');  
    setTitle(reminder.title || '');
    setTime(reminder.time || '');
    setDescription(reminder.description || '');
    setPet(reminder.pet || '');
    setCategory(reminder.category || '');
    setStartDate(reminder.startDate?.split('T')[0] || '');
    setEndDate(reminder.endDate?.split('T')[0] || '');
    setFrequencyreminder(reminder.frequencyreminder || '');
  };

  if (loading) return <div>Loading...</div>;


  const handleSubmit = async (e) => {
  e.preventDefault();

  const reminderData = {
    title,
    time,
    description,
    pet,
    category,
    startDate,
    endDate,
    frequencyreminder
  };

  try {
    let response;

    if (reminderId) {
      // Update existing reminder
      response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reminders/${reminderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminderData),
    });
    } else {
      // Create new reminder
      response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reminderData)
        
      });
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Something went wrong');
    }

    // Callback to parent to update state/UI
 toast.success('Reminder saved successfully!');
navigate('/');
  } catch (error) {
    console.error('Error saving reminder:', error);
    toast.error('Failed to save reminder.');
  }
};


  return (
    <>
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mt-6 space-y-6 overflow-hidden"
    >

     {/* Buttons */}
      <div className="flex justify-between gap-3 pt-4 mb-7">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          <IoArrowBack />
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-green-500 font-bold transition"
        >
          Save
        </button>
      </div>

      <h2 className="text-xl font-bold text-gray-800 flex justify-center">
         {(reminder?.title || id) ? 'Edit Reminder' : 'Add Reminder'}
      </h2>

      {/* Dropdowns */}
      <div className="grid-cols-1 sm:grid-cols-2 gap-4 flex justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Pet</label>
          <select
            value={pet}
            onChange={(e) => setPet(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="Brownie"> Brownie</option>
            <option value="Lucky"> Lucky</option>
            <option value="Jack"> Jack</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="General"> General</option>
            <option value="Lifestyle"> Lifestyle</option>
            <option value="Health"> Health</option>
          </select>
        </div>
      </div>

      {/* Reminder Info Box */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <h3 className="font-bold mb-4 bg-black mt-[-16px] p-[10px] mr-[-16px] ml-[-16px] rounded-[5px] text-white">Reminder Info</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Set a reminder for</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Walk the dog"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Add notes (optional)</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Optional notes..."
            />
          </div>
        </div>
      </div>

      {/* Reminder Settings Box */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        {/* <div className="bg-white" >
          <h3 className="font-semibold text-gray-800 mb-4">Reminder Settings</h3>
        </div> */}
        <h3 className="font-bold mb-4 bg-black mt-[-16px] p-[10px] mr-[-16px] ml-[-16px] rounded-[5px] text-white">Reminder Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Start Date</label>
            <input
              required
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Reminder Time</label>
            <input
              required
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Reminder Frequency</label>
          <p className='block text-sm font-small text-gray-900 mb-1'>How often should this reminder repeat</p>
          <select
            value={frequencyreminder}
            onChange={(e) => setFrequencyreminder(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="Everyday">Everyday</option>
            <option value="One Day">One Day</option>
            <option value="One Week">One Week</option>
          </select>
        </div>
      </div>

     
    </form>
    </>
  );
}
