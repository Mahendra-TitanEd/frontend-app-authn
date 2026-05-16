import { defineMessages } from '@edx/frontend-platform/i18n';

export default defineMessages({
  'FORGOT.PAGE_TITLE': {
    id: 'FORGOT.PAGE_TITLE',
    defaultMessage: 'Forgot Password | {siteName}',
    description: 'Custom forgot password — page title',
  },
  'FORGOT.HEADING': {
    id: 'FORGOT.HEADING',
    defaultMessage: 'Forgot Password?',
    description: 'Custom forgot password — form heading',
  },
  'FORGOT.SUBTITLE': {
    id: 'FORGOT.SUBTITLE',
    defaultMessage: 'No worries! Enter your email address and we\'ll send you a link to reset your password.',
    description: 'Custom forgot password — form subtitle',
  },
  'FORGOT.EMAIL_LABEL': {
    id: 'FORGOT.EMAIL_LABEL',
    defaultMessage: 'Email Address',
    description: 'Custom forgot password — email label',
  },
  'FORGOT.EMAIL_PLACEHOLDER': {
    id: 'FORGOT.EMAIL_PLACEHOLDER',
    defaultMessage: 'you@example.com',
    description: 'Custom forgot password — email placeholder',
  },
  'FORGOT.SUBMIT': {
    id: 'FORGOT.SUBMIT',
    defaultMessage: 'Send Reset Link',
    description: 'Custom forgot password — submit button',
  },
  'FORGOT.SUBMIT_PENDING': {
    id: 'FORGOT.SUBMIT_PENDING',
    defaultMessage: 'Sending',
    description: 'Custom forgot password — submit pending',
  },
  'FORGOT.SUCCESS_HEADING': {
    id: 'FORGOT.SUCCESS_HEADING',
    defaultMessage: 'Check Your Email',
    description: 'Custom forgot password — success heading',
  },
  'FORGOT.SUCCESS_BODY_PREFIX': {
    id: 'FORGOT.SUCCESS_BODY_PREFIX',
    defaultMessage: 'We\'ve sent a password reset link to',
    description: 'Custom forgot password — success body before email',
  },
  'FORGOT.SUCCESS_BODY_SUFFIX': {
    id: 'FORGOT.SUCCESS_BODY_SUFFIX',
    defaultMessage: '. Please check your inbox and follow the instructions.',
    description: 'Custom forgot password — success body after email',
  },
  'FORGOT.SUCCESS_HINT': {
    id: 'FORGOT.SUCCESS_HINT',
    defaultMessage: 'Didn\'t receive the email? Check your spam folder or',
    description: 'Custom forgot password — success hint before try again',
  },
  'FORGOT.TRY_AGAIN': {
    id: 'FORGOT.TRY_AGAIN',
    defaultMessage: 'try again',
    description: 'Custom forgot password — try again link',
  },
  'FORGOT.PANEL_HEADING': {
    id: 'FORGOT.PANEL_HEADING',
    defaultMessage: 'Reset Your Password',
    description: 'Custom forgot password — right panel heading',
  },
  'FORGOT.PANEL_BODY': {
    id: 'FORGOT.PANEL_BODY',
    defaultMessage: 'We\'ll help you get back to your learning journey in no time. Just enter your email and follow the simple steps.',
    description: 'Custom forgot password — right panel body',
  },
  'FORGOT.API_GENERIC': {
    id: 'FORGOT.API_GENERIC',
    defaultMessage: 'We were unable to send the reset email. Please try again.',
    description: 'Custom forgot password — generic API error',
  },
  'FORGOT.API_FORBIDDEN': {
    id: 'FORGOT.API_FORBIDDEN',
    defaultMessage: 'Your previous request is in progress. Please try again in a few moments.',
    description: 'Custom forgot password — rate limit / forbidden',
  },
  'FORGOT.API_UNKNOWN': {
    id: 'FORGOT.API_UNKNOWN',
    defaultMessage: 'Something went wrong. Check your connection and try again.',
    description: 'Custom forgot password — network error',
  },
  'FORGOT.TOAST_ERROR_TITLE': {
    id: 'FORGOT.TOAST_ERROR_TITLE',
    defaultMessage: 'Unable to send reset link',
    description: 'Custom forgot password — error toast title',
  },
});
