// src/features/auth/screens/SignupScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthStackParamList } from '../../../navigation/AuthStack';
import { registerUser } from '@shared/api/auth';
import { colors, typography, spacing, radius, shadows } from '@theme';

type Role = 'BUYER' | 'SELLER' | 'USER';
type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

const { width } = Dimensions.get('window');

const ROLES: Role[] = ['BUYER', 'SELLER'];

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('BUYER');
  const [showRoleSheet, setShowRoleSheet] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Focus states
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Input refs
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleSignup = async () => {
    if (!firstName || !lastName || !mobileNumber || !address || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      Alert.alert('Error', 'Mobile number must be exactly 10 digits');
      return;
    }

    if (!/^[\w.+\-]+@gmail\.com$/.test(email)) {
      Alert.alert('Error', 'Email must be a valid Gmail address (ending with @gmail.com)');
      return;
    }

    if (!/^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long and contain at least 1 special symbol');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        email,
        password,
        firstName,
        lastName,
        mobileNumber: Number(mobileNumber),
        address,
        role,
      };

      await registerUser(payload);

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (e: any) {
      setSubmitting(false);
      const data = e?.response?.data;
      const msg = data?.errorMessage || data?.message || e?.message || 'Signup failed';
      Alert.alert('Error', msg);
    }
  };

  const roleLabel = (r: Role) => {
    switch (r) {
      case 'BUYER': return 'Buyer';
      case 'SELLER': return 'Seller';
      default: return r;
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    iconName: string,
    fieldName: string,
    inputRef: React.RefObject<TextInput>,
    nextRef?: React.RefObject<TextInput>,
    keyboardType?: 'default' | 'email-address' | 'phone-pad',
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
    secureTextEntry?: boolean,
    showToggle?: boolean,
    onToggle?: () => void
  ) => {
    const isFocused = focusedField === fieldName;

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={({ pressed }) => [
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
            pressed && styles.inputContainerPressed,
          ]}
        >
          <Icon
            name={iconName}
            size={20}
            color={isFocused ? colors.primary : colors.textTertiary}
            style={styles.inputIcon}
          />
          <TextInput
            ref={inputRef}
            placeholder={placeholder}
            placeholderTextColor={colors.textQuaternary}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType || 'default'}
            autoCapitalize={autoCapitalize || 'none'}
            secureTextEntry={secureTextEntry}
            onFocus={() => setFocusedField(fieldName)}
            onBlur={() => setFocusedField(null)}
            returnKeyType={nextRef ? 'next' : 'done'}
            onSubmitEditing={() => {
              if (nextRef) {
                nextRef.current?.focus();
              } else if (fieldName === 'confirmPassword') {
                handleSignup();
              }
            }}
          />
          {showToggle && (
            <TouchableOpacity
              onPress={onToggle}
              style={styles.eyeButton}
              activeOpacity={0.7}
            >
              <Icon
                name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* Header with Brand */}
          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <View style={styles.brandLogo}>
                <Icon name="storefront-outline" size={32} color={colors.primary} />
              </View>
              <View style={styles.brandTextContainer}>
                <Text style={styles.brandTitle}>
                  Kharido
                  <Text style={styles.brandTitleGreen}>Becho</Text>
                </Text>
                <Text style={styles.brandSubtitle}>Buy & Sell Marketplace</Text>
              </View>
            </View>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Create Account </Text>
            <Text style={styles.welcomeSubtitle}>
              Join our marketplace to buy and sell
            </Text>
          </View>

          {/* Signup Card */}
          <View style={styles.signupCard}>
            {/* Role Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select your role</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.roleSelector}
                onPress={() => setShowRoleSheet(true)}
              >
                <Icon name="account-circle-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                <Text style={styles.roleSelectorText}>{roleLabel(role)}</Text>
                <Icon name="chevron-down" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            {renderInput('First name', firstName, setFirstName, 'Enter first name', 'account-outline', 'firstName', firstNameRef, lastNameRef, 'default', 'words')}
            {renderInput('Last name', lastName, setLastName, 'Enter last name', 'account-outline', 'lastName', lastNameRef, mobileRef, 'default', 'words')}
            {renderInput('Mobile number', mobileNumber, setMobileNumber, 'Enter 10-digit number', 'phone-outline', 'mobile', mobileRef, addressRef, 'phone-pad')}
            {renderInput('Address', address, setAddress, 'Enter your address', 'map-marker-outline', 'address', addressRef, emailRef)}
            {renderInput('Email address', email, setEmail, 'Enter your email', 'email-outline', 'email', emailRef, passwordRef, 'email-address')}
            {renderInput('Create password', password, setPassword, 'Min. 8 characters with symbol', 'lock-outline', 'password', passwordRef, confirmPasswordRef, 'default', 'none', !showPassword, true, () => setShowPassword(!showPassword))}
            {renderInput('Confirm password', confirmPassword, setConfirmPassword, 'Re-enter password', 'lock-check-outline', 'confirmPassword', confirmPasswordRef, undefined, 'default', 'none', !showConfirmPassword, true, () => setShowConfirmPassword(!showConfirmPassword))}

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.signupButton, submitting && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={colors.textInverse} />
              ) : (
                <>
                  <Text style={styles.signupButtonText}>Create Account</Text>
                  <Icon name="arrow-right" size={20} color={colors.textInverse} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Role Selection Modal */}
      <Modal
        visible={showRoleSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRoleSheet(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowRoleSheet(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your Role</Text>
              <TouchableOpacity
                onPress={() => setShowRoleSheet(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Choose how you want to use the marketplace
            </Text>

            {ROLES.map((r) => {
              const active = r === role;
              const roleInfo = {
                BUYER: { icon: 'cart-outline', desc: 'Browse and purchase items' },
                SELLER: { icon: 'store-outline', desc: 'List and sell your products' },
              };

              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleOption, active && styles.roleOptionActive]}
                  onPress={() => {
                    setRole(r);
                    setShowRoleSheet(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.roleIconContainer, active && styles.roleIconContainerActive]}>
                    <Icon
                      name={roleInfo[r].icon}
                      size={24}
                      color={active ? colors.secondary : colors.textTertiary}
                    />
                  </View>
                  <View style={styles.roleTextContainer}>
                    <Text style={[styles.roleOptionText, active && styles.roleOptionTextActive]}>
                      {roleLabel(r)}
                    </Text>
                    <Text style={styles.roleOptionDesc}>{roleInfo[r].desc}</Text>
                  </View>
                  {active && (
                    <Icon name="check-circle" size={24} color={colors.secondary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* Loading Overlay */}
      {submitting && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={colors.secondary} />
            <Text style={styles.loadingText}>Creating your account...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.semantic.screenHorizontal,
  },

  // Header with Brand
  header: {
    paddingTop: spacing.semantic.layoutMd,
    paddingBottom: spacing.semantic.layoutLg,
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandLogo: {
    width: 64,
    height: 64,
    borderRadius: radius.semantic.brandLogo,
    backgroundColor: colors.brandBadgeBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.semantic.componentMd,
    ...shadows.elevation.sm,
  },
  brandTextContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    ...typography.heading.h1,
    fontSize: 28,
    letterSpacing: 0.5,
  },
  brandTitleGreen: {
    color: colors.secondary,
  },
  brandSubtitle: {
    ...typography.body.base,
    color: colors.textTertiary,
    marginTop: spacing[1],
  },

  // Welcome Section
  welcomeSection: {
    marginTop: spacing[2],
    marginBottom: spacing.semantic.layoutMd,
    alignItems: 'center',
  },
  welcomeTitle: {
    ...typography.heading.h3,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing[1],
  },
  welcomeSubtitle: {
    ...typography.body.base,
    color: colors.textTertiary,
  },

  // Signup Card
  signupCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.semantic.cardLarge,
    padding: spacing.semantic.cardPaddingLarge,
    ...shadows.semantic.card,
  },

  // Input Group
  inputGroup: {
    marginBottom: spacing.semantic.layoutMd,
  },
  label: {
    ...typography.label.base,
    color: colors.textSecondary,
    marginBottom: spacing[2],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.searchBackground,
    borderRadius: radius.semantic.input,
    paddingHorizontal: spacing.semantic.inputPaddingHorizontal,
    paddingVertical:
      Platform.OS === 'ios'
        ? spacing.semantic.inputPaddingVertical + 4
        : spacing.semantic.inputPaddingVertical,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    ...shadows.elevation.xs,
  },
  inputContainerPressed: {
    opacity: 0.9,
  },
  inputIcon: {
    marginRight: spacing.semantic.inputIconGap,
  },
  input: {
    flex: 1,
    ...typography.special.searchInput,
    padding: 0,
  },
  eyeButton: {
    padding: spacing.semantic.componentSm,
    marginLeft: spacing.semantic.componentSm,
  },

  // Role Selector
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.searchBackground,
    borderRadius: radius.semantic.input,
    paddingHorizontal: spacing.semantic.inputPaddingHorizontal,
    paddingVertical:
      Platform.OS === 'ios'
        ? spacing.semantic.inputPaddingVertical + 4
        : spacing.semantic.inputPaddingVertical,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleSelectorText: {
    flex: 1,
    ...typography.special.searchInput,
    color: colors.textPrimary,
  },

  // Signup Button
  signupButton: {
    backgroundColor: colors.secondary,
    borderRadius: radius.semantic.button,
    paddingVertical: spacing.semantic.buttonPaddingVertical + 6,
    paddingHorizontal: spacing.semantic.buttonPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.semantic.brandButton,
    marginTop: spacing.semantic.layoutMd,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    ...typography.special.button,
    marginRight: spacing.semantic.buttonIconGap,
  },

  // Login Section
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.semantic.layoutXl,
  },
  loginText: {
    ...typography.body.large,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.label.large,
    color: colors.link,
  },

  // Bottom Spacing
  bottomSpacing: {
    height: spacing.semantic.bottomSpacingLarge,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.semantic.modal,
    borderTopRightRadius: radius.semantic.modal,
    padding: spacing.semantic.layoutXl,
    ...shadows.elevation['2xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.semantic.componentMd,
  },
  modalTitle: {
    ...typography.heading.h3,
    color: colors.textPrimary,
  },
  modalCloseButton: {
    padding: spacing.semantic.componentSm,
  },
  modalSubtitle: {
    ...typography.body.base,
    color: colors.textTertiary,
    marginBottom: spacing.semantic.layoutLg,
  },

  // Role Option
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.searchBackground,
    borderRadius: radius.semantic.cardLarge,
    padding: spacing.semantic.componentLg,
    marginBottom: spacing.semantic.layoutSm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleOptionActive: {
    backgroundColor: colors.successLight,
    borderColor: colors.secondary,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.semantic.category,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.semantic.componentLg,
  },
  roleIconContainerActive: {
    backgroundColor: colors.surface,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleOptionText: {
    ...typography.label.large,
    color: colors.textPrimary,
    marginBottom: spacing[1],
  },
  roleOptionTextActive: {
    color: colors.secondary,
    fontWeight: '700',
  },
  roleOptionDesc: {
    ...typography.body.small,
    color: colors.textTertiary,
  },

  // Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContent: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.semantic.layoutXl,
    paddingHorizontal: spacing.semantic.layoutXl + spacing[4],
    borderRadius: radius.semantic.cardLarge,
    alignItems: 'center',
    ...shadows.elevation.xl,
    minWidth: width * 0.5,
  },
  loadingText: {
    ...typography.body.large,
    color: colors.textPrimary,
    marginTop: spacing.semantic.layoutMd,
    fontWeight: '600',
  },
});
