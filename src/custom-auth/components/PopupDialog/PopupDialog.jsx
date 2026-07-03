import React, { useEffect } from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import messages from './PopupDialog.messages';
import './PopupDialog.scss';

const PopupDialog = ({
  isOpen,
  title,
  onClose,
  children,
  contentClassName,
  showCloseButton,
  closeOnBackdropClick,
}) => {
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const closeDialogLabel = formatMessage(messages.closeDialog);

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <div className="popup-dialog" role="dialog" aria-modal="true" aria-labelledby="popup-dialog-title">
      {closeOnBackdropClick ? (
        <button
          type="button"
          className="popup-dialog__backdrop"
          aria-label={closeDialogLabel}
          onClick={handleBackdropClick}
        />
      ) : (
        <div className="popup-dialog__backdrop popup-dialog__backdrop--static" aria-hidden="true" />
      )}
      <div className={`popup-dialog__content ${contentClassName || ''}`.trim()}>
        <div className="popup-dialog__header">
          <h2 id="popup-dialog-title" className="popup-dialog__title">{title}</h2>
        </div>
        {showCloseButton ? (
          <button
            type="button"
            className="popup-dialog__close"
            aria-label={closeDialogLabel}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        ) : null}
        {children}
      </div>
    </div>
  );
};

PopupDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  contentClassName: PropTypes.string,
  showCloseButton: PropTypes.bool,
  closeOnBackdropClick: PropTypes.bool,
};

PopupDialog.defaultProps = {
  children: null,
  contentClassName: '',
  showCloseButton: false,
  closeOnBackdropClick: false,
};

export default PopupDialog;
