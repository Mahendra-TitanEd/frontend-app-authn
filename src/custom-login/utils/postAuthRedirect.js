import { getConfig } from '@edx/frontend-platform';

/**
 * Standard LMS redirect after successful authentication (same rules as RedirectLogistration).
 *
 * @param {Object} params
 * @param {string} params.redirectUrl
 * @param {boolean} params.success
 * @param {string|null} [params.finishAuthUrl]
 */
export default function postAuthRedirect({ redirectUrl, success, finishAuthUrl = null }) {
  if (!success) {
    return;
  }

  let finalUrl = redirectUrl;
  if (finishAuthUrl && !redirectUrl.includes(finishAuthUrl)) {
    finalUrl = getConfig().LMS_BASE_URL + finishAuthUrl;
  }

  window.location.href = finalUrl;
}
