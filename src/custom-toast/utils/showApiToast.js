const pickString = (...candidates) => {
  for (let i = 0; i < candidates.length; i += 1) {
    const value = candidates[i];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
};

const resolvePayload = (responseOrError) => {
  if (!responseOrError) {
    return {};
  }
  if (typeof responseOrError === 'string') {
    return { message: responseOrError };
  }
  if (responseOrError?.response?.data) {
    return responseOrError.response.data;
  }
  if (responseOrError?.data) {
    return responseOrError.data;
  }
  return responseOrError;
};

/**
 * Maps API / error payloads to showToast(). API fields take priority over fallbacks.
 */
const showApiToast = (showToast, {
  responseOrError = null,
  message = null,
  title: titleOverride = null,
  description: descriptionOverride = null,
  fallbacks = {},
  formatMessage = null,
  duration = 4000,
}) => {
  const payload = resolvePayload(responseOrError);

  const apiTitle = pickString(
    titleOverride,
    payload?.title,
    payload?.error,
    typeof payload?.error_code === 'string' ? payload.error_code : null,
  );

  const apiDescription = pickString(
    descriptionOverride,
    message,
    payload?.message,
    payload?.detail,
    payload?.description,
  );

  let title = apiTitle;
  if (!title && formatMessage && fallbacks.titleId) {
    title = formatMessage(fallbacks.titleId);
  }
  if (!title) {
    title = fallbacks.title || '';
  }

  let description = apiDescription;
  if (!description && formatMessage && fallbacks.descriptionId) {
    description = formatMessage(fallbacks.descriptionId);
  }
  if (!description) {
    description = fallbacks.description || '';
  }

  return showToast({
    title: title || undefined,
    description: description || undefined,
    duration,
  });
};

export default showApiToast;
