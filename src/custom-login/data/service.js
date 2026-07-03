import { getConfig } from '@edx/frontend-platform';
import { getHttpClient } from '@edx/frontend-platform/auth';

const getCustomLoginBaseUrl = () => `${getConfig().LMS_BASE_URL}/api/v1/custom-login/auth`;

const toApiResult = (response) => ({
  status: response?.status ?? 200,
  data: response?.data ?? response,
});

export async function startCustomLoginAuth({ identifier, password, isChecked }) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/json' },
    isPublic: true,
    withCredentials: true,
  };

  const response = await getHttpClient().post(
    `${getCustomLoginBaseUrl()}/start/`,
    { identifier, password, isChecked },
    requestConfig,
  );

  return toApiResult(response);
}

export async function verifyCustomLoginOtp({ challengeId, otp }) {
  const requestConfig = {
    headers: { 'Content-Type': 'application/json' },
    isPublic: true,
    withCredentials: true,
  };

  const response = await getHttpClient().post(
    `${getCustomLoginBaseUrl()}/verify-otp/`,
    { challenge_id: challengeId, otp },
    requestConfig,
  );

  return toApiResult(response);
}
