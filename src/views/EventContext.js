import { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState([
    // Sample initial state
    { id: '1', eventTitle: 'Interview Session', date: 'March 15, 2026', classification: 'normal', isHidden: false },
    { id: '2', eventTitle: 'Tech Conference', date: 'March 20, 2026', classification: 'highlighted', isHidden: false },
  ]);

  // Toggle highlighted status
  const toggleHighlight = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((item) => {
        if (item.id === id) {
          const newClassification =
            item.classification === 'highlighted' ? 'normal' : 'highlighted';
          return { ...item, classification: newClassification };
        }
        return item;
      })
    );
  };

  const hideFromGeneral = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((item) => (item.id === id ? { ...item, isHidden: true } : item))
    );
  };

  const removeFromHighlight = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((item) =>
        item.id === id ? { ...item, classification: 'normal' } : item
      )
    );
  };

  const unhideEvent = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((item) => (item.id === id ? { ...item, isHidden: false } : item))
    );
  };

  return (
    <EventContext.Provider
      value={{
        events,
        toggleHighlight,
        hideFromGeneral,
        removeFromHighlight,
        unhideEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => useContext(EventContext);