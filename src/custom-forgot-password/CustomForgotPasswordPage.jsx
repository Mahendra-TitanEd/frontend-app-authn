import React, { useCallback, useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { sendPageEvent, sendTrackEvent } from '@edx/frontend-platform/analytics';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  faArrowRight,
  faCircleCheck,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button, Form, Hyperlink, Image, Spinner,
} from '@openedx/paragon';
import { Helmet } from 'react-helmet';

import pageMessages from './CustomForgotPasswordPage.messages';
import './CustomForgotPasswordPage.scss';
import BackToLoginLink from '../custom-auth/components/BackToLoginLink/BackToLoginLink';
import { validateLoginFormEmail } from '../custom-login/components/LoginForm/LoginForm';
import RightInfoPanel from '../custom-login/components/RightInfoPanel/RightInfoPanel';
import '../custom-login/components/LoginForm/LoginForm.scss';
import '../custom-login/CustomLogin.scss';
import { showApiToast, useToast } from '../custom-toast';
import { forgotPassword } from '../forgot-password/data/service';

const panelMessages = {
  'FORGOT.PANEL_HEADING': pageMessages['FORGOT.PANEL_HEADING'],
  'FORGOT.PANEL_BODY': pageMessages['FORGOT.PANEL_BODY'],
};

const CustomForgotPasswordPage = () => {
  const { formatMessage } = useIntl();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logoUrl = getConfig().LOGO_URL;

  useEffect(() => {
    sendPageEvent('login_and_registration', 'reset');
    sendTrackEvent('edx.bi.password_reset_form.viewed', { category: 'user-engagement' });
  }, []);

  const notifyError = useCallback(({
    responseOrError = null,
    message = null,
    descriptionId,
  }) => {
    showApiToast(showToast, {
      responseOrError,
      message,
      formatMessage,
      fallbacks: {
        titleId: pageMessages['FORGOT.TOAST_ERROR_TITLE'],
        descriptionId,
      },
    });
  }, [formatMessage, showToast]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateLoginFormEmail(email, formatMessage);
    setEmailError(validationError);
    if (validationError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSubmittedEmail(email.trim());
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      if (err?.response?.status === 403) {
        notifyError({
          responseOrError: err,
          descriptionId: pageMessages['FORGOT.API_FORBIDDEN'],
        });
      } else {
        notifyError({
          responseOrError: err,
          descriptionId: pageMessages['FORGOT.API_GENERIC'],
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setSubmittedEmail('');
    setEmailError('');
  };

  return (
    <>
      <Helmet>
        <title>
          {formatMessage(pageMessages['FORGOT.PAGE_TITLE'], { siteName: getConfig().SITE_NAME })}
        </title>
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
      </Helmet>
      <div className="custom-login custom-forgot-password">
        <div className="custom-login__grid">
          <div className="custom-login__form-column">
            <div className="custom-login__form-inner">
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

                  {!isSubmitted ? (
                    <>
                      <h1 className="login-form__title font-heading">
                        {formatMessage(pageMessages['FORGOT.HEADING'])}
                      </h1>
                      <p className="login-form__subtitle">
                        {formatMessage(pageMessages['FORGOT.SUBTITLE'])}
                      </p>

                      <Form
                        id="custom-forgot-password-form"
                        className="login-form__form"
                        onSubmit={handleSubmit}
                      >
                        <Form.Group
                          controlId="custom-forgot-email"
                          className="login-form__field"
                          isInvalid={emailError !== ''}
                        >
                          <Form.Label className="login-form__label">
                            {formatMessage(pageMessages['FORGOT.EMAIL_LABEL'])}
                          </Form.Label>
                          <div className="login-form__input-wrap">
                            <FontAwesomeIcon
                              icon={faEnvelope}
                              className="login-form__input-icon"
                              aria-hidden
                            />
                            <Form.Control
                              className="login-form__control"
                              name="email"
                              type="email"
                              autoComplete="email"
                              spellCheck="false"
                              placeholder={formatMessage(pageMessages['FORGOT.EMAIL_PLACEHOLDER'])}
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                              }}
                              onBlur={() => {
                                setEmailError(validateLoginFormEmail(email, formatMessage));
                              }}
                            />
                          </div>
                          {emailError !== '' ? (
                            <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                          ) : null}
                        </Form.Group>

                        <Button
                          className="login-form__submit font-heading gradient-accent"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Spinner
                              animation="border"
                              size="sm"
                              screenReaderText={formatMessage(pageMessages['FORGOT.SUBMIT_PENDING'])}
                            />
                          ) : (
                            <>
                              {formatMessage(pageMessages['FORGOT.SUBMIT'])}
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="login-form__submit-icon"
                              />
                            </>
                          )}
                        </Button>
                      </Form>
                    </>
                  ) : (
                    <div className="custom-forgot-password__success">
                      <div className="custom-forgot-password__success-icon-wrap">
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="custom-forgot-password__success-icon"
                        />
                      </div>
                      <h1 className="login-form__title font-heading">
                        {formatMessage(pageMessages['FORGOT.SUCCESS_HEADING'])}
                      </h1>
                      <p className="login-form__subtitle">
                        {formatMessage(pageMessages['FORGOT.SUCCESS_BODY_PREFIX'])}{' '}
                        <strong className="custom-forgot-password__success-email">
                          {submittedEmail}
                        </strong>
                        {formatMessage(pageMessages['FORGOT.SUCCESS_BODY_SUFFIX'])}
                      </p>
                      <p className="custom-forgot-password__success-hint">
                        {formatMessage(pageMessages['FORGOT.SUCCESS_HINT'])}{' '}
                        <button
                          type="button"
                          className="custom-forgot-password__try-again"
                          onClick={handleTryAgain}
                        >
                          {formatMessage(pageMessages['FORGOT.TRY_AGAIN'])}
                        </button>
                      </p>
                    </div>
                  )}

                  <BackToLoginLink disabled={isSubmitting} />
                </div>
              </div>
            </div>
          </div>
          <RightInfoPanel
            messages={panelMessages}
            headingMessageId="FORGOT.PANEL_HEADING"
            bodyMessageId="FORGOT.PANEL_BODY"
          />
        </div>
      </div>
    </>
  );
};

export default CustomForgotPasswordPage;
