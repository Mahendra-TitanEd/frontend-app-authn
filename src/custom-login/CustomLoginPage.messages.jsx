import { defineMessages } from '@edx/frontend-platform/i18n';

export default defineMessages({
  'LOGIN.PAGE_TITLE': {
    id: 'LOGIN.PAGE_TITLE',
    defaultMessage: 'Sign in | {siteName}',
    description: 'Custom login — document title',
  },
  'LOGIN.API_GENERIC': {
    id: 'LOGIN.API_GENERIC',
    defaultMessage: 'Sign-in failed. Please try again.',
    description: 'Custom login — fallback when API error has no message body',
  },
  'LOGIN.API_UNKNOWN': {
    id: 'LOGIN.API_UNKNOWN',
    defaultMessage: 'Something went wrong. Check your connection and try again.',
    description: 'Custom login — fallback when no response body (e.g. network)',
  },
  'LOGIN.SIGN_IN_FAILED': {
    id: 'LOGIN.SIGN_IN_FAILED',
    defaultMessage: 'We could not sign you in. Check your email and password.',
    description: 'Custom login — when LMS returns success false without a message',
  },
  'LOGIN.OTP_SENT_FALLBACK': {
    id: 'LOGIN.OTP_SENT_FALLBACK',
    defaultMessage: 'OTP generated. Please check your email and enter OTP.',
    description: 'Custom login — fallback when start auth response has no message',
  },
  'LOGIN.OTP_VERIFIED_FALLBACK': {
    id: 'LOGIN.OTP_VERIFIED_FALLBACK',
    defaultMessage: 'OTP verified successfully. Redirecting...',
    description: 'Custom login — fallback when verify response has no message',
  },
  'LOGIN.OTP_VERIFY_FAILED': {
    id: 'LOGIN.OTP_VERIFY_FAILED',
    defaultMessage: 'The verification code is incorrect. Please try again.',
    description: 'Custom login — fallback when OTP verify fails',
  },
  'LOGIN.TOAST_SUCCESS_TITLE': {
    id: 'LOGIN.TOAST_SUCCESS_TITLE',
    defaultMessage: 'Success',
    description: 'Custom login — toast fallback success title',
  },
  'LOGIN.TOAST_ERROR_TITLE': {
    id: 'LOGIN.TOAST_ERROR_TITLE',
    defaultMessage: 'Something went wrong',
    description: 'Custom login — toast fallback error title',
  },
  'LOGIN.TOAST_INFO_TITLE': {
    id: 'LOGIN.TOAST_INFO_TITLE',
    defaultMessage: 'Notice',
    description: 'Custom login — toast fallback info title',
  },
  'LOGIN.PASSWORD_RESET_SUCCESS_TITLE': {
    id: 'LOGIN.PASSWORD_RESET_SUCCESS_TITLE',
    defaultMessage: 'Password reset complete',
    description: 'Custom login — toast after successful password reset',
  },
  'LOGIN.PASSWORD_RESET_SUCCESS_DESCRIPTION': {
    id: 'LOGIN.PASSWORD_RESET_SUCCESS_DESCRIPTION',
    defaultMessage: 'Your password has been reset. Sign in to your account.',
    description: 'Custom login — toast description after password reset',
  },
});
