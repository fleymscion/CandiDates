import React from 'react';
import { StyleSheet, View, TextInput, Pressable, Image, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

export default function EmployerOnboarding({
  step,
  logoUri,
  companyName,
  industry,
  website,
  permitFile,
  description,
  contactName,
  contactEmail,
  socialLinks,
  setCompanyName,
  setIndustry,
  setWebsite,
  setDescription,
  setContactName,
  setContactEmail,
  setSocialLinks,
  pickLogo,
  pickPermit,
  submitPermit,
  skipPermit,
  next,
  back,
  finish,
}) {

  const titles = [
    'Company Info',
    'Verify your business',
    'About & contact',
    'Review your profile',
  ];

  const subtitles = [
    'This appears on every CandiDate you post.',
    'Required before you can post CandiDates.',
    'Help candidates know who they\'re meeting.',
    'Here\'s what candidates will see.',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={back}>
          <Ionicons name="arrow-back-circle" size={26} color="#FFFFFF" />
        </Pressable>

        <AppText style={styles.stepText}>
          Step {step} of 4
        </AppText>

        <AppText style={styles.headerTitle}>
          {titles[step - 1]}
        </AppText>

        <AppText style={styles.headerSubtitle}>
          {subtitles[step - 1]}
        </AppText>
      </View>

      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >

          {step === 1 && (
            <>
              <View style={styles.logoRow}>
                <Pressable style={styles.logoBox} onPress={pickLogo}>
                  {logoUri ? (
                    <Image source={{ uri: logoUri }} style={styles.logoImage} />
                  ) : (
                    <Ionicons name="business" size={50} color="#B5B5B5" />
                  )}
                </Pressable>

                <View style={styles.logoRight}>
                  <Pressable style={styles.logoButton} onPress={pickLogo}>
                    <AppText style={styles.logoButtonText}>Upload logo</AppText>
                  </Pressable>
                  <AppText style={styles.smallHint}>Square, min 200x200px</AppText>
                </View>
              </View>

              <AppText style={styles.label}>Company Name</AppText>
              <TextInput
                style={styles.input}
                placeholder="eg. Northwind Studios"
                placeholderTextColor="#777777"
                value={companyName}
                onChangeText={setCompanyName}
              />

              <AppText style={styles.label}>Industry</AppText>
              <TextInput
                style={styles.input}
                placeholder="eg. Software, Retail, Design"
                placeholderTextColor="#777777"
                value={industry}
                onChangeText={setIndustry}
              />

              <AppText style={styles.label}>Company Website</AppText>
              <TextInput
                style={styles.input}
                placeholder="https://"
                placeholderTextColor="#777777"
                value={website}
                onChangeText={setWebsite}
                autoCapitalize="none"
                keyboardType="url"
              />

              <Pressable style={styles.mainButton} onPress={next}>
                <AppText style={styles.buttonText}>Next</AppText>
              </Pressable>
            </>
          )}

          {step === 2 && (
            <>
              <View style={styles.whyCard}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#011F5B" />
                <View style={styles.whyTextBox}>
                  <AppText style={styles.whyTitle}>Why we ask for this</AppText>
                  <AppText style={styles.whyText}>
                    Verification keeps job seekers safe from fake listings.
                  </AppText>
                </View>
              </View>

              <Pressable style={styles.uploadBox} onPress={pickPermit}>
                <Ionicons
                  name={permitFile ? 'document-text-outline' : 'cloud-upload-outline'}
                  size={46}
                  color="#7891BD"
                />
                <AppText style={styles.uploadTitle}>
                  {permitFile ? permitFile.name : 'Upload business permit or registration'}
                </AppText>
                <AppText style={styles.smallHint}>
                  {permitFile ? 'Tap to replace' : 'PDF or image, max 10MB'}
                </AppText>
                {!permitFile && (
                  <AppText style={styles.browseText}>Browse Files</AppText>
                )}
              </Pressable>

              <AppText style={styles.reviewNote}>
                Review usually takes 1-2 business days. You can finish your profile in the meantime.
              </AppText>

              <Pressable style={styles.mainButton} onPress={submitPermit}>
                <AppText style={styles.buttonText}>Submit & Continue</AppText>
              </Pressable>

              <Pressable style={styles.skipButton} onPress={skipPermit}>
                <AppText style={styles.buttonText}>Do this later</AppText>
              </Pressable>
            </>
          )}

          {step === 3 && (
            <>
              <AppText style={styles.label}>Company description</AppText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell candidates a bit about your company..."
                placeholderTextColor="#777777"
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />

              <AppText style={styles.label}>Hiring contact name</AppText>
              <TextInput
                style={styles.input}
                placeholder="eg. Juan Dela Cruz"
                placeholderTextColor="#777777"
                value={contactName}
                onChangeText={setContactName}
              />

              <AppText style={styles.label}>Email</AppText>
              <TextInput
                style={styles.input}
                placeholder="hiring@company.com"
                placeholderTextColor="#777777"
                value={contactEmail}
                onChangeText={setContactEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <AppText style={styles.label}>Social links (optional)</AppText>
              <TextInput
                style={styles.input}
                placeholder="LinkedIn, Facebook"
                placeholderTextColor="#777777"
                value={socialLinks}
                onChangeText={setSocialLinks}
                autoCapitalize="none"
              />

              <Pressable style={styles.mainButton} onPress={next}>
                <AppText style={styles.buttonText}>Finish Setup</AppText>
              </Pressable>
            </>
          )}

          {step === 4 && (
            <>
              <View style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={styles.reviewLogo}>
                    {logoUri ? (
                      <Image source={{ uri: logoUri }} style={styles.logoImage} />
                    ) : (
                      <Ionicons name="business" size={32} color="#B5B5B5" />
                    )}
                  </View>

                  <View style={styles.reviewTopText}>
                    <AppText style={styles.reviewName}>
                      {companyName || 'Company name'}
                    </AppText>
                    <AppText style={styles.reviewDetail}>
                      {industry || 'Industry'}
                    </AppText>
                  </View>
                </View>

                <AppText style={styles.reviewDetail}>
                  {description || 'No description added'}
                </AppText>
              </View>

              <View style={[styles.reviewCard, styles.row]}>
                <AppText style={styles.rowLabel}>Website</AppText>
                <AppText style={styles.rowValue}>{website || '-'}</AppText>
              </View>

              <View style={[styles.reviewCard, styles.row]}>
                <AppText style={styles.rowLabel}>Hiring Contact</AppText>
                <AppText style={styles.rowValue}>{contactName || '-'}</AppText>
              </View>

              <View style={[styles.reviewCard, styles.row]}>
                <AppText style={styles.rowLabel}>Contact email</AppText>
                <AppText style={styles.rowValue}>{contactEmail || '-'}</AppText>
              </View>

              <View style={styles.statusRow}>
                <AppText style={styles.statusText}>Verification</AppText>
                <AppText style={styles.statusText}>
                  {permitFile ? 'Pending review' : 'Not submitted'}
                </AppText>
              </View>

              <Pressable style={styles.mainButton} onPress={finish}>
                <AppText style={styles.buttonText}>Finish Setup</AppText>
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

  textArea: {
    height: 110,
    paddingTop: 10,
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

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  logoBox: {
    width: 90,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  logoImage: {
    width: '100%',
    height: '100%',
  },

  logoRight: {
    marginLeft: 16,
    alignItems: 'center',
  },

  logoButton: {
    height: 34,
    paddingHorizontal: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  logoButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },

  smallHint: {
    fontSize: 10,
    color: '#777777',
    textAlign: 'center',
    marginTop: 4,
  },

  whyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },

  whyTextBox: {
    flex: 1,
    marginLeft: 12,
  },

  whyTitle: {
    fontSize: 12,
    fontWeight: '600',
  },

  whyText: {
    fontSize: 11,
    color: '#777777',
  },

  uploadBox: {
    height: 190,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 12,
  },

  uploadTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },

  browseText: {
    fontSize: 12,
    color: '#2B5195',
    marginTop: 8,
    textDecorationLine: 'underline',
  },

  reviewNote: {
    fontSize: 11,
    color: '#555555',
    marginBottom: 24,
  },

  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },

  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  reviewLogo: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },

  reviewTopText: {
    flex: 1,
  },

  reviewName: {
    fontSize: 16,
    fontWeight: '600',
  },

  reviewDetail: {
    fontSize: 11,
    color: '#777777',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowLabel: {
    fontSize: 11,
    color: '#777777',
  },

  rowValue: {
    fontSize: 11,
    fontWeight: '600',
    maxWidth: '60%',
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 4,
    marginBottom: 20,
  },

  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
