import React, { createContext, useContext, useState } from 'react';
import { DateModel } from '../models/DateModel';

const initialEvents = [
  new DateModel('1', '', 'Calendar', 'March 1, 2026', '10:00 AM', ['TIP'], 'Description here', 'regular', false),
  new DateModel('2', '', 'TESTHIGHLIGHT', 'March 12, 2026', '02:00 PM', ['TIP'], 'Description here', 'highlighted', false),
  new DateModel('3', '', 'Calendar', 'March 15, 2026', '09:00 AM', ['TIP'], 'Description here', 'regular', false),
  new DateModel('4', '', 'Calendar', 'March 20, 2026', '04:00 PM', ['TIP'], 'Description here', 'highlighted', false),
]; //THESE ARE SAMPLES THAT WILL BE REPLACED BY ACTUAL ITEMS GIVEN BY USERS

const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState(initialEvents);

  // Pressing 'X' in General Calendar: Convert highlighted -> regular AND set isHidden -> true
  const hideFromGeneral = (id) => {
    setEvents((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, classification: 'regular', isHidden: true }
          : item
      )
    );
  };

  // Pressing 'X' in Highlight Calendar: Convert highlighted -> regular ONLY (remains visible in General Calendar without blue border)
  const removeFromHighlight = (id) => {
    setEvents((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, classification: 'regular' }
          : item
      )
    );
  };

  // Pressing '▲' in Hidden Dates: Set isHidden -> false
  const unhideEvent = (id) => {
    setEvents((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isHidden: false } : item
      )
    );
  };

  return (
    <EventContext.Provider
      value={{ events, hideFromGeneral, removeFromHighlight, unhideEvent }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
