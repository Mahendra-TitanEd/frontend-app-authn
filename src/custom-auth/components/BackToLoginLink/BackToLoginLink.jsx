import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import messages from './BackToLoginLink.messages';
import './BackToLoginLink.scss';
import { LOGIN_PAGE } from '../../../data/constants';
import { updatePathWithQueryParams } from '../../../data/utils';

const BackToLoginLink = ({ className, disabled }) => {
  const { formatMessage } = useIntl();
  const loginUrl = updatePathWithQueryParams(LOGIN_PAGE);

  if (disabled) {
    return (
      <span className={`back-to-login-link back-to-login-link--disabled ${className || ''}`}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-to-login-link__icon" />
        {formatMessage(messages['AUTH.BACK_TO_LOGIN'])}
      </span>
    );
  }

  return (
    <Link
      className={`back-to-login-link ${className || ''}`}
      to={loginUrl}
    >
      <FontAwesomeIcon icon={faArrowLeft} className="back-to-login-link__icon" />
      {formatMessage(messages['AUTH.BACK_TO_LOGIN'])}
    </Link>
  );
};

BackToLoginLink.defaultProps = {
  className: '',
  disabled: false,
};

BackToLoginLink.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default BackToLoginLink;
