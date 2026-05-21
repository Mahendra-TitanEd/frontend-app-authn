import React, { useCallback, useEffect, useState } from 'react';

import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import {
  RedirectLogistration,
  Zendesk,
} from '../common-components';
import CustomOTPPage from './components/CustomOTPPage/CustomOTPPage';
import LoginForm from './components/LoginForm/LoginForm';
import RightInfoPanel from './components/RightInfoPanel/RightInfoPanel';
import pageMessages from './CustomLoginPage.messages';
import { startCustomLoginAuth, verifyCustomLoginOtp } from './data/service';
import './CustomLogin.scss';
import {
  parseStartAuthResponse,
  parseVerifyAuthResponse,
  pickApiMessage,
} from './utils/parseCustomLoginResponse';
import resolvePostAuthRedirect from './utils/resolvePostAuthRedirect';
import { getThirdPartyAuthContext } from '../common-components/data/service';
import { showApiToast, useToast } from '../custom-toast';
import { getAllPossibleQueryParams, getTpaHint } from '../data/utils';

const CustomLoginPage = (props) => {
  const { formatMessage } = useIntl();
  const { showToast } = useToast();
  const { onLoginSuccess, loginSuccessHandler } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [emailApiError, setEmailApiError] = useState('');
  const [passwordApiError, setPasswordApiError] = useState('');
  const [otpApiError, setOtpApiError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loginPending, setLoginPending] = useState(false);
  const [otpPending, setOtpPending] = useState(false);
  const [resendPending, setResendPending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [pipelineFinishAuthUrl, setPipelineFinishAuthUrl] = useState(null);
  const [loginRedirect, setLoginRedirect] = useState({
    success: false,
    redirectUrl: '',
    finishAuthUrl: null,
  });

  const toastFallbacks = useCallback((descriptionId, titleKey = 'LOGIN.TOAST_INFO_TITLE') => ({
    titleId: pageMessages[titleKey],
    descriptionId,
  }), []);

  const notifyApi = useCallback(({
    responseOrError = null,
    message = null,
    descriptionId = null,
    titleKey = 'LOGIN.TOAST_INFO_TITLE',
  }) => {
    showApiToast(showToast, {
      responseOrError,
      message,
      formatMessage,
      fallbacks: toastFallbacks(descriptionId, titleKey),
    });
  }, [formatMessage, showToast, toastFallbacks]);

  const clearFieldApiErrors = useCallback(() => {
    setEmailApiError('');
    setPasswordApiError('');
    setOtpApiError('');
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setResendCountdown((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const payload = { ...getAllPossibleQueryParams() };
    const tpaHint = getTpaHint();
    if (tpaHint) {
      payload.tpa_hint = tpaHint;
    }

    getThirdPartyAuthContext(payload)
      .then(({ thirdPartyAuthContext }) => {
        const ctx = camelCaseObject(thirdPartyAuthContext || {});
        setPipelineFinishAuthUrl(ctx.finishAuthUrl || null);
      })
      .catch(() => {
        setPipelineFinishAuthUrl(null);
      });
  }, []);

  const beginResendCooldown = useCallback(() => setResendCountdown(30), []);

  const getApiErrorMessage = useCallback((err, fallbackMessageId) => {
    const apiMessageFromError = pickApiMessage(err?.response?.data, err?.response?.status);
    if (apiMessageFromError) {
      return apiMessageFromError;
    }
    return formatMessage(pageMessages[fallbackMessageId]);
  }, [formatMessage]);

  const handleEmailChange = useCallback((value) => {
    setEmail(value);
    setEmailApiError('');
  }, []);

  const handlePasswordChange = useCallback((value) => {
    setPassword(value);
    setPasswordApiError('');
  }, []);

  const setFieldErrorFromApi = useCallback((errorCode, message, context) => {
    if (!message) {
      return false;
    }

    if (context === 'otp' || errorCode === 'invalid-otp') {
      setOtpApiError(message);
      return true;
    }

    if (errorCode === 'incorrect-email-or-password') {
      setPasswordApiError(message);
      return true;
    }

    return false;
  }, []);

  const startOtpChallenge = useCallback(async ({ loadingSetter, resetOtpOnFailure }) => {
    loadingSetter(true);
    clearFieldApiErrors();
    try {
      const { status, data } = await startCustomLoginAuth({
        identifier: email.trim(),
        password,
      });
      const {
        body: responseData,
        challengeId: nextChallengeId,
        shouldShowOtp,
        apiFailureMessage,
        errorCode,
      } = parseStartAuthResponse({ status, data });

      if (!shouldShowOtp) {
        const messageUsedInField = setFieldErrorFromApi(
          errorCode,
          apiFailureMessage,
          'credentials',
        );
        if (!messageUsedInField) {
          notifyApi({
            responseOrError: responseData,
            message: apiFailureMessage,
            descriptionId: pageMessages['LOGIN.SIGN_IN_FAILED'],
            titleKey: 'LOGIN.TOAST_ERROR_TITLE',
          });
        }
        if (resetOtpOnFailure) {
          setShowOtp(false);
          setChallengeId('');
          setResendCountdown(0);
        }
        return;
      }

      setChallengeId(nextChallengeId);
      setShowOtp(true);
      setOtp('');
      beginResendCooldown();
      notifyApi({
        responseOrError: responseData,
        descriptionId: pageMessages['LOGIN.OTP_SENT_FALLBACK'],
        titleKey: 'LOGIN.TOAST_INFO_TITLE',
      });
    } catch (err) {
      console.error('API error:', err);
      const fallbackMessageId = err?.response ? 'LOGIN.API_GENERIC' : 'LOGIN.API_UNKNOWN';
      const errorMessage = getApiErrorMessage(err, fallbackMessageId);
      const errorCode = err?.response?.data?.error_code;
      const messageUsedInField = setFieldErrorFromApi(errorCode, errorMessage, 'credentials');
      if (!messageUsedInField) {
        notifyApi({
          responseOrError: err,
          message: errorMessage,
          descriptionId: pageMessages[fallbackMessageId],
          titleKey: 'LOGIN.TOAST_ERROR_TITLE',
        });
      }
      if (resetOtpOnFailure) {
        setShowOtp(false);
        setChallengeId('');
        setResendCountdown(0);
      }
    } finally {
      loadingSetter(false);
    }
  }, [
    beginResendCooldown,
    clearFieldApiErrors,
    email,
    getApiErrorMessage,
    notifyApi,
    password,
    setFieldErrorFromApi,
  ]);

  const handleCredentialSubmit = useCallback(async () => {
    clearFieldApiErrors();
    await startOtpChallenge({ loadingSetter: setLoginPending, resetOtpOnFailure: true });
  }, [clearFieldApiErrors, startOtpChallenge]);

  const handleOtpVerified = useCallback(async (otpValue) => {
    setOtpPending(true);
    setOtpApiError('');
    try {
      const { status, data } = await verifyCustomLoginOtp({
        challengeId,
        otp: otpValue,
      });
      const {
        body: responseData,
        isSuccess,
        apiFailureMessage: verifyFailureMessage,
        errorCode,
        finishAuthUrl: apiFinishAuthUrl,
      } = parseVerifyAuthResponse({ status, data });

      if (isSuccess) {
        notifyApi({
          responseOrError: responseData,
          descriptionId: pageMessages['LOGIN.OTP_VERIFIED_FALLBACK'],
          titleKey: 'LOGIN.TOAST_SUCCESS_TITLE',
        });

        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(responseData);
        }
        if (typeof loginSuccessHandler === 'function') {
          loginSuccessHandler(responseData);
        }

        const redirectTarget = resolvePostAuthRedirect({
          responseBody: responseData,
          finishAuthUrl: apiFinishAuthUrl || pipelineFinishAuthUrl,
        });

        setLoginRedirect(redirectTarget);
        return;
      }

      setFieldErrorFromApi(errorCode, verifyFailureMessage, 'otp');
      notifyApi({
        responseOrError: responseData,
        message: verifyFailureMessage,
        descriptionId: pageMessages['LOGIN.OTP_VERIFY_FAILED'],
        titleKey: 'LOGIN.TOAST_ERROR_TITLE',
      });
    } catch (err) {
      console.error('API error:', err);
      const fallbackMessageId = err?.response ? 'LOGIN.OTP_VERIFY_FAILED' : 'LOGIN.API_UNKNOWN';
      const errorMessage = getApiErrorMessage(err, fallbackMessageId);
      const errorCode = err?.response?.data?.error_code;
      setFieldErrorFromApi(errorCode, errorMessage, 'otp');
      notifyApi({
        responseOrError: err,
        message: errorMessage,
        descriptionId: pageMessages[fallbackMessageId],
        titleKey: 'LOGIN.TOAST_ERROR_TITLE',
      });
    } finally {
      setOtpPending(false);
    }
  }, [
    challengeId,
    getApiErrorMessage,
    loginSuccessHandler,
    notifyApi,
    onLoginSuccess,
    pipelineFinishAuthUrl,
    setFieldErrorFromApi,
  ]);

  const handleResendOtp = useCallback(async () => {
    setOtpApiError('');
    await startOtpChallenge({ loadingSetter: setResendPending, resetOtpOnFailure: false });
  }, [startOtpChallenge]);

  const handleBackToLogin = useCallback(() => {
    setShowOtp(false);
    setChallengeId('');
    setOtp('');
    setResendCountdown(0);
    clearFieldApiErrors();
  }, [clearFieldApiErrors]);

  const institutionLogin = props.institutionLogin ?? props.isInstitutionLogin;

  if (institutionLogin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>
          {formatMessage(pageMessages['LOGIN.PAGE_TITLE'], { siteName: getConfig().SITE_NAME })}
        </title>
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
      </Helmet>
      {getConfig().ZENDESK_KEY ? <Zendesk /> : null}
      <RedirectLogistration
        success={loginRedirect.success}
        redirectUrl={loginRedirect.redirectUrl}
        finishAuthUrl={loginRedirect.finishAuthUrl}
      />
      <div className="custom-login">
        <div className="custom-login__grid">
          <div className="custom-login__form-column">
            <div className="custom-login__form-inner">
              {showOtp ? (
                <CustomOTPPage
                  email={email.trim()}
                  value={otp}
                  onChange={setOtp}
                  onVerify={handleOtpVerified}
                  onBack={handleBackToLogin}
                  onResend={handleResendOtp}
                  fieldError={otpApiError}
                  isSubmitting={otpPending}
                  isResending={resendPending}
                  resendCountdown={resendCountdown}
                />
              ) : (
                <LoginForm
                  email={email}
                  password={password}
                  onEmailChange={handleEmailChange}
                  onPasswordChange={handlePasswordChange}
                  onSubmit={handleCredentialSubmit}
                  isSubmitting={loginPending}
                  emailApiError={emailApiError}
                  passwordApiError={passwordApiError}
                />
              )}
            </div>
          </div>
          <RightInfoPanel />
        </div>
      </div>
    </>
  );
};

CustomLoginPage.propTypes = {
  institutionLogin: PropTypes.bool,
  isInstitutionLogin: PropTypes.bool,
  onLoginSuccess: PropTypes.func,
  loginSuccessHandler: PropTypes.func,
};

CustomLoginPage.defaultProps = {
  institutionLogin: false,
  isInstitutionLogin: false,
  onLoginSuccess: null,
  loginSuccessHandler: null,
};

export default CustomLoginPage;
