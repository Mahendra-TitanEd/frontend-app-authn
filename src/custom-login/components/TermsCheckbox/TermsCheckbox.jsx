import React, { useCallback, useState } from 'react';

import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import PropTypes from 'prop-types';

import PopupDialog from '../../../custom-auth/components/PopupDialog/PopupDialog';
import messages from './TermsCheckbox.messages';
import './TermsCheckbox.scss';

const TermsCheckbox = ({ checked, onChange, error }) => {
  const { formatMessage } = useIntl();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const termsLink = (
    <button
      type="button"
      className="terms-checkbox__link"
      onClick={openDialog}
    >
      {formatMessage(messages.termsLink)}
    </button>
  );

  return (
    <>
      <Form.Group
        controlId="custom-login-terms"
        className="terms-checkbox"
        isInvalid={error !== ''}
      >
        <Form.Checkbox
          className="terms-checkbox__input"
          checked={checked}
          name="terms_accepted"
          onChange={(event) => onChange(event.target.checked)}
        >
          <span className="terms-checkbox__label">
            <FormattedMessage
              {...messages.checkboxLabel}
              values={{ termsLink }}
            />
          </span>
        </Form.Checkbox>
        {error !== '' ? (
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        ) : null}
      </Form.Group>

      <PopupDialog
        isOpen={isDialogOpen}
        title={formatMessage(messages.dialogTitle)}
        onClose={closeDialog}
        contentClassName="terms-dialog"
      >
        <div className="popup-dialog__body terms-dialog__body">
          <p>{formatMessage(messages.dialogParagraph1)}</p>
          <p>{formatMessage(messages.dialogParagraph2)}</p>
          <p>{formatMessage(messages.dialogParagraph3)}</p>
          <p>{formatMessage(messages.dialogParagraph4)}</p>
          <p>{formatMessage(messages.dialogParagraph5)}</p>
          <p>{formatMessage(messages.dialogParagraph6)}</p>
        </div>
        <div className="popup-dialog__footer">
          <button
            type="button"
            className="popup-dialog__primary-button"
            onClick={closeDialog}
          >
            {formatMessage(messages.dialogOk)}
          </button>
        </div>
      </PopupDialog>
    </>
  );
};

TermsCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

TermsCheckbox.defaultProps = {
  error: '',
};

export default TermsCheckbox;
