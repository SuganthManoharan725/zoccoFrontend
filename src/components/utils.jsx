// Format time to AM/PM
export function formatAMPM(timeStr) {
  const [hourStr, minuteStr] = timeStr.split(':')?? [];
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

// Get time period
export function getTimeOfDay(timeStr) {
  const [hourStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);

  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  return 'Night';
}
