// Before i-run 'tong controller, need i-run 'to: npx expo install expo-document-picker expo-image-picker

import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import ProfileSetupView from '../view/EmployeeOnboarding';

const TOTAL_STEPS = 6;
const MAX_FILE_BYTES = 5 * 1024 * 1024; 

const CV_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const emptyExperience = () => ({ title: '', start: '', end: '' });
const emptyEducation = () => ({ school: '', program: '', start: '', end: '' });

export default function EmployeeBoardingController({ navigation, onSubmit, onDone }) {
  const [step, setStep] = useState(1);
  const [cvFile, setCvFile] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [experiences, setExperiences] = useState([emptyExperience()]);
  const [educations, setEducations] = useState([emptyEducation()]);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));

  const back = () => {
    if (step === 1) {
      navigation?.goBack();
    } else {
      setStep((s) => s - 1);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: CV_MIME_TYPES,
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) return;

      if (asset.size && asset.size > MAX_FILE_BYTES) {
        Alert.alert('File too large', 'Please choose a file that is 5MB or smaller.');
        return;
      }

      setCvFile({
        name: asset.name,
        size: asset.size,
        uri: asset.uri,
        mimeType: asset.mimeType,
      });
    } catch (err) {
      Alert.alert('Upload failed', 'We could not open that file. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Allow photo access to add a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) return;

      if (asset.fileSize && asset.fileSize > MAX_FILE_BYTES) {
        Alert.alert('Photo too large', 'Please choose a photo that is 5MB or smaller.');
        return;
      }

      setPhotoUri(asset.uri);
    } catch (err) {
      Alert.alert('Upload failed', 'We could not open that photo. Please try again.');
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill !== '' && !skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setSkills([...skills, skill]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const updateExperience = (index, field, value) =>
    setExperiences(experiences.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const addExperience = () => setExperiences([...experiences, emptyExperience()]);

  const updateEducation = (index, field, value) =>
    setEducations(educations.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const addEducation = () => setEducations([...educations, emptyEducation()]);

  const submit = async () => {
    if (submitting) return;

    const profile = {
      cvFile,
      photoUri,
      experiences: experiences.filter((e) => e.title.trim() !== ''),
      educations: educations.filter((e) => e.school.trim() !== ''),
      skills,
    };

    try {
      setSubmitting(true);
      await onSubmit?.(profile);
      onDone?.();
    } catch (err) {
      Alert.alert('Submission failed', 'Something went wrong saving your profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProfileSetupView

      step={step}
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
