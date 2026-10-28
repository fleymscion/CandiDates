import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Template from './Header';
import TextStyle from './AppText';
import { EmployeeProfileController } from '../controllers/EmployeeProfileController';
import { JOB_CATEGORY_OPTIONS } from '../models/UserPreferencesModel';

export default function JobCategoriesView({ navigation, userData }) {
  const userId = userData?.id || userData?.uid;

  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const saved = await EmployeeProfileController.fetchJobCategories(userId);
          if (active) setSelected(saved);
        } catch (e) {
          console.error(e);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [userId])
  );

  const toggle = (name) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  const addCustom = () => {
    const name = custom.trim();
    if (name && !selected.some((s) => s.toLowerCase() === name.toLowerCase())) {
      setSelected((prev) => [...prev, name]);
    }
    setCustom('');
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await EmployeeProfileController.saveJobCategories(userId, selected);
      Alert.alert('Saved', 'Your job categories were updated.');
      navigation?.goBack();
    } catch (e) {
      Alert.alert('Could not save', 'Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  // Show the presets plus any custom entries the user added.
  const allOptions = [...JOB_CATEGORY_OPTIONS, ...selected.filter((s) => !JOB_CATEGORY_OPTIONS.includes(s))];

  return (
    <Template title="Job Categories" navigation={navigation} showBack>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#011F5B" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <TextStyle style={styles.label}>Pick the areas you are interested in</TextStyle>
          <View style={styles.chipWrap}>
            {allOptions.map((name) => {
              const on = selected.includes(name);
              return (
                <TouchableOpacity
                  key={name}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => toggle(name)}
                  activeOpacity={0.8}
                >
                  <TextStyle style={[styles.chipText, on && styles.chipTextOn]}>{name}</TextStyle>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextStyle style={styles.label}>Add your own</TextStyle>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="e.g. Data Analysis"
              placeholderTextColor="#777777"
              value={custom}
              onChangeText={setCustom}
              onSubmitEditing={addCustom}
              returnKeyType="done"
            />
            <Pressable style={styles.addBtn} onPress={addCustom}>
              <TextStyle style={styles.addBtnText}>Add</TextStyle>
            </Pressable>
          </View>

          <Pressable style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={save} disabled={saving}>
            <TextStyle style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</TextStyle>
          </Pressable>
        </ScrollView>
      )}
    </Template>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 4 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: {
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },
  chipOn: { backgroundColor: '#011F5B', borderColor: '#011F5B' },
  chipText: { fontSize: 13, color: '#333333' },
  chipTextOn: { color: '#FFFFFF' },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  addBtn: { backgroundColor: '#284B91', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 12, marginLeft: 8 },
  addBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  saveBtn: {
    backgroundColor: '#284B91',
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 30,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
