import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

const TOTAL_STEPS = 6;

const STEP_HEADERS = {
  1: { title: 'Build Your Profile', subtitle: 'Upload your resume to get started' },
  2: { title: 'Add a profile photo', subtitle: 'A clear photo helps employers recognize you.' },
  3: { title: 'Work Experience', subtitle: '' },
  4: { title: 'Your Education', subtitle: '' },
  5: { title: 'Your Skills', subtitle: "Add skills that show what you're good at." },
  6: { title: 'Review Your Profile', subtitle: 'Here\'s what employers will see.' },
};

const emptyExperience = () => ({ title: '', start: '', end: '' });
const emptyEducation = () => ({ school: '', program: '', start: '', end: '' });

export default function ProfileSetupView({ navigation, onSubmit }) {
  const [step, setStep] = useState(1);


  const [cvFile, setCvFile] = useState(null); 
  const [photoUri, setPhotoUri] = useState(null);
  const [experiences, setExperiences] = useState([emptyExperience()]);
  const [educations, setEducations] = useState([emptyEducation()]);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));

  const goBack = () => {
    if (step === 1) {
      navigation?.goBack?.();
    } else {
      setStep((s) => s - 1);
    }
  };

  const handlePickDocument = async () => {};

  const handlePickImage = async () => {};

  const updateItem = (setter, index, key, value) =>
    setter((list) => list.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setSkillInput('');
      return;
    }
    setSkills((list) => [...list, value]);
    setSkillInput('');
  };

  const removeSkill = (skill) => setSkills((list) => list.filter((s) => s !== skill));

  const PrimaryButton = ({ label, onPress }) => (
    <Pressable style={styles.primaryButton} onPress={onPress}>
      <AppText style={styles.primaryButtonText}>{label}</AppText>
    </Pressable>
  );

  const SkipButton = ({ onPress }) => (
    <Pressable style={styles.skipButton} onPress={onPress}>
      <AppText style={styles.primaryButtonText}>Skip for now</AppText>
    </Pressable>
  );

  const AddButton = ({ label, onPress }) => (
    <Pressable style={styles.addButton} onPress={onPress}>
      <AppText style={styles.addButtonText}>+ {label}</AppText>
    </Pressable>
  );

  const DateRow = ({ start, end, onStart, onEnd }) => (
    <View style={styles.dateRow}>
      <TextInput
        style={[styles.input, styles.dateInput]}
        placeholder="Start Date"
        placeholderTextColor="#777777"
        value={start}
        onChangeText={onStart}
      />
      <TextInput
        style={[styles.input, styles.dateInput]}
        placeholder="End Date"
        placeholderTextColor="#777777"
        value={end}
        onChangeText={onEnd}
      />
    </View>
  );

  const Chip = ({ label, onRemove }) => (
    <View style={styles.chip}>
      <AppText style={styles.chipText}>{label}</AppText>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8}>
          <Ionicons name="close" size={14} color="#011F5B" style={{ marginLeft: 6 }} />
        </Pressable>
      )}
    </View>
  );

  const renderStep1 = () => (
    <>
      <Pressable style={styles.uploadBox} onPress={handlePickDocument}>
        <Ionicons
          name={cvFile ? 'document-text-outline' : 'cloud-download-outline'}
          size={46}
          color="#7891BD"
        />
        <AppText style={styles.uploadText}>
          {cvFile ? cvFile.name : 'Click to browse files'}
        </AppText>
        {cvFile && <AppText style={styles.uploadHint}>Tap to replace</AppText>}
      </Pressable>

      <PrimaryButton label="Submit" onPress={goNext} />
      <SkipButton onPress={goNext} />
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.photoWrapper}>
        <Pressable style={styles.photoCircle} onPress={handlePickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoImage} />
          ) : (
            <Ionicons name="person" size={130} color="#B5B5B5" />
          )}
        </Pressable>

        <Pressable style={styles.cameraButton} onPress={handlePickImage}>
          <Ionicons name="camera" size={22} color="#444444" />
        </Pressable>
      </View>

      <AppText style={styles.photoHint}>JPG or PNG, max 5MB</AppText>

      <PrimaryButton label="Next" onPress={goNext} />
      <SkipButton onPress={goNext} />
    </>
  );

  const renderStep3 = () => (
    <>
      {experiences.map((exp, index) => (
        <View key={index} style={styles.entryBlock}>
          <AppText style={styles.label}>Job Title</AppText>
          <TextInput
            style={styles.input}
            placeholder="Type here..."
            placeholderTextColor="#777777"
            value={exp.title}
            onChangeText={(v) => updateItem(setExperiences, index, 'title', v)}
          />

          <AppText style={styles.label}>Duration</AppText>
          <DateRow
            start={exp.start}
            end={exp.end}
            onStart={(v) => updateItem(setExperiences, index, 'start', v)}
            onEnd={(v) => updateItem(setExperiences, index, 'end', v)}
          />
        </View>
      ))}

      <AddButton
        label="Add Experience"
        onPress={() => setExperiences((list) => [...list, emptyExperience()])}
      />

      <PrimaryButton label="Next" onPress={goNext} />
    </>
  );

  const renderStep4 = () => (
    <>
      {educations.map((edu, index) => (
        <View key={index} style={styles.entryBlock}>
          <AppText style={styles.label}>School/ University</AppText>
          <TextInput
            style={styles.input}
            placeholder="Type here..."
            placeholderTextColor="#777777"
            value={edu.school}
            onChangeText={(v) => updateItem(setEducations, index, 'school', v)}
          />

          <AppText style={styles.label}>Program</AppText>
          <TextInput
            style={styles.input}
            placeholder="Start Date"
            placeholderTextColor="#777777"
            value={edu.program}
            onChangeText={(v) => updateItem(setEducations, index, 'program', v)}
          />

          <AppText style={styles.label}>Duration</AppText>
          <DateRow
            start={edu.start}
            end={edu.end}
            onStart={(v) => updateItem(setEducations, index, 'start', v)}
            onEnd={(v) => updateItem(setEducations, index, 'end', v)}
          />
        </View>
      ))}

      <AddButton
        label="Add Education"
        onPress={() => setEducations((list) => [...list, emptyEducation()])}
      />

      <PrimaryButton label="Next" onPress={goNext} />
    </>
  );

  const renderStep5 = () => (
    <>
      <AppText style={styles.label}>Type a skill and press enter</AppText>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Type here."
          placeholderTextColor="#777777"
          value={skillInput}
          onChangeText={setSkillInput}
          onSubmitEditing={addSkill}
          returnKeyType="done"
        />
        <Pressable onPress={addSkill} hitSlop={8}>
          <Ionicons name="add" size={22} color="#011F5B" />
        </Pressable>
      </View>

      <View style={styles.skillsBox}>
        {skills.map((skill) => (
          <Chip key={skill} label={skill} onRemove={() => removeSkill(skill)} />
        ))}
      </View>

      <PrimaryButton label="Next" onPress={goNext} />
    </>
  );

  const renderStep6 = () => {
    const filledExperiences = experiences.filter((e) => e.title.trim());
    const filledEducations = educations.filter((e) => e.school.trim());

    return (
      <>
        <View style={styles.reviewTop}>
          <View style={styles.reviewAvatar}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photoImage} />
            ) : (
              <Ionicons name="person" size={50} color="#B5B5B5" />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <AppText style={styles.reviewName}>Name</AppText>
            <AppText style={styles.reviewDetail}>Details</AppText>
            <AppText style={styles.reviewDetail}>Details</AppText>
          </View>
        </View>

        <View style={styles.reviewCard}>
          <AppText style={styles.reviewCardTitle}>Work Experience</AppText>
          {filledExperiences.length > 0 ? (
            filledExperiences.map((e, i) => (
              <AppText key={i} style={styles.reviewDetail}>
                {e.title}
                {e.start || e.end ? `  (${e.start || '—'} - ${e.end || '—'})` : ''}
              </AppText>
            ))
          ) : (
            <AppText style={styles.reviewDetail}>Summary...</AppText>
          )}
        </View>

        <View style={styles.reviewCard}>
          <AppText style={styles.reviewCardTitle}>Education</AppText>
          {filledEducations.length > 0 ? (
            filledEducations.map((e, i) => (
              <AppText key={i} style={styles.reviewDetail}>
                {e.school}
                {e.program ? ` - ${e.program}` : ''}
              </AppText>
            ))
          ) : (
            <AppText style={styles.reviewDetail}>Summary...</AppText>
          )}
        </View>

        <View style={styles.reviewCard}>
          <AppText style={styles.reviewCardTitle}>Skills</AppText>
          <View style={styles.chipRow}>
            {skills.length > 0 ? (
              skills.map((skill) => <Chip key={skill} label={skill} />)
            ) : (
              <AppText style={styles.reviewDetail}>No skills added</AppText>
            )}
          </View>
        </View>

        <View style={[styles.reviewCard, styles.resumeRow]}>
          <AppText style={styles.resumeLabel} numberOfLines={1}>
            {cvFile ? cvFile.name : 'Resume'}
          </AppText>
          <AppText style={styles.resumeStatus}>{cvFile ? 'Uploaded' : 'Status'}</AppText>
        </View>

        <PrimaryButton
          label="Confirm and Submit"
          onPress={() =>
            onSubmit?.({ cvFile, photoUri, experiences, educations, skills })
          }
        />
      </>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return null;
    }
  };

  const header = STEP_HEADERS[step];

  return (
    <SafeAreaView style={styles.safeArea}>
      {}
      <View style={styles.headerContainer}>
        <Pressable onPress={goBack} hitSlop={10} style={styles.backButton}>
          <Ionicons name="arrow-back-circle" size={26} color="#FFFFFF" />
        </Pressable>

        <AppText style={styles.stepLabel}>
          Step {step} of {TOTAL_STEPS}
        </AppText>

        <AppText style={styles.headerTitle}>{header.title}</AppText>

        {!!header.subtitle && (
          <AppText style={styles.headerSubtitle}>{header.subtitle}</AppText>
        )}
      </View>

      {}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#011F5B',
    borderRadius: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  headerContainer: {
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 16,
  },

  backButton: {
    position: 'absolute',
    top: 14,
    left: 16,
  },

  stepLabel: {
    position: 'absolute',
    top: 18,
    left: 52,
    fontSize: 11,
    color: '#FFFFFF',
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  headerSubtitle: {
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4,
  },

  content: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  container: {
    alignItems: 'stretch',
    paddingTop: 10,
    paddingBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  entryBlock: {
    marginBottom: 6,
  },

  input: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontFamily: 'Commissioner',
    fontSize: 14,
    marginBottom: 18,
  },

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dateInput: {
    width: '48.5%',
  },

  passwordContainer: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 10,
    marginBottom: 18,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: 'Commissioner',
    fontSize: 14,
  },

  primaryButton: {
    height: 41,
    backgroundColor: '#7F9DD5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 12,
  },

  skipButton: {
    height: 41,
    backgroundColor: '#5B74A3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  addButton: {
    height: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  addButtonText: {
    fontSize: 13,
    color: '#777777',
  },

  uploadBox: {
    height: 190,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 12,
  },

  uploadText: {
    fontSize: 13,
    color: '#555555',
    marginTop: 10,
    textAlign: 'center',
  },

  uploadHint: {
    fontSize: 11,
    color: '#7891BD',
    marginTop: 2,
  },

  photoWrapper: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 14,
  },

  photoCircle: {
    width: 175,
    height: 175,
    borderRadius: 88,
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  photoImage: {
    width: '100%',
    height: '100%',
  },

  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3E3E3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  photoHint: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 34,
  },

  skillsBox: {
    minHeight: 80,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginBottom: 30,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },

  chipText: {
    fontSize: 12,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },

  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  reviewAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#B5B5B5',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 14,
  },

  reviewName: {
    fontSize: 16,
    fontWeight: '600',
  },

  reviewDetail: {
    fontSize: 11,
    color: '#777777',
  },

  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },

  reviewCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },

  resumeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  resumeLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    marginRight: 10,
  },

  resumeStatus: {
    fontSize: 11,
  },
});