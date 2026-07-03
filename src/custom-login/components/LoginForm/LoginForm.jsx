import React, { useCallback, useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  faArrowRight,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button, Form, Hyperlink, Image, Spinner,
} from '@openedx/paragon';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import messages from './LoginForm.messages';
import PilotTermsCheckbox from '../PilotTermsCheckbox/PilotTermsCheckbox';
import pilotTermsMessages from '../PilotTermsCheckbox/PilotTermsCheckbox.messages';
import { useToast } from '../../../custom-toast';
import { RESET_PAGE } from '../../../data/constants';
import { updatePathWithQueryParams } from '../../../data/utils';
import { emailRegex } from '../../../register/RegistrationFields/EmailField/validator';
import './LoginForm.scss';

export const validateLoginFormEmail = (value, formatMessage) => {
  const trimmedValue = value?.trim() || '';

  if (!trimmedValue) {
    return formatMessage(messages['LOGIN.EMAIL_REQUIRED']);
  }
  if (!emailRegex.test(trimmedValue)) {
    return formatMessage(messages['LOGIN.EMAIL_INVALID']);
  }
  return '';
};

export const validateLoginFormPassword = (value, formatMessage) => {
  if (!value || !String(value).trim()) {
    return formatMessage(messages['LOGIN.PASSWORD_REQUIRED']);
  }
  return '';
};

const LoginForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isSubmitting,
  emailApiError,
  passwordApiError,
}) => {
  const { formatMessage } = useIntl();
  const { showToast } = useToast();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pilotTermsAccepted, setPilotTermsAccepted] = useState(false);
  const [pilotTermsError, setPilotTermsError] = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true);

  useEffect(() => {
    setEmailError(emailApiError || '');
  }, [emailApiError]);

  useEffect(() => {
    setPasswordError(passwordApiError || '');
  }, [passwordApiError]);

  const runEmailValidation = useCallback(() => {
    if (emailApiError) {
      setEmailError(emailApiError);
      return;
    }
    setEmailError(validateLoginFormEmail(email, formatMessage));
  }, [email, emailApiError, formatMessage]);

  const runPasswordValidation = useCallback(() => {
    if (passwordApiError) {
      setPasswordError(passwordApiError);
      return;
    }
    setPasswordError(validateLoginFormPassword(password, formatMessage));
  }, [password, passwordApiError, formatMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const eErr = emailApiError || validateLoginFormEmail(email, formatMessage);
    const pErr = passwordApiError || validateLoginFormPassword(password, formatMessage);
    const termsErr = pilotTermsAccepted
      ? ''
      : formatMessage(pilotTermsMessages.requiredError);
    setEmailError(eErr);
    setPasswordError(pErr);
    setPilotTermsError(termsErr);
    if (eErr || pErr || termsErr) {
      return;
    }
    await onSubmit();
  };

  const handleWhoSsoClick = () => {
    showToast({
      title: formatMessage(messages['LOGIN.WHO_SSO']),
      description: formatMessage(messages['LOGIN.WHO_SSO_COMING_SOON']),
    });
  };

  const logoUrl = getConfig().LOGO_URL;
  const forgotPasswordUrl = updatePathWithQueryParams(RESET_PAGE);

  return (
    <div className="login-form">
      <div className="login-form__inner">
        {logoUrl ? (
          <Hyperlink destination="/" className="login-form__logo-link">
            <Image
              className="login-form__logo"
              src={logoUrl}
              alt={getConfig().SITE_NAME || 'SEARN'}
            />
          </Hyperlink>
        ) : null}

        <h1 className="login-form__title font-heading">
          {formatMessage(messages['LOGIN.WELCOME_BACK'])}
        </h1>
        <p className="login-form__subtitle">
          {formatMessage(messages['LOGIN.SUBTITLE'])}
        </p>

        <Form id="custom-login-form" className="login-form__form" onSubmit={handleSubmit}>
          <Form.Group
            controlId="custom-login-email"
            className="login-form__field"
            isInvalid={emailError !== ''}
          >
            <Form.Label className="login-form__label">
              {formatMessage(messages['LOGIN.EMAIL_LABEL'])}
            </Form.Label>
            <div className="login-form__input-wrap">
              <FontAwesomeIcon icon={faEnvelope} className="login-form__input-icon" aria-hidden />
              <Form.Control
                className="login-form__control"
                name="email"
                type="email"
                autoComplete="email"
                spellCheck="false"
                placeholder={formatMessage(messages['LOGIN.EMAIL_PLACEHOLDER'])}
                value={email}
                onChange={(e) => {
                  onEmailChange(e.target.value);
                  setEmailError('');
                }}
                onBlur={runEmailValidation}
              />
            </div>
            {emailError !== '' ? (
              <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
            ) : null}
          </Form.Group>

          <Form.Group
            controlId="custom-login-password"
            className="login-form__field"
            isInvalid={passwordError !== ''}
          >
            <div className="login-form__label-row">
              <Form.Label className="login-form__label">
                {formatMessage(messages['LOGIN.PASSWORD_LABEL'])}
              </Form.Label>
              <Link
                className="login-form__forgot-link"
                to={forgotPasswordUrl}
              >
                {formatMessage(messages['LOGIN.FORGOT_PASSWORD'])}
              </Link>
            </div>
            <div className="login-form__input-wrap">
              <FontAwesomeIcon icon={faLock} className="login-form__input-icon" aria-hidden />
              <Form.Control
                className="login-form__control login-form__control--password"
                controlClassName="login-form__input"
                name="password"
                type={passwordHidden ? 'password' : 'text'}
                autoComplete="current-password"
                placeholder={formatMessage(messages['LOGIN.PASSWORD_PLACEHOLDER'])}
                value={password}
                onChange={(e) => {
                  onPasswordChange(e.target.value);
                  setPasswordError('');
                }}
                onBlur={runPasswordValidation}
              />
              <button
                type="button"
                className="login-form__toggle-password"
                onClick={() => setPasswordHidden((v) => !v)}
                aria-label={passwordHidden
                  ? formatMessage(messages['LOGIN.SHOW_PASSWORD'])
                  : formatMessage(messages['LOGIN.HIDE_PASSWORD'])}
              >
                <FontAwesomeIcon icon={passwordHidden ? faEye : faEyeSlash} />
              </button>
            </div>
            {passwordError !== '' ? (
              <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
            ) : null}
          </Form.Group>

          <PilotTermsCheckbox
            checked={pilotTermsAccepted}
            onChange={(value) => {
              setPilotTermsAccepted(value);
              setPilotTermsError('');
            }}
            error={pilotTermsError}
          />

          <Button
            className="login-form__submit font-heading gradient-accent"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner
                animation="border"
                size="sm"
                screenReaderText={formatMessage(messages['LOGIN.SUBMIT_PENDING'])}
              />
            ) : (
              <>
                {formatMessage(messages['LOGIN.SUBMIT'])}
                <FontAwesomeIcon icon={faArrowRight} className="login-form__submit-icon" />
              </>
            )}
          </Button>
        </Form>

        <div className="login-form__divider" aria-hidden="true">
          <span className="login-form__divider-line" />
          <span className="login-form__divider-text">
            {formatMessage(messages['LOGIN.DIVIDER_OR'])}
          </span>
          <span className="login-form__divider-line" />
        </div>

        <Button
          className="login-form__sso font-heading"
          variant="outline-primary"
          type="button"
          onClick={handleWhoSsoClick}
        >
          <FontAwesomeIcon icon={faShieldHalved} className="login-form__sso-icon" />
          {formatMessage(messages['LOGIN.WHO_SSO'])}
        </Button>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  emailApiError: PropTypes.string,
  passwordApiError: PropTypes.string,
};

LoginForm.defaultProps = {
  emailApiError: '',
  passwordApiError: '',
};

export default LoginForm;
