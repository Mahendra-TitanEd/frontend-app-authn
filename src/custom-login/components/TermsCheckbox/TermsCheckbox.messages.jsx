import { defineMessages } from '@edx/frontend-platform/i18n';

export default defineMessages({
  checkboxLabel: {
    id: 'LOGIN.TERMS_CHECKBOX',
    defaultMessage: 'I confirm that I am an authorised pilot participant and agree to use the SEARN NRA Learning Space only for pilot testing, workflow validation, and feedback, in accordance with the {termsLink}.',
    description: 'Custom login — terms participation confirmation checkbox label',
  },
  termsLink: {
    id: 'LOGIN.TERMS_LINK',
    defaultMessage: 'Terms of Use and Confidentiality Notice',
    description: 'Custom login — link text opening terms popup',
  },
  requiredError: {
    id: 'LOGIN.TERMS_REQUIRED',
    defaultMessage: 'You must confirm the terms before signing in.',
    description: 'Custom login — validation when terms checkbox is unchecked',
  },
  dialogTitle: {
    id: 'LOGIN.TERMS_DIALOG_TITLE',
    defaultMessage: 'SEARN NRA Learning Space Pilot – Terms of Use and Confidentiality Notice',
    description: 'Custom login — terms popup title',
  },
  dialogParagraph1: {
    id: 'LOGIN.TERMS_DIALOG_P1',
    defaultMessage: 'This platform is being provided for the SEARN NRA Learning Space pilot. It is intended only for pilot testing, workflow validation, and feedback collection by nominated users from participating NRAs.',
    description: 'Custom login — terms popup paragraph 1',
  },
  dialogParagraph2: {
    id: 'LOGIN.TERMS_DIALOG_P2',
    defaultMessage: 'This is not a live production system. The pilot environment is hosted by TitanEd for the purpose of the pilot and is deployed on their secure cloud infrastructure (AWS). Access to the platform and its underlying systems is restricted to authorised pilot users and designated TitanEd technical personnel for support and maintenance purposes. Final rollout into a live production environment will follow a separate WHO-managed hosting and implementation process.',
    description: 'Custom login — terms popup paragraph 2',
  },
  dialogParagraph3: {
    id: 'LOGIN.TERMS_DIALOG_P3',
    defaultMessage: 'Pilot users should use the platform only for SEARN pilot activities and should not share login access, screenshots, test materials, feedback forms, or platform content outside their organization without permission from SEARN Secretariat / WHO.',
    description: 'Custom login — terms popup paragraph 3',
  },
  dialogParagraph4: {
    id: 'LOGIN.TERMS_DIALOG_P4',
    defaultMessage: 'For pilot testing, users may work with sample records, training examples, certificates, competency entries, or mock data. NRAs should use their own judgement in deciding what information is appropriate to use for pilot testing. Sensitive personal, confidential, or regulated information should not be uploaded unless explicitly approved by the NRA for pilot use.',
    description: 'Custom login — terms popup paragraph 4',
  },
  dialogParagraph5: {
    id: 'LOGIN.TERMS_DIALOG_P5',
    defaultMessage: 'Pilot data and user activity may be reviewed by SEARN Secretariat and TitanEd for support, feedback analysis, troubleshooting, and pilot improvement purposes. Pilot data may be removed or purged after the pilot, unless otherwise agreed with SEARN Secretariat / WHO.',
    description: 'Custom login — terms popup paragraph 5',
  },
  dialogParagraph6: {
    id: 'LOGIN.TERMS_DIALOG_P6',
    defaultMessage: 'By accessing the pilot platform, users acknowledge that they are participating in a limited pilot exercise and agree to use the platform responsibly, confidentially, and only for the intended pilot purpose.',
    description: 'Custom login — terms popup paragraph 6',
  },
  dialogOk: {
    id: 'LOGIN.TERMS_DIALOG_OK',
    defaultMessage: 'OK',
    description: 'Custom login — terms popup dismiss button',
  },
});
