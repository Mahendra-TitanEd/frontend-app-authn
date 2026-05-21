import React, { useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button, Form, Hyperlink, Image, Spinner,
} from '@openedx/paragon';
import PropTypes from 'prop-types';

import messages from './CustomOTPPage.messages';
import OTPInput, { OTP_LENGTH } from '../OTPInput/OTPInput';
import './CustomOTPPage.scss';

export const validateOtpValue = (value, formatMessage) => {
  if (!value || !String(value).trim()) {
    return formatMessage(messages['LOGIN.OTP_REQUIRED']);
  }
  if (value.length !== OTP_LENGTH) {
    return formatMessage(messages['LOGIN.OTP_REQUIRED']);
  }
  return '';
};

const CustomOTPPage = ({
  email,
  value,
  onChange,
  onVerify,
  onBack,
  onResend,
  isSubmitting,
  isResending,
  resendCountdown,
  fieldError,
}) => {
  const { formatMessage } = useIntl();
  const [localError, setLocalError] = useState('');
  const logoUrl = getConfig().LOGO_URL;
  const displayError = fieldError || localError;
  const isBusy = isSubmitting || isResending;

  useEffect(() => {
    setLocalError(fieldError || '');
  }, [fieldError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const err = validateOtpValue(value, formatMessage);
    setLocalError(err);
    if (err) {
      return;
    }
    await onVerify(value.trim());
  };

  const handleOtpChange = (nextValue) => {
    onChange(nextValue);
    if (localError) {
      setLocalError('');
    }
  };

  return (
    <div className="custom-otp-page">
      <div className="custom-otp-page__inner">
        {logoUrl ? (
          <Hyperlink destination="/" className="custom-otp-page__logo-link">
            <Image
              className="custom-otp-page__logo"
              src={logoUrl}
              alt={getConfig().SITE_NAME || 'SEARN'}
            />
          </Hyperlink>
        ) : null}

        <h1 className="custom-otp-page__title font-heading">
          {formatMessage(messages['LOGIN.OTP_PAGE_TITLE'])}
        </h1>
        <p className="custom-otp-page__subtitle">
          {formatMessage(messages['LOGIN.OTP_PAGE_SUBTITLE_INTRO'])}{' '}
          <span className="custom-otp-page__email">{email}</span>
        </p>

        <Form id="custom-login-otp-form" className="custom-otp-page__form" onSubmit={handleSubmit}>
          <div className="custom-otp-page__otp-wrap">
            <OTPInput
              id="custom-login-otp-input"
              value={value}
              onChange={handleOtpChange}
              disabled={isBusy}
              hasError={!!displayError}
            />
            {displayError ? (
              <p className="custom-otp-page__field-error" role="alert">
                {displayError}
              </p>
            ) : null}
          </div>

          <Button
            className="custom-otp-page__submit font-heading gradient-accent"
            type="submit"
            disabled={isBusy || value.length !== OTP_LENGTH}
          >
            {isSubmitting ? (
              <Spinner
                animation="border"
                size="sm"
                screenReaderText={formatMessage(messages['LOGIN.OTP_SUBMIT_PENDING'])}
              />
            ) : (
              <>
                {formatMessage(messages['LOGIN.OTP_SUBMIT'])}
                <FontAwesomeIcon icon={faArrowRight} className="custom-otp-page__submit-icon" />
              </>
            )}
          </Button>

          <div className="custom-otp-page__actions">
            <button
              type="button"
              className="custom-otp-page__back"
              onClick={onBack}
              disabled={isBusy}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="custom-otp-page__back-icon" />
              {formatMessage(messages['LOGIN.OTP_BACK'])}
            </button>
            <button
              type="button"
              className="custom-otp-page__resend"
              onClick={onResend}
              disabled={isBusy || resendCountdown > 0}
            >
              {isResending ? (
                <Spinner
                  animation="border"
                  size="sm"
                  screenReaderText={formatMessage(messages['LOGIN.OTP_RESEND_PENDING'])}
                />
              ) : (
                formatMessage(messages['LOGIN.OTP_RESEND'])
              )}
            </button>
          </div>
          {resendCountdown > 0 ? (
            <p className="custom-otp-page__countdown">
              {formatMessage(messages['LOGIN.OTP_RESEND_IN'], { seconds: resendCountdown })}
            </p>
          ) : null}
        </Form>
      </div>
    </div>
  );
};

CustomOTPPage.propTypes = {
  email: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onVerify: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onResend: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isResending: PropTypes.bool.isRequired,
  resendCountdown: PropTypes.number.isRequired,
  fieldError: PropTypes.string,
};

CustomOTPPage.defaultProps = {
  fieldError: '',
};

export default CustomOTPPage;
