import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth, db } from '../config/firebase';
import ProfileSetupView from './EmployeeOnboarding';
import showAlert from './showAlert';

const emptyExperience = () => ({ title: '', start: '', end: '' });
const emptyEducation = () => ({ school: '', program: '', start: '', end: '' });

export default function EmployeeOnboardingScreen({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [cvFile, setCvFile] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [experiences, setExperiences] = useState([emptyExperience()]);
  const [educations, setEducations] = useState([emptyEducation()]);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const [stepError, setStepError] = useState('');

  // If this employee already finished onboarding, skip straight to the app.
  useEffect(() => {
    let cancelled = false;

    const checkOnboarding = async () => {
      const user = auth.currentUser;
      if (!user) {
        onNavigate('Login');
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const profile = snap.exists() ? snap.data() : null;

        if (!cancelled && profile?.onboardingComplete === true) {
          onNavigate('MainApp', { profile });
          return;
        }
      } catch (error) {
        console.error('Onboarding check error:', error);
      }

      if (!cancelled) setChecking(false);
    };

    checkOnboarding();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Returns an error message if the given step isn't complete, else ''.
  // Steps 3-5 are required; steps 1-2 can be skipped.
  const validateStep = (n) => {
    switch (n) {
      // Steps 1 (resume) and 2 (photo) are optional and can be skipped,
      // since file/photo storage isn't set up yet.
      case 1:
      case 2:
        return '';
      case 3:
        return experiences.some(
          (e) => e.title.trim() !== '' && e.start.trim() !== ''
        )
          ? ''
          : 'Add at least one work experience with a job title and start date.';
      case 4:
        return educations.some(
          (e) => e.school.trim() !== '' && e.program.trim() !== ''
        )
          ? ''
          : 'Add at least one education with a school and program.';
      case 5:
        return skills.length > 0 ? '' : 'Add at least one skill to continue.';
      default:
        return '';
    }
  };

  const next = () => {
    const error = validateStep(step);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError('');
    setStep((s) => Math.min(s + 1, 6));
  };

  const back = () => {
    setStepError('');
    if (step === 1) {
      onNavigate('Login');
    } else {
      setStep((s) => s - 1);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length) {
        setCvFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Document pick error:', error);
      showAlert('Error', 'Could not select the file.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image pick error:', error);
      showAlert('Error', 'Could not select the photo.');
    }
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (!skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setSkills([...skills, value]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const updateExperience = (index, field, value) =>
    setExperiences((list) =>
      list.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );

  const addExperience = () =>
    setExperiences((list) => [...list, emptyExperience()]);

  const updateEducation = (index, field, value) =>
    setEducations((list) =>
      list.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );

  const addEducation = () =>
    setEducations((list) => [...list, emptyEducation()]);

  const submit = async () => {
    if (submitting) return;

    const user = auth.currentUser;
    if (!user) {
      showAlert('Not signed in', 'Please log in again.');
      onNavigate('Login');
      return;
    }

    // Re-check every required step before saving
    for (let n = 1; n <= 5; n++) {
      const error = validateStep(n);
      if (error) {
        setStep(n);
        setStepError(error);
        return;
      }
    }

    setSubmitting(true);
    try {
      const userRef = doc(db, 'users', user.uid);

      // Never overwrite a profile that was already onboarded
      const existing = await getDoc(userRef);
      if (existing.exists() && existing.data().onboardingComplete === true) {
        onNavigate('MainApp', { profile: existing.data() });
        return;
      }

      // Note: the resume file and photo are not uploaded anywhere yet
      // (that needs Firebase Storage); only their names/presence are saved.
      await updateDoc(userRef, {
        experiences: experiences.filter((e) => e.title.trim() !== ''),
        educations: educations.filter((e) => e.school.trim() !== ''),
        skills,
        resumeName: cvFile?.name || null,
        onboardingComplete: true,
      });

      const snap = await getDoc(userRef);
      onNavigate('MainApp', { profile: snap.data() });
    } catch (error) {
      console.error('Onboarding submit error:', error);
      showAlert('Submit Failed', error?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#011F5B" />
      </View>
    );
  }

  return (
    <ProfileSetupView
      step={step}
      stepError={stepError}
      cvFile={cvFile}
      photoUri={photoUri}
      experiences={experiences}
      educations={educations}
      skillInput={skillInput}
      skills={skills}
      submitting={submitting}
      next={next}
      back={back}
      pickDocument={pickDocument}
      pickImage={pickImage}
      setSkillInput={setSkillInput}
      addSkill={addSkill}
      removeSkill={removeSkill}
      updateExperience={updateExperience}
      addExperience={addExperience}
      updateEducation={updateEducation}
      addEducation={addEducation}
      submit={submit}
    />
  );
}