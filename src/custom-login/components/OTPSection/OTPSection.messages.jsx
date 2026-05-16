import { defineMessages } from '@edx/frontend-platform/i18n';

export default defineMessages({
  'LOGIN.OTP_LABEL': {
    id: 'LOGIN.OTP_LABEL',
    defaultMessage: 'Verification code',
    description: 'Custom login — OTP field label',
  },
  'LOGIN.OTP_SUBMIT': {
    id: 'LOGIN.OTP_SUBMIT',
    defaultMessage: 'Verify and continue',
    description: 'Custom login — OTP submit button',
  },
  'LOGIN.OTP_REQUIRED': {
    id: 'LOGIN.OTP_REQUIRED',
    defaultMessage: 'Enter the verification code',
    description: 'Custom login — OTP required validation',
  },
  'LOGIN.OTP_PENDING': {
    id: 'LOGIN.OTP_PENDING',
    defaultMessage: 'Verifying',
    description: 'Custom login — screen reader text while verifying OTP',
  },
  'LOGIN.OTP_RESEND': {
    id: 'LOGIN.OTP_RESEND',
    defaultMessage: 'Resend OTP',
    description: 'Custom login — resend OTP button label',
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
