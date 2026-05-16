import React, { useCallback, useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  faArrowRight,
  faEye,
  faEyeSlash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button, Form, Hyperlink, Image, Spinner,
} from '@openedx/paragon';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';

import pageMessages from './CustomResetPasswordPage.messages';
import './CustomResetPasswordPage.scss';
import BackToLoginLink from '../custom-auth/components/BackToLoginLink/BackToLoginLink';
import RightInfoPanel from '../custom-login/components/RightInfoPanel/RightInfoPanel';
import '../custom-login/components/LoginForm/LoginForm.scss';
import '../custom-login/CustomLogin.scss';
import { showApiToast, useToast } from '../custom-toast';
import {
  LETTER_REGEX,
  LOGIN_PAGE,
  NUMBER_REGEX,
  RESET_PAGE,
} from '../data/constants';
import { getAllPossibleQueryParams, updatePathWithQueryParams } from '../data/utils';
import { resetPassword, validatePassword, validateToken } from '../reset-password/data/service';

const PASSWORD_RESET_SUCCESS_PARAM = 'password_reset_success';

const panelMessages = {
  'RESET.PANEL_HEADING': pageMessages['RESET.PANEL_HEADING'],
  'RESET.PANEL_BODY': pageMessages['RESET.PANEL_BODY'],
};

