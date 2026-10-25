import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { PreferencesController } from '../controllers/PreferencesController';
import { CALENDAR_VIEW_MODES } from '../models/UserPreferencesModel';

const PreferencesContext = createContext({
  calendarViewMode: CALENDAR_VIEW_MODES.GRID,
  setCalendarViewMode: () => {},
});

export function PreferencesProvider({ userId, children }) {
  const [calendarViewMode, setMode] = useState(CALENDAR_VIEW_MODES.GRID);

  useEffect(() => {
    let active = true;
    PreferencesController.loadCalendarViewMode(userId)
      .then((mode) => {
        if (active) setMode(mode);
      })
      .catch((e) => console.warn('Could not load calendar view mode:', e?.message));
    return () => {
      active = false;
    };
  }, [userId]);

  const setCalendarViewMode = useCallback(
    (mode) => {
      setMode(mode); // update the calendars immediately, save in the background
      PreferencesController.saveCalendarViewMode(userId, mode).catch((e) =>
        console.error('Could not save calendar view mode:', e)
      );
    },
    [userId]
  );

  return (
    <PreferencesContext.Provider value={{ calendarViewMode, setCalendarViewMode }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = () => useContext(PreferencesContext);
