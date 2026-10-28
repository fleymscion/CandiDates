import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './Header';
import TextStyle from './AppText';
import { usePreferences } from './PreferencesContext';
import { CALENDAR_VIEW_MODES } from '../models/UserPreferencesModel';

const OPTIONS = [
  { mode: CALENDAR_VIEW_MODES.GRID, icon: 'grid-outline', title: 'Grid', hint: 'Two event cards per row' },
  { mode: CALENDAR_VIEW_MODES.LIST, icon: 'list-outline', title: 'List', hint: 'One event card per row' },
];

// Used by both Employee and Employer.
export default function CalendarViewModeView({ navigation }) {
  const { calendarViewMode, setCalendarViewMode } = usePreferences();

  return (
    <Template title="Calendar View Mode" navigation={navigation} showBack>
      <View style={styles.content}>
        {OPTIONS.map((opt) => {
          const selected = calendarViewMode === opt.mode;
          return (
            <TouchableOpacity
              key={opt.mode}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => setCalendarViewMode(opt.mode)}
              activeOpacity={0.8}
            >
              <Ionicons name={opt.icon} size={26} color="#011F5B" />
              <View style={styles.optionText}>
                <TextStyle style={styles.optionTitle}>{opt.title}</TextStyle>
                <TextStyle style={styles.optionHint}>{opt.hint}</TextStyle>
              </View>
              <Ionicons
                name={selected ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color="#011F5B"
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </Template>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
  },
  optionSelected: { borderColor: '#011F5B' },
  optionText: { flex: 1, marginLeft: 14 },
  optionTitle: { fontSize: 16, fontWeight: 'bold' },
  optionHint: { fontSize: 12, color: '#777777', marginTop: 2 },
});
