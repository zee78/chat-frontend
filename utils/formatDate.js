import { format, isToday, isYesterday, parseISO  } from 'date-fns';

export const formatDateTime = (dateString) => {
  const date = parseISO(dateString);
  if (isToday(date)) {
    return `Today ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'MMMM dd yyyy HH:mm');
  }
};
