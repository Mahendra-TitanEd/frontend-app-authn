import { getConfig } from '@edx/frontend-platform';
import { getHttpClient } from '@edx/frontend-platform/auth';

const getCustomLoginBaseUrl = () => `${getConfig().LMS_BASE_URL}/api/v1/custom-login/auth`;

export async function startCustomLoginAuth({ identifier, password }) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/json' },
    isPublic: true,
    withCredentials: true,
  };

  const { data } = await getHttpClient().post(
    `${getCustomLoginBaseUrl()}/start/`,
    { identifier, password },
    requestConfig,
  );

  return data;
}

export async function verifyCustomLoginOtp({ challengeId, otp }) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/json' },
    isPublic: true,
    withCredentials: true,
  };

  const { data } = await getHttpClient().post(
    `${getCustomLoginBaseUrl()}/verify-otp/`,
    { challenge_id: challengeId, otp },
    requestConfig,
  );

  return data;
}
