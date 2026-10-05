import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Image, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

export default function ProfileSetupView({ navigation, onSubmit }) {
  const [step, setStep] = useState(1);
  const [cvFile, setCvFile] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [experiences, setExperiences] = useState([{ title: '', start: '', end: '' }]);
  const [educations, setEducations] = useState([{ school: '', program: '', start: '', end: '' }]);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);

  const titles = [
    'Build Your Profile',
    'Add a profile photo',
    'Work Experience',
    'Your Education',
    'Your Skills',
    'Review Your Profile',
  ];

  const subtitles = [
    'Upload your resume to get started',
    'A clear photo helps employers recognize you.',
    '',
    '',
    "Add skills that show what you're good at.",
    "Here's what employers will see.",
  ];

  const next = () => setStep(step + 1);

  const back = () => {
    if (step === 1) {
      if (navigation) navigation.goBack();
    } else {
      setStep(step - 1);
    }
  };

  const pickDocument = async () => {};

  const pickImage = async () => {};

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill !== '' && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setSkillInput('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={back}>
          <Ionicons name="arrow-back-circle" size={26} color="#FFFFFF" />
        </Pressable>

        <AppText style={styles.stepText}>
          Step {step} of 6
        </AppText>

        <AppText style={styles.headerTitle}>
          {titles[step - 1]}
        </AppText>

        {subtitles[step - 1] !== '' && (
          <AppText style={styles.headerSubtitle}>
            {subtitles[step - 1]}
          </AppText>
        )}
      </View>

      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >

          {step === 1 && (
            <>
              <Pressable style={styles.uploadBox} onPress={pickDocument}>
                <Ionicons
                  name={cvFile ? 'document-text-outline' : 'cloud-download-outline'}
                  size={46}
                  color="#7891BD"
                />
                <AppText style={styles.uploadText}>
                  {cvFile ? cvFile.name : 'Click to browse files'}
                </AppText>
              </Pressable>

              <Pressable style={styles.mainButton} onPress={next}>
                <AppText style={styles.buttonText}>Submit</AppText>
              </Pressable>

              <Pressable style={styles.skipButton} onPress={next}>
                <AppText style={styles.buttonText}>Skip for now</AppText>
              </Pressable>
            </>
          )}

          {step === 2 && (
            <>
              <View style={styles.photoWrapper}>
                <Pressable style={styles.photoCircle} onPress={pickImage}>
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.photoImage} />
                  ) : (
                    <Ionicons name="person" size={130} color="#B5B5B5" />
                  )}
                </Pressable>

                <Pressable style={styles.cameraButton} onPress={pickImage}>
                  <Ionicons name="camera" size={22} color="#444444" />
                </Pressable>
              </View>

              <AppText style={styles.photoHint}>
                JPG or PNG, max 5MB
              </AppText>

              <Pressable style={styles.mainButton} onPress={next}>
                <AppText style={styles.buttonText}>Next</AppText>
              </Pressable>

              <Pressable style={styles.skipButton} onPress={next}>
                <AppText style={styles.buttonText}>Skip for now</AppText>
              </Pressable>
            </>
          )}

          {step === 3 && (
            <>
              {experiences.map((exp, index) => (
                <View key={index}>
                  <AppText style={styles.label}>Job Title</AppText>

                  <TextInput
                    style={styles.input}
                    placeholder="Type here..."
                    placeholderTextColor="#777777"
                    value={exp.title}
                    onChangeText={(text) =>
                      setExperiences(experiences.map((item, i) =>
                        i === index ? { ...item, title: text } : item
                      ))
                    }
                  />

                  <AppText style={styles.label}>Duration</AppText>

                  <View style={styles.dateRow}>
                    <TextInput
                      style={[styles.input, styles.dateInput]}
                      placeholder="Start Date"
                      placeholderTextColor="#777777"
                      value={exp.start}
                      onChangeText={(text) =>
                        setExperiences(experiences.map((item, i) =>
                          i === index ? { ...item, start: text } : item
                        ))
                      }
                    />

                    <TextInput
                      style={[styles.input, styles.dateInput]}
                      placeholder="End Date"
                      placeholderTextColor="#777777"
                      value={exp.end}
                      onChangeText={(text) =>
                        setExperiences(experiences.map((item, i) =>
                          i === index ? { ...item, end: text } : item
                        ))
                      }
                    />
                  </View>
                </View>
              ))}

              <Pressable
                style={styles.addButton}
                onPress={() =>
                  setExperiences([...experiences, { title: '', start: '', end: '' }])
                }
              >
                <AppText style={styles.addText}>+ Add Experience</AppText>
              </Pressable>

              <Pressable style={styles.mainButton} onPress={next}>
                <AppText style={styles.buttonText}>Next</AppText>
              </Pressable>
            </>
          )}

          {step === 4 && (
            <>
              {educations.map((edu, index) => (
                <View key={index}>
                  <AppText style={styles.label}>School/ University</AppText>

                  <TextInput
                    style={styles.input}
                    placeholder="Type here..."
                    placeholderTextColor="#777777"
                    value={edu.school}
                    onChangeText={(text) =>
                      setEducations(educations.map((item, i) =>
                        i === index ? { ...item, school: text } : item
                      ))
                    }
                  />

                  <AppText style={styles.label}>Program</AppText>

                  <TextInput
                    style={styles.input}
                    placeholder="Type here..."
                    placeholderTextColor="#777777"
                    value={edu.program}
                    onChangeText={(text) =>
                      setEducations(educations.map((item, i) =>
                        i === index ? { ...item, program: text } : item
                      ))
                    }
                  />

                  <AppText style={styles.label}>Duration</AppText>

                  <View style={styles.dateRow}>
                    <TextInput
                      style={[styles.input, styles.dateInput]}
                      placeholder="Start Date"
                      placeholderTextColor="#777777"
                      value={edu.start}
                      onChangeText={(text) =>
                        setEducations(educations.map((item, i) =>
                          i === index ? { ...item, start: text } : item
                        ))
                      }
                    />

                    <TextInput
                      style={[styles.input, styles.dateInput]}
                      placeholder="End Date"
                      placeholderTextColor="#777777"
                      value={edu.end}
                      onChangeText={(text) =>
                        setEducations(educations.map((item, i) =>
                          i === index ? { ...item, end: text } : item
                        ))
                      }
                    />
                  </View>
                </View>
              ))}

              <Pressable
                style={styles.addButton}
                onPress={() =>
                  setEducations([...educations, { school: '', program: '', start: '', end: '' }])
                }
              >
                <AppText style={styles.addText}>+ Add Education</AppText>
              </Pressable>

              <Pressable style={styles.mainButton} onPress={next}>
                <AppText style={styles.buttonText}>Next</AppText>
              </Pressable>
            </>
          )}

          {step === 5 && (
            <>
              <AppText style={styles.label}>Type a skill and press enter</AppText>

              <View style={styles.skillInputContainer}>
                <TextInput
                  style={styles.skillInput}
                  placeholder="Type here."
                  placeholderTextColor="#777777"
                  value={skillInput}
                  onChangeText={setSkillInput}
                  onSubmitEditing={addSkill}
                />

                <Pressable onPress={addSkill}>
                  <Ionicons name="add" size={22} color="#011F5B" />
                </Pressable>
              </View>

              <View style={styles.skillsBox}>
                {skills.map((skill) => (
                  <View key={skill} style={styles.chip}>
                    <AppText style={styles.chipText}>{skill}</AppText>

                    <Pressable onPress={() => setSkills(skills.filter((s) => s !== skill))}>
                      <Ionicons name="close" size={14} color="#011F5B" style={{ marginLeft: 6 }} />
                    </Pressable>
                  </View>
                ))}
              </View>

              <Pressable style={styles.mainButton} onPress={next}>
                <AppText style={styles.buttonText}>Next</AppText>
              </Pressable>
            </>
          )}

          {step === 6 && (
            <>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.photoImage} />
                  ) : (
                    <Ionicons name="person" size={50} color="#B5B5B5" />
                  )}
                </View>

                <View>
                  <AppText style={styles.reviewName}>Name</AppText>
                  <AppText style={styles.reviewDetail}>Details</AppText>
                  <AppText style={styles.reviewDetail}>Details</AppText>
                </View>
              </View>

              <View style={styles.reviewCard}>
                <AppText style={styles.reviewTitle}>Work Experience</AppText>

                {experiences.filter((e) => e.title.trim() !== '').length === 0 ? (
                  <AppText style={styles.reviewDetail}>Summary...</AppText>
                ) : (
                  experiences
                    .filter((e) => e.title.trim() !== '')
                    .map((e, i) => (
                      <AppText key={i} style={styles.reviewDetail}>
                        {e.title} ({e.start || '-'} to {e.end || '-'})
                      </AppText>
                    ))
                )}
              </View>

              <View style={styles.reviewCard}>
                <AppText style={styles.reviewTitle}>Education</AppText>

                {educations.filter((e) => e.school.trim() !== '').length === 0 ? (
                  <AppText style={styles.reviewDetail}>Summary...</AppText>
                ) : (
                  educations
                    .filter((e) => e.school.trim() !== '')
                    .map((e, i) => (
                      <AppText key={i} style={styles.reviewDetail}>
                        {e.school}{e.program ? ` - ${e.program}` : ''}
                      </AppText>
                    ))
                )}
              </View>

              <View style={styles.reviewCard}>
                <AppText style={styles.reviewTitle}>Skills</AppText>

                <View style={styles.chipRow}>
                  {skills.length === 0 ? (
                    <AppText style={styles.reviewDetail}>No skills added</AppText>
                  ) : (
                    skills.map((skill) => (
                      <View key={skill} style={styles.chip}>
                        <AppText style={styles.chipText}>{skill}</AppText>
                      </View>
                    ))
                  )}
                </View>
              </View>

              <View style={[styles.reviewCard, styles.resumeRow]}>
                <AppText style={styles.resumeText}>
                  {cvFile ? cvFile.name : 'Resume'}
                </AppText>
                <AppText style={styles.resumeText}>
                  {cvFile ? 'Uploaded' : 'Status'}
                </AppText>
              </View>

              <Pressable
                style={styles.mainButton}
                onPress={() => {
                  if (onSubmit) {
                    onSubmit({ cvFile, photoUri, experiences, educations, skills });
                  }
                }}
              >
                <AppText style={styles.buttonText}>Confirm and Submit</AppText>
              </Pressable>
            </>
          )}

        </ScrollView>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 16,
  },

  backButton: {
    position: 'absolute',
    top: 14,
    left: 16,
  },

  stepText: {
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

  mainButton: {
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

  buttonText: {
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

  addText: {
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

  skillInputContainer: {
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

  skillInput: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: 'Commissioner',
    fontSize: 14,
  },

  skillsBox: {
    minHeight: 80,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    padding: 8,
    marginBottom: 30,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
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

  reviewTitle: {
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

  resumeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});