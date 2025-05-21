import React, { useState } from 'react';
import { format, addDays, isSameDay } from 'date-fns';

export default function CalendarStrip({ selectedDate, onDateChange }) {
  const [currentDate] = useState(new Date());
  const daysToShow = 7;
  const startDate = addDays(currentDate, -3);

  const dates = [];
  for (let i = 0; i < daysToShow; i++) {
    dates.push(addDays(startDate, i));
  }

  return (
    <div className="flex gap-3 overflow-x-auto p-8 bg-green-500 rounded-xl shadow-sm justify-center">
      {dates.map((date) => (
        <button
          key={date.toISOString()}
          onClick={() => onDateChange(date)}
          className={`min-w-[56px] text-center py-2 px-3 rounded-lg transition-all duration-200
            ${isSameDay(date, selectedDate)
              ? 'bg-white text-black'
              : 'bg-green-200 text-gray-700 hover:bg-white'}`}
        >
          <div className="text-xs font-medium">{format(date, 'EEE')}</div>
          <div className="text-base font-semibold">{format(date, 'd')}</div>
        </button>
      ))}
    </div>
  );
}
