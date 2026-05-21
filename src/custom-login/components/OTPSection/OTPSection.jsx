import React, { useEffect, useState } from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Form, Spinner } from '@openedx/paragon';
import PropTypes from 'prop-types';

import messages from './OTPSection.messages';
import './OTPSection.scss';

export const validateOtpValue = (value, formatMessage) => {
  if (!value || !String(value).trim()) {
    return formatMessage(messages['LOGIN.OTP_REQUIRED']);
  }
  return '';
};

const OTPSection = ({
  value,
  onChange,
  onVerified,
  onResend,
  isSubmitting,
  isResending,
  resendCountdown,
  apiError,
}) => {
  const { formatMessage } = useIntl();
  const [error, setError] = useState('');

  useEffect(() => {
    setError(apiError || '');
  }, [apiError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const err = validateOtpValue(value, formatMessage);
    setError(err);
    if (err) {
      return;
    }
    await onVerified(value.trim());
  };

  return (
    <div className="otp-section">
      <Form id="custom-login-otp-form" onSubmit={handleSubmit}>
        <Form.Group controlId="custom-login-otp" isInvalid={error !== ''}>
          <Form.Control
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setError('');
            }}
            onBlur={() => setError(validateOtpValue(value, formatMessage))}
            floatingLabel={formatMessage(messages['LOGIN.OTP_LABEL'])}
          />
          {error !== '' ? (
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          ) : null}
        </Form.Group>
        <Button
          className="otp-section__submit text-white"
          variant="primary"
          type="submit"
          disabled={isSubmitting || isResending}
        >
          {isSubmitting ? (
            <Spinner animation="border" size="sm" screenReaderText={formatMessage(messages['LOGIN.OTP_PENDING'])} />
          ) : (
            formatMessage(messages['LOGIN.OTP_SUBMIT'])
          )}
        </Button>
        <Button
          className="otp-section__resend"
          variant="link"
          type="button"
          onClick={onResend}
          disabled={isSubmitting || isResending || resendCountdown > 0}
        >
          {isResending ? (
            <Spinner animation="border" size="sm" screenReaderText={formatMessage(messages['LOGIN.OTP_RESEND_PENDING'])} />
          ) : (
            formatMessage(messages['LOGIN.OTP_RESEND'])
          )}
        </Button>
        {resendCountdown > 0 ? (
          <p className="otp-section__countdown">
            {formatMessage(messages['LOGIN.OTP_RESEND_IN'], { seconds: resendCountdown })}
          </p>
        ) : null}
      </Form>
    </div>
  );
};

OTPSection.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onVerified: PropTypes.func.isRequired,
  onResend: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isResending: PropTypes.bool.isRequired,
  resendCountdown: PropTypes.number.isRequired,
  apiError: PropTypes.string,
};

OTPSection.defaultProps = {
  apiError: '',
};

export default OTPSection;