const CustomResetPasswordPage = () => {
  const { formatMessage } = useIntl();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [newPasswordHidden, setNewPasswordHidden] = useState(true);
  const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
  const [tokenState, setTokenState] = useState('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logoUrl = getConfig().LOGO_URL;

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
        titleId: pageMessages['RESET.TOAST_ERROR_TITLE'],
        descriptionId,
      },
    });
  }, [formatMessage, showToast]);

  useEffect(() => {
    let cancelled = false;

    const runValidation = async () => {
      if (!token) {
        navigate(updatePathWithQueryParams(RESET_PAGE));
        return;
      }

      try {
        const data = await validateToken(token);
        if (cancelled) {
          return;
        }
        if (data?.is_valid) {
          setTokenState('valid');
        } else {
          notifyError({ descriptionId: pageMessages['RESET.INVALID_TOKEN'] });
          navigate(updatePathWithQueryParams(RESET_PAGE));
        }
      } catch (err) {
        if (cancelled) {
          return;
        }
        if (err?.response?.status === 429) {
          notifyError({
            responseOrError: err,
            descriptionId: pageMessages['RESET.API_RATE_LIMIT'],
          });
        } else {
          notifyError({
            responseOrError: err,
            descriptionId: pageMessages['RESET.INVALID_TOKEN'],
          });
        }
        navigate(updatePathWithQueryParams(RESET_PAGE));
      }
    };

    runValidation();

    return () => {
      cancelled = true;
    };
  }, [navigate, notifyError, token]);

  const validateNewPasswordLocal = useCallback((value) => {
    if (!value || !LETTER_REGEX.test(value) || !NUMBER_REGEX.test(value) || value.length < 8) {
      return formatMessage(pageMessages['RESET.PASSWORD_VALIDATION']);
    }
    return '';
  }, [formatMessage]);

  const validateConfirmPasswordLocal = useCallback((value, passwordValue) => {
    if (!value) {
      return formatMessage(pageMessages['RESET.CONFIRM_REQUIRED']);
    }
    if (value !== passwordValue) {
      return formatMessage(pageMessages['RESET.PASSWORDS_MISMATCH']);
    }
    return '';
  }, [formatMessage]);

  const validateNewPasswordFromBackend = async (password) => {
    try {
      const errorMessage = await validatePassword({
        reset_password_page: true,
        password,
      });
      if (errorMessage) {
        setNewPasswordError(errorMessage);
      }
    } catch (err) {
      // Backend validation unavailable — keep local validation only
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const localNewError = validateNewPasswordLocal(newPassword);
    const localConfirmError = validateConfirmPasswordLocal(confirmPassword, newPassword);
    setNewPasswordError(localNewError);
    setConfirmPasswordError(localConfirmError);

    if (localNewError || localConfirmError) {
      notifyError({ descriptionId: pageMessages['RESET.API_FORM_ERROR'] });
      return;
    }

    setIsSubmitting(true);
    try {
      const params = getAllPossibleQueryParams();
      const data = await resetPassword(
        {
          new_password1: newPassword,
          new_password2: confirmPassword,
        },
        token,
        params,
      );

      if (data?.reset_status) {
        showApiToast(showToast, {
          formatMessage,
          fallbacks: {
            titleId: pageMessages['RESET.SUCCESS_TITLE'],
            descriptionId: pageMessages['RESET.SUCCESS_DESCRIPTION'],
          },
        });
        const loginPath = updatePathWithQueryParams(LOGIN_PAGE);
        const separator = loginPath.includes('?') ? '&' : '?';
        navigate(`${loginPath}${separator}${PASSWORD_RESET_SUCCESS_PARAM}=1`);
        return;
      }

      if (data?.token_invalid) {
        notifyError({ descriptionId: pageMessages['RESET.INVALID_TOKEN'] });
        navigate(updatePathWithQueryParams(RESET_PAGE));
        return;
      }

      const apiError = data?.err_msg || formatMessage(pageMessages['RESET.API_GENERIC']);
      setNewPasswordError(apiError);
      notifyError({ message: apiError, descriptionId: pageMessages['RESET.API_GENERIC'] });
    } catch (err) {
      if (err?.response?.status === 429) {
        notifyError({
          responseOrError: err,
          descriptionId: pageMessages['RESET.API_RATE_LIMIT'],
        });
      } else {
        notifyError({
          responseOrError: err,
          descriptionId: pageMessages['RESET.API_GENERIC'],
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenState === 'pending') {
    return (
      <div className="custom-login custom-reset-password">
        <div className="custom-login__form-column">
          <Spinner animation="border" variant="primary" className="custom-reset-password__spinner" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {formatMessage(pageMessages['RESET.PAGE_TITLE'], { siteName: getConfig().SITE_NAME })}
        </title>
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
      </Helmet>
      <div className="custom-login custom-reset-password">
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

                  <h1 className="login-form__title font-heading">
                    {formatMessage(pageMessages['RESET.HEADING'])}
                  </h1>
                  <p className="login-form__subtitle">
                    {formatMessage(pageMessages['RESET.SUBTITLE'])}
                  </p>

                  <Form
                    id="custom-reset-password-form"
                    className="login-form__form"
                    onSubmit={handleSubmit}
                  >
                    <Form.Group
                      controlId="custom-reset-new-password"
                      className="login-form__field"
                      isInvalid={newPasswordError !== ''}
                    >
                      <Form.Label className="login-form__label">
                        {formatMessage(pageMessages['RESET.NEW_PASSWORD_LABEL'])}
                      </Form.Label>
                      <div className="login-form__input-wrap">
                        <FontAwesomeIcon icon={faLock} className="login-form__input-icon" aria-hidden />
                        <Form.Control
                          className="login-form__control login-form__control--password"
                          name="newPassword"
                          type={newPasswordHidden ? 'password' : 'text'}
                          autoComplete="new-password"
                          placeholder={formatMessage(pageMessages['RESET.PASSWORD_PLACEHOLDER'])}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setNewPasswordError('');
                          }}
                          onBlur={() => {
                            const err = validateNewPasswordLocal(newPassword);
                            setNewPasswordError(err);
                            if (!err) {
                              validateNewPasswordFromBackend(newPassword);
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="login-form__toggle-password"
                          onClick={() => setNewPasswordHidden((v) => !v)}
                          aria-label={newPasswordHidden
                            ? formatMessage(pageMessages['RESET.SHOW_PASSWORD'])
                            : formatMessage(pageMessages['RESET.HIDE_PASSWORD'])}
                        >
                          <FontAwesomeIcon icon={newPasswordHidden ? faEye : faEyeSlash} />
                        </button>
                      </div>
                      {newPasswordError !== '' ? (
                        <Form.Control.Feedback type="invalid">{newPasswordError}</Form.Control.Feedback>
                      ) : null}
                    </Form.Group>

                    <Form.Group
                      controlId="custom-reset-confirm-password"
                      className="login-form__field"
                      isInvalid={confirmPasswordError !== ''}
                    >
                      <Form.Label className="login-form__label">
                        {formatMessage(pageMessages['RESET.CONFIRM_PASSWORD_LABEL'])}
                      </Form.Label>
                      <div className="login-form__input-wrap">
                        <FontAwesomeIcon icon={faLock} className="login-form__input-icon" aria-hidden />
                        <Form.Control
                          className="login-form__control login-form__control--password"
                          name="confirmPassword"
                          type={confirmPasswordHidden ? 'password' : 'text'}
                          autoComplete="new-password"
                          placeholder={formatMessage(pageMessages['RESET.PASSWORD_PLACEHOLDER'])}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setConfirmPasswordError('');
                          }}
                          onBlur={() => {
                            setConfirmPasswordError(
                              validateConfirmPasswordLocal(confirmPassword, newPassword),
                            );
                          }}
                        />
                        <button
                          type="button"
                          className="login-form__toggle-password"
                          onClick={() => setConfirmPasswordHidden((v) => !v)}
                          aria-label={confirmPasswordHidden
                            ? formatMessage(pageMessages['RESET.SHOW_PASSWORD'])
                            : formatMessage(pageMessages['RESET.HIDE_PASSWORD'])}
                        >
                          <FontAwesomeIcon icon={confirmPasswordHidden ? faEye : faEyeSlash} />
                        </button>
                      </div>
                      {confirmPasswordError !== '' ? (
                        <Form.Control.Feedback type="invalid">{confirmPasswordError}</Form.Control.Feedback>
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
                          screenReaderText={formatMessage(pageMessages['RESET.SUBMIT_PENDING'])}
                        />
                      ) : (
                        <>
                          {formatMessage(pageMessages['RESET.SUBMIT'])}
                          <FontAwesomeIcon icon={faArrowRight} className="login-form__submit-icon" />
                        </>
                      )}
                    </Button>
                  </Form>

                  <BackToLoginLink disabled={isSubmitting} />
                </div>
              </div>
            </div>
          </div>
          <RightInfoPanel
            messages={panelMessages}
            headingMessageId="RESET.PANEL_HEADING"
            bodyMessageId="RESET.PANEL_BODY"
          />
        </div>
      </div>
    </>
  );
};

export { PASSWORD_RESET_SUCCESS_PARAM };
export default CustomResetPasswordPage;
