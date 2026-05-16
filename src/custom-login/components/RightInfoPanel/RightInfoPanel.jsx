import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import messages from './RightInfoPanel.messages';
import './RightInfoPanel.scss';

const RightInfoPanel = ({
  className,
  messages: panelMessages,
  headingMessageId,
  bodyMessageId,
}) => {
  const { formatMessage } = useIntl();
  const copy = panelMessages || messages;
  const headingId = headingMessageId || 'LOGIN.INFO_HEADING';
  const bodyId = bodyMessageId || 'LOGIN.INFO_BODY';

  return (
    <aside
      className={`right-info-panel gradient-hero ${className || ''}`}
      aria-hidden="true"
    >
      <div className="right-info-panel__orb right-info-panel__orb--accent animate-float" />
      <div
        className="right-info-panel__orb right-info-panel__orb--highlight animate-float"
        style={{ animationDelay: '1s' }}
      />
      <div className="right-info-panel__inner">
        <h2 className="right-info-panel__heading font-heading">
          {formatMessage(copy[headingId])}
        </h2>
        <p className="right-info-panel__body">
          {formatMessage(copy[bodyId])}
        </p>
      </div>
    </aside>
  );
};

RightInfoPanel.defaultProps = {
  className: '',
  messages: null,
  headingMessageId: null,
  bodyMessageId: null,
};

RightInfoPanel.propTypes = {
  className: PropTypes.string,
  messages: PropTypes.shape({}),
  headingMessageId: PropTypes.string,
  bodyMessageId: PropTypes.string,
};

export default RightInfoPanel;
