import React, { useEffect } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import {
  Navigate, Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';

import { UnAuthOnlyRoute, Zendesk } from './common-components';
import CustomForgotPasswordPage from './custom-forgot-password/CustomForgotPasswordPage';
import CustomLoginPage from './custom-login/CustomLoginPage';
import pageMessages from './custom-login/CustomLoginPage.messages';
import CustomResetPasswordPage, { PASSWORD_RESET_SUCCESS_PARAM } from './custom-reset-password/CustomResetPasswordPage';
import { showApiToast, ToastProvider, useToast } from './custom-toast';
import {
  LOGIN_PAGE,
  PASSWORD_RESET_CONFIRM,
  REGISTER_PAGE,
  RESET_PAGE,
} from './data/constants';
import { updatePathWithQueryParams } from './data/utils';

import './customstyle/custom-mainstyle.scss';

const CustomLoginRoute = () => {
  const { formatMessage } = useIntl();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get(PASSWORD_RESET_SUCCESS_PARAM) !== '1') {
      return;
    }

    showApiToast(showToast, {
      formatMessage,
      fallbacks: {
        titleId: pageMessages['LOGIN.PASSWORD_RESET_SUCCESS_TITLE'],
        descriptionId: pageMessages['LOGIN.PASSWORD_RESET_SUCCESS_DESCRIPTION'],
      },
    });

    params.delete(PASSWORD_RESET_SUCCESS_PARAM);
    const nextSearch = params.toString();
    navigate(
      { pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' },
      { replace: true },
    );
  }, [formatMessage, location.pathname, location.search, navigate, showToast]);

  return (
    <UnAuthOnlyRoute>
      <CustomLoginPage />
    </UnAuthOnlyRoute>
  );
};

/**
 * Replaces MainApp PluginSlot content when authn_main_app_plugin_slot is active.
 * Owns all custom auth routes, toast provider, and styles.
 */
const CustomMainApp = () => (
  <ToastProvider>
    <Helmet>
      <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
    </Helmet>
    {getConfig().ZENDESK_KEY ? <Zendesk /> : null}
    <Routes>
      <Route path={LOGIN_PAGE} element={<CustomLoginRoute />} />
      <Route
        path={RESET_PAGE}
        element={(
          <UnAuthOnlyRoute>
            <CustomForgotPasswordPage />
          </UnAuthOnlyRoute>
        )}
      />
      <Route path={PASSWORD_RESET_CONFIRM} element={<CustomResetPasswordPage />} />
      <Route
        path={REGISTER_PAGE}
        element={<Navigate replace to={updatePathWithQueryParams(LOGIN_PAGE)} />}
      />
      <Route path="/" element={<Navigate replace to={updatePathWithQueryParams(LOGIN_PAGE)} />} />
      <Route path="*" element={<Navigate replace to={updatePathWithQueryParams(LOGIN_PAGE)} />} />
    </Routes>
  </ToastProvider>
);

export default CustomMainApp;
