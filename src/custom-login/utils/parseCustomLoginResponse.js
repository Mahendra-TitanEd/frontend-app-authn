import { camelCaseObject } from '@edx/frontend-platform';

export const HTTP_OK = 200;

const toPlainObject = (value) => {
  if (!value || typeof value !== 'object') {
    return {};
  }
  return camelCaseObject(value);
};

const normalizeBody = (raw) => {
  const top = toPlainObject(raw);
  const nested = top.data && typeof top.data === 'object' ? toPlainObject(top.data) : null;
  return nested ? { ...top, ...nested } : top;
};

export const isHttpOk = (status) => status === HTTP_OK;

/**
 * LMS convention: 200 responses use `message`; other statuses use `detail`.
 */
export const pickApiMessage = (rawBody, status) => {
  const body = toPlainObject(rawBody);
  if (isHttpOk(status)) {
    const msg = body.message;
    return typeof msg === 'string' && msg.trim() ? msg.trim() : null;
  }
  const detail = body.detail || body.message || body.errorMessage;
  return typeof detail === 'string' && detail.trim() ? detail.trim() : null;
};

const pickChallengeId = (body) => {
  const id = body?.challengeId ?? body?.challenge_id;
  if (id !== undefined && id !== null && String(id).trim()) {
    return String(id).trim();
  }
  return '';
};

/**
 * @param {{ status: number, data: object }} payload
 */
export const parseStartAuthResponse = ({ status, data }) => {
  const body = normalizeBody(data);
  const challengeId = pickChallengeId(body);
  const shouldShowOtp = isHttpOk(status) && !!challengeId;

  return {
    status,
    body,
    challengeId,
    shouldShowOtp,
    apiFailureMessage: shouldShowOtp ? null : pickApiMessage(body, status),
    errorCode: body.errorCode || body.error_code || null,
  };
};

/**
 * @param {{ status: number, data: object }} payload
 */
export const parseVerifyAuthResponse = ({ status, data }) => {
  const body = normalizeBody(data);
  const isSuccess = isHttpOk(status);

  return {
    status,
    body,
    isSuccess,
    apiFailureMessage: isSuccess ? null : pickApiMessage(body, status),
    errorCode: body.errorCode || body.error_code || null,
    redirectUrl: body.redirectUrl || body.redirect_url || '',
    finishAuthUrl: body.finishAuthUrl || body.finish_auth_url || null,
  };
};
