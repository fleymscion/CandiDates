import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth, db } from '../config/firebase';
import EmployerOnboarding from './EmployerOnboarding';
import showAlert from './showAlert';

export default function EmployerOnboardingScreen({ onNavigate }) {
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
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(true);

  // If this employer already finished onboarding, skip straight to the app.
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

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Returns an error message if the step has blank/invalid required fields.
  // Step 2 (permit) can still be skipped, since file storage isn't set up yet.
  const validateStep = (n) => {
    if (n === 1) {
      if (!companyName.trim()) return 'Please enter your company name.';
      if (!industry.trim()) return 'Please enter your industry.';
      const site = website.trim();
      if (!site) return 'Please enter your company website.';
      if (/\s/.test(site) || !site.includes('.')) {
        return 'Please enter a valid website, for example https://example.com.';
      }
    }
    if (n === 3) {
      if (!description.trim()) return 'Please enter a company description.';
      if (!contactName.trim()) return 'Please enter a hiring contact name.';
      if (!contactEmail.trim()) return 'Please enter a contact email.';
      if (!emailPattern.test(contactEmail.trim())) {
        return 'Please enter a valid contact email address.';
      }
    }
    return '';
  };

  // Drives the button color: true when the user can move on from this step.
  const stepReady =
    step === 2 ? !!permitFile : step === 4 ? true : validateStep(step) === '';

  const next = () => {
    const error = validateStep(step);
    if (error) {
      showAlert('Missing Information', error);
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const back = () => {
    if (step === 1) {
      onNavigate('Login');
    } else {
      setStep((s) => s - 1);
    }
  };

  const pickLogo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length) {
        setLogoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Logo pick error:', error);
      showAlert('Error', 'Could not select the logo.');
    }
  };

  const pickPermit = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length) {
        setPermitFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Permit pick error:', error);
      showAlert('Error', 'Could not select the file.');
    }
  };

  const submitPermit = () => {
    if (!permitFile) {
      showAlert(
        'No file selected',
        'Upload your business permit, or choose "Do this later".'
      );
      return;
    }
    next();
  };

  const skipPermit = () => {
    setPermitFile(null);
    next();
  };

  const finish = async () => {
    if (saving) return;

    const user = auth.currentUser;
    if (!user) {
      showAlert('Not signed in', 'Please log in again.');
      onNavigate('Login');
      return;
    }

    // Re-check required steps before saving
    for (const n of [1, 3]) {
      const error = validateStep(n);
      if (error) {
        setStep(n);
        showAlert('Missing Information', error);
        return;
      }
    }

    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);

      // Never overwrite a profile that was already onboarded
      const existing = await getDoc(userRef);
      if (existing.exists() && existing.data().onboardingComplete === true) {
        onNavigate('MainApp', { profile: existing.data() });
        return;
      }

      // Note: the logo and permit are not uploaded anywhere yet
      // (that needs Firebase Storage); only the permit name/status is saved.
      await updateDoc(userRef, {
        companyName: companyName.trim(),
        industry: industry.trim(),
        website: website.trim(),
        description: description.trim(),
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        socialLinks: socialLinks.trim(),
        permitName: permitFile?.name || null,
        verificationStatus: permitFile ? 'pending' : 'not_submitted',
        onboardingComplete: true,
      });

      const snap = await getDoc(userRef);
      onNavigate('MainApp', { profile: snap.data() });
    } catch (error) {
      console.error('Employer onboarding error:', error);
      showAlert('Save Failed', error?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
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
    <EmployerOnboarding
      step={step}
      stepReady={stepReady}
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