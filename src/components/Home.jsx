import React, { useState, useEffect } from 'react';
import CalendarStrip from './CalendarStrip';
import ReminderCard from './ReminderCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
  try {
   const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reminders`);

    
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    const uniqueReminders = data.filter(
      (r, index, self) => index === self.findIndex((x) => x._id === r._id)
    );

      setReminders(uniqueReminders);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReminders();
  }, []);

  const handleDeleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r._id !== id));
  };

  const handleCompleteReminder = async (id) => {

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: true }),
      });

      if (!res.ok) throw new Error('Failed to update reminder');

      const updated = await res.json();
      setReminders((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );

      toast.success('Marked as completed!');
    } catch (err) {
      console.error(err);
      toast.error('Error marking as completed');
    }
  };

  const today = new Date().toDateString();
  const selectedDateStr = selectedDate.toDateString();

  const filteredReminders = reminders.filter(
    (reminder) => new Date(reminder.startDate).toDateString() === selectedDateStr
  );

  const pendingRemindersForSelectedDate = filteredReminders.filter(
    (r) => !r.done && new Date(r.startDate).toDateString() === selectedDateStr
  );

  const completedReminders = filteredReminders.filter((r) => r.done);

  const pastPendingReminders = reminders.filter(
    (r) =>
      !r.done &&
      new Date(r.startDate).toDateString() < today
  );

  const groupByTimeSlot = (remindersList) => {
    const slots = {
      Morning: [],
      Afternoon: [],
      Evening: [],
      Night: [],
    };

    remindersList.forEach((reminder) => {
      if (!reminder.time) return;
      const [hourStr] = reminder.time.split(':');
      const hour = parseInt(hourStr, 10);

      if (hour < 12) slots.Morning.push(reminder);
      else if (hour < 17) slots.Afternoon.push(reminder);
      else if (hour < 20) slots.Evening.push(reminder);
      else slots.Night.push(reminder);
    });

    return slots;
  };

  const groupedPendingByTimeSlot = groupByTimeSlot(pendingRemindersForSelectedDate);

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Reminders for {selectedDate.toDateString()}
      </h2>

      <div className="mb-4">
        <CalendarStrip
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-6">


           {/* PENDING FOR SELECTED DATE BY TIME SLOT */}
          {Object.entries(groupedPendingByTimeSlot).map(
            ([slot, remindersInSlot]) =>
              remindersInSlot.length > 0 && (
                <div key={slot} className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{slot}</h3>
                  <div className="space-y-4">
                    {remindersInSlot.map((reminder) => (
                      <ReminderCard
                        key={reminder._id}
                        reminder={reminder}
                        onDelete={handleDeleteReminder}
                        onComplete={handleCompleteReminder}
                      />
                    ))}
                  </div>
                </div>
              )
          )}

          {/* PENDING FROM PAST */}
          {pastPendingReminders.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-red-700 mb-4">Pending (Past)</h3>
              <div className="space-y-4">
                {pastPendingReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder._id}
                    reminder={reminder}
                    onDelete={handleDeleteReminder}
                    onComplete={handleCompleteReminder}
                  />
                ))}
              </div>
            </div>
          )}


          {/* COMPLETED */}
          {completedReminders.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-green-700 mb-4">Completed</h3>
              <div className="space-y-4">
                {completedReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder._id}
                    reminder={reminder}
                    onDelete={handleDeleteReminder}
                    isCompleted
                  />
                ))}
              </div>
            </div>
          )}

          {/* NO REMINDERS FOR SELECTED DATE */}
          {filteredReminders.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No reminders for this date.
            </div>
          )}
        </div>
      )}
    </main>
  );
}
