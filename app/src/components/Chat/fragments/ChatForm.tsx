// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { IconButton as MuiIconButton, InputAdornment, styled, Tooltip } from '@mui/material';
import { GroupId, ParticipantId, TargetId } from '@opentalk/common';
import { SendMessageIcon } from '@opentalk/common';
import Picker, { IEmojiData, SKIN_TONE_MEDIUM_LIGHT } from 'emoji-picker-react';
import { useFormik } from 'formik';
import React, { useState, KeyboardEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { sendChatMessage } from '../../../api/types/outgoing/chat';
import { LimitedTextField } from '../../../commonComponents';
import ChatScope from '../../../enums/ChatScope';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectChatEnabledState } from '../../../store/slices/chatSlice';
import { formikProps } from '../../../utils/formikUtils';
import yup from '../../../utils/yupUtils';

const Form = styled('form')({
  position: 'relative',
});

const IconButton = styled(MuiIconButton)({
  fontSize: '1rem',
});

const PickerContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: '4.375rem',

  '& aside.emoji-picker-react': {
    background: '#385865',
    boxShadow: 'none',
    border: 0,

    '& .emoji-group:before': {
      background: '#385865',
      color: theme.palette.secondary.contrastText,
      font: theme.typography.h4.font,
    },

    '& .emoji-categories': {
      '& button': {
        width: '1.25rem',
        height: '2rem',
        backgroundSize: 'inherit',
        filter: 'invert(100%)',
        '-webkit-filter': 'invert(100%)',
        opacity: '0.5',
        transition: '0.3s',
      },

      '& button.active, & button:hover': {
        opacity: '1.0',
      },
    },
  },

  '& input.emoji-search': {
    background: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

interface IChatFormProps {
  scope: ChatScope;
  targetId?: TargetId;
}

const MAX_CHAT_CHARS = 4000;

const ChatForm = ({ scope, targetId }: IChatFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [openPicker, setOpenPicker] = useState(false);
  const isChatEnabled = useAppSelector(selectChatEnabledState);

  const handleEmojiClick = (event: React.MouseEvent<Element, MouseEvent>, emojiObject: IEmojiData) => {
    formik.setFieldValue('message', formik.values.message + emojiObject.emoji);
  };

  const renderPicker = () =>
    openPicker && (
      <PickerContainer>
        <Picker
          onEmojiClick={handleEmojiClick}
          disableAutoFocus={true}
          skinTone={SKIN_TONE_MEDIUM_LIGHT}
          groupNames={{ smileys_people: 'PEOPLE' }}
          native
        />
      </PickerContainer>
    );

  const handleSubmitOnEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();

      formik.submitForm();
    }
  };

  const validationSchema = yup.object({
    message: yup.string().trim().maxBytes(MAX_CHAT_CHARS).required(t('chat-input-error-required')),
  });

  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values, { resetForm, setErrors, setTouched }) => {
      switch (scope) {
        case ChatScope.Group:
          if (targetId !== undefined) {
            dispatch(
              sendChatMessage.action({ scope: ChatScope.Group, content: values.message, target: targetId as GroupId })
            );
          }
          break;
        case ChatScope.Private:
          dispatch(
            sendChatMessage.action({
              scope: ChatScope.Private,
              content: values.message,
              target: targetId as ParticipantId,
            })
          );
          break;
        default:
          dispatch(sendChatMessage.action({ scope: ChatScope.Global, content: values.message }));
      }
      setErrors({});
      setTouched({});
      resetForm();
      setOpenPicker(false);
    },
  });

  const renderForm = (
    <Form onSubmit={formik.handleSubmit}>
      {renderPicker()}
      <LimitedTextField
        maxCharacters={MAX_CHAT_CHARS}
        showLimitAt={MAX_CHAT_CHARS / 2}
        {...formikProps('message', formik)}
        size={'small'}
        placeholder={t('chatinput-placeholder')}
        onKeyDown={handleSubmitOnEnter}
        onBlur={(e) => {
          if (e.currentTarget.value.trim() === '') {
            formik.setErrors({});
          }
        }}
        countBytes={true}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="submit chat message"
              type={'submit'}
              edge="end"
              data-testid={'send-message-button'}
              disabled={!isChatEnabled}
            >
              <SendMessageIcon />
            </IconButton>
          </InputAdornment>
        }
        startAdornment={
          <InputAdornment position="start">
            <IconButton
              aria-label="emoji picker open"
              aria-pressed={openPicker}
              onClick={() => setOpenPicker(!openPicker)}
              role="button"
              edge={'start'}
              disabled={!isChatEnabled}
            >
              <span role="img" aria-label="smiling face emoji">
                😋
              </span>
            </IconButton>
          </InputAdornment>
        }
        maxRows={3}
        multiline
        fullWidth
        disabled={!isChatEnabled}
      />
    </Form>
  );

  if (!isChatEnabled) {
    return <Tooltip title={t('chat-disabled-tooltip')} placement={'top'} children={renderForm} />;
  }

  return renderForm;
};

ChatForm.defaultProps = {
  scope: ChatScope.Global,
};

export default ChatForm;
