// needs: npx expo install expo-document-picker expo-image-picker

import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import EmployerOnboarding from '../view/EmployerOnboarding';

export default function EmployerOnboardingController({ navigation, onSubmit }) {
  const [step, setStep] = useState(1);
  const [logoUri, setLogoUri] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [permitFile, setPermitFile] = useState(null);
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [socialLinks, setSocialLinks] = useState('');

  const next = () => {
    if (step === 1 && companyName.trim() === '') {
      Alert.alert('Company name needed', 'Please type your company name first.');
      return;
    }
    setStep(step + 1);
  };

  const back = () => {
    if (step === 1) {
      if (navigation) navigation.goBack();
    } else {
      setStep(step - 1);
    }
  };

  const pickLogo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to upload a logo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      Alert.alert('Too big', 'Logo must be 5MB or smaller.');
      return;
    }
    setLogoUri(asset.uri);
  };

  const pickPermit = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (asset.size && asset.size > 10 * 1024 * 1024) {
      Alert.alert('Too big', 'File must be 10MB or smaller.');
      return;
    }
    setPermitFile({ name: asset.name, uri: asset.uri, size: asset.size });
  };

  const submitPermit = () => {
    if (!permitFile) {
      Alert.alert('No file yet', 'Upload your permit first or tap "Do this later".');
      return;
    }
    setStep(3);
  };

  const skipPermit = () => setStep(3);

  const finish = async () => {
    const profile = {
      logoUri,
      companyName,
      industry,
      website,
      permitFile,
      description,
      contactName,
      contactEmail,
      socialLinks,
    };

    try {
      if (onSubmit) await onSubmit(profile);
    } catch (e) {
      Alert.alert('Error', 'Could not save your profile. Try again.');
    }
  };

  return (
    <EmployerOnboarding
      step={step}
      logoUri={logoUri}
      companyName={companyName}
      industry={industry}
      website={website}
      permitFile={permitFile}
      description={description}
      contactName={contactName}
      contactEmail={contactEmail}
      socialLinks={socialLinks}
      setCompanyName={setCompanyName}
      setIndustry={setIndustry}
      setWebsite={setWebsite}
      setDescription={setDescription}
      setContactName={setContactName}
      setContactEmail={setContactEmail}
      setSocialLinks={setSocialLinks}
      pickLogo={pickLogo}
      pickPermit={pickPermit}
      submitPermit={submitPermit}
      skipPermit={skipPermit}
      next={next}
      back={back}
      finish={finish}
    />
  );
}
