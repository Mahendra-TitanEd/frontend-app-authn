import { camelCaseObject } from '@edx/frontend-platform';

/**
 * Prefer human-readable strings from the LMS error payload; otherwise return null so callers use i18n fallback.
 *
 * @param {unknown} error — typically an Axios error
 * @returns {string|null}
 */
export default function getLoginApiErrorMessage(error) {
  const data = error?.response?.data;
  if (!data) {
    return null;
  }

  const d = camelCaseObject(data);

  const candidates = [
    d.message,
    d.detail,
    d.loginError,
    d.errorMessage,
    d.error,
    Array.isArray(d.nonFieldErrors) ? d.nonFieldErrors[0] : null,
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const v = candidates[i];
    if (typeof v === 'string' && v.trim()) {
      return v.trim();
    }
  }

  return null;
}
