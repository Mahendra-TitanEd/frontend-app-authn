import { defineMessages } from '@edx/frontend-platform/i18n';

export default defineMessages({
  'LOGIN.OTP_PAGE_TITLE': {
    id: 'LOGIN.OTP_PAGE_TITLE',
    defaultMessage: 'Two-Factor Authentication',
    description: 'Custom login — OTP step heading',
  },
  'LOGIN.OTP_PAGE_SUBTITLE_INTRO': {
    id: 'LOGIN.OTP_PAGE_SUBTITLE_INTRO',
    defaultMessage: 'Enter the 6-digit verification code sent to',
    description: 'Custom login — OTP step subtitle before email',
  },
  'LOGIN.OTP_SUBMIT': {
    id: 'LOGIN.OTP_SUBMIT',
    defaultMessage: 'Verify & Sign In',
    description: 'Custom login — OTP verify button',
  },
  'LOGIN.OTP_SUBMIT_PENDING': {
    id: 'LOGIN.OTP_SUBMIT_PENDING',
    defaultMessage: 'Verifying',
    description: 'Custom login — screen reader text while verifying OTP',
  },
  'LOGIN.OTP_REQUIRED': {
    id: 'LOGIN.OTP_REQUIRED',
    defaultMessage: 'Enter the verification code',
    description: 'Custom login — OTP required validation',
  },
  'LOGIN.OTP_BACK': {
    id: 'LOGIN.OTP_BACK',
    defaultMessage: 'Back to login',
    description: 'Custom login — return to credentials step',
  },
  'LOGIN.OTP_RESEND': {
    id: 'LOGIN.OTP_RESEND',
    defaultMessage: 'Resend code',
    description: 'Custom login — resend OTP button',
  },
  'LOGIN.OTP_RESEND_PENDING': {
    id: 'LOGIN.OTP_RESEND_PENDING',
    defaultMessage: 'Resending',
    description: 'Custom login — screen reader text while resending OTP',
  },
  'LOGIN.OTP_RESEND_IN': {
    id: 'LOGIN.OTP_RESEND_IN',
    defaultMessage: 'Resend in {seconds}s',
    description: 'Custom login — resend countdown label',
  },
});
