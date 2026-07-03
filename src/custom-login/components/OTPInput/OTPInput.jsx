import React, { useCallback, useRef, useState } from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import messages from './OTPInput.messages';
import './OTPInput.scss';

export const OTP_LENGTH = 6;

const OTPInput = ({
  value,
  onChange,
  disabled,
  hasError,
  id,
}) => {
  const { formatMessage } = useIntl();
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const activeIndex = Math.min(value.length, OTP_LENGTH - 1);

  const handleChange = useCallback((event) => {
    const nextValue = event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    onChange(nextValue);
  }, [onChange]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowLeft' && activeIndex > 0) {
      event.preventDefault();
    }
    if (event.key === 'ArrowRight' && activeIndex < OTP_LENGTH - 1) {
      event.preventDefault();
    }
  }, [activeIndex]);

  const handlePaste = useCallback((event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    onChange(pasted);
  }, [onChange]);

  return (
    <div
      className={classNames('otp-input', {
        'otp-input--disabled': disabled,
        'otp-input--invalid': hasError,
      })}
      data-input-otp-container="true"
    >
      <label htmlFor={id} className="otp-input__slots">
        {Array.from({ length: OTP_LENGTH }, (_, index) => {
          const char = value[index] || '';
          const isActive = !disabled && isFocused && index === activeIndex && value.length < OTP_LENGTH;

          return (
            <span
              key={index}
              className={classNames('otp-input__slot', {
                'otp-input__slot--filled': !!char,
                'otp-input__slot--active': isActive,
              })}
              aria-hidden="true"
            >
              {char || (isActive ? <span className="otp-input__caret" /> : null)}
            </span>
          );
        })}
      </label>
      <input
        ref={inputRef}
        id={id}
        className="otp-input__hidden"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        aria-label={formatMessage(messages['LOGIN.OTP_INPUT_LABEL'])}
        data-input-otp="true"
      />
    </div>
  );
};

OTPInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  id: PropTypes.string,
};

OTPInput.defaultProps = {
  disabled: false,
  hasError: false,
  id: 'custom-login-otp-input',
};

export default OTPInput;
