// src/features/auth/screens/LoginScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthStackParamList } from '../../../navigation/AuthStack';
import { useAuth } from '../../../context/AuthContext';
import { colors, typography, spacing, radius, shadows } from '@theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
const { height, width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // 👉 Refs so we can focus inputs when pressing on the whole field
  const emailInputRef = useRef<TextInput | null>(null);
  const passwordInputRef = useRef<TextInput | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (loading) return;
      setLoading(true);
      await signIn(email, password);
    } catch (e: any) {
      setLoading(false);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.errorMessage ||
        'Invalid email or password';
      Alert.alert('Login failed', msg);
    }
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
          keyboardShouldPersistTaps="always"  // 👈 important for touch when keyboard open
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
            <Text style={styles.welcomeTitle}>Welcome back 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Login to continue buying and selling
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>

              {/* 👇 Whole field is now pressable */}
              <Pressable
                onPress={() => emailInputRef.current?.focus()}
                style={({ pressed }) => [
                  styles.inputContainer,
                  emailFocused && styles.inputContainerFocused,
                  pressed && styles.inputContainerPressed,
                ]}
              >
                <Icon
                  name="email-outline"
                  size={20}
                  color={emailFocused ? colors.primary : colors.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={emailInputRef}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textQuaternary}
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  // 👇 allow tapping inside as usual
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
              </Pressable>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>

              {/* 👇 Whole field is now pressable */}
              <Pressable
                onPress={() => passwordInputRef.current?.focus()}
                style={({ pressed }) => [
                  styles.inputContainer,
                  passwordFocused && styles.inputContainerFocused,
                  pressed && styles.inputContainerPressed,
                ]}
              >
                <Icon
                  name="lock-outline"
                  size={20}
                  color={passwordFocused ? colors.primary : colors.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={passwordInputRef}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textQuaternary}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              </Pressable>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.textInverse} />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Login</Text>
                  <Icon name="arrow-right" size={20} color={colors.textInverse} />
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Icon name="google" size={20} color="#EA4335" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Icon name="facebook" size={20} color="#1877F2" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupSection}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Full Screen Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={colors.secondary} />
            <Text style={styles.loadingText}>Signing you in...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    paddingTop: spacing.semantic.layoutLg,
    paddingBottom: spacing.semantic.layoutLg,
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandLogo: {
    width: 72,
    height: 72,
    borderRadius: radius.semantic.brandLogo,
    backgroundColor: colors.brandBadgeBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.semantic.componentLg,
    ...shadows.elevation.sm,
  },
  brandTextContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    ...typography.heading.h1,
    fontSize: 30,
    letterSpacing: 0.5,
  },
  brandTitleGreen: {
    color: colors.secondary,
  },
  brandSubtitle: {
    ...typography.body.base,
    color: colors.textTertiary,
    marginTop: spacing[2],
  },

  // Welcome Section
  welcomeSection: {
    marginTop: spacing[2],
    marginBottom: spacing.semantic.layoutLg,
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

  // Login Card
  loginCard: {
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
  // 👇 subtle feedback when pressed
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

  // Forgot Password
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.semantic.layoutMd,
  },
  forgotPasswordText: {
    ...typography.label.small,
    color: colors.link,
  },

  // Login Button
  loginButton: {
    backgroundColor: colors.secondary,
    borderRadius: radius.semantic.button,
    paddingVertical: spacing.semantic.buttonPaddingVertical + 6,
    paddingHorizontal: spacing.semantic.buttonPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.semantic.brandButton,
    marginBottom: spacing.semantic.layoutLg,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    ...typography.special.button,
    marginRight: spacing.semantic.buttonIconGap,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.semantic.layoutLg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.body.small,
    color: colors.textTertiary,
    marginHorizontal: spacing.semantic.layoutSm,
    fontWeight: '600',
  },

  // Social Buttons
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.semantic.layoutSm,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.semantic.button,
    paddingVertical: spacing.semantic.buttonPaddingVertical + 4,
    paddingHorizontal: spacing.semantic.buttonPaddingHorizontal,
    gap: spacing.semantic.buttonIconGap,
  },
  socialButtonText: {
    ...typography.label.base,
    color: colors.textPrimary,
  },

  // Sign Up Section
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.semantic.layoutXl,
  },
  signupText: {
    ...typography.body.large,
    color: colors.textSecondary,
  },
  signupLink: {
    ...typography.label.large,
    color: colors.link,
  },

  // Bottom Spacing
  bottomSpacing: {
    height: spacing.semantic.bottomSpacingLarge,
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
