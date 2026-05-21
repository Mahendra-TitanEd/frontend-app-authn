import { getConfig } from '@edx/frontend-platform';
import * as QueryString from 'query-string';

import { DEFAULT_REDIRECT_URL } from '../../data/constants';

const buildUrlFromNext = (next) => {
  if (!next || typeof next !== 'string') {
    return '';
  }
  const trimmed = next.trim();
  if (!trimmed) {
    return '';
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `${getConfig().LMS_BASE_URL}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
};

/**
 * Resolves post-auth redirect target using the same rules as loginRequest + RedirectLogistration.
 *
 * @param {Object} params
 * @param {Object} [params.responseBody] — verify-otp or login API body (camelCase or snake_case)
 * @param {string|null} [params.finishAuthUrl] — from mfe_context / third-party auth pipeline
 */
export default function resolvePostAuthRedirect({ responseBody = {}, finishAuthUrl = null }) {
  const redirectFromApi = responseBody.redirectUrl || responseBody.redirect_url || '';
  const queryParams = QueryString.parse(window.location.search);
  const fromNext = buildUrlFromNext(queryParams.next);

  const redirectUrl = redirectFromApi
    || fromNext
    || `${getConfig().LMS_BASE_URL}${DEFAULT_REDIRECT_URL}`;

  const pipelineFinishUrl = finishAuthUrl
    || responseBody.finishAuthUrl
    || responseBody.finish_auth_url
    || null;

  return {
    success: true,
    redirectUrl,
    finishAuthUrl: pipelineFinishUrl,
  };
}
