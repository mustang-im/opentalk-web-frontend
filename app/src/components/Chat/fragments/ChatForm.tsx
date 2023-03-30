// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { IconButton as MuiIconButton, InputAdornment, styled, Tooltip } from '@mui/material';
import { GroupId, ParticipantId, setHotkeysEnabled, TargetId } from '@opentalk/common';
import { SendMessageIcon } from '@opentalk/common';
import Picker, {
  EmojiClickData,
  SkinTones,
  EmojiStyle,
  Theme,
  SkinTonePickerLocation,
  SuggestionMode,
  Categories,
} from 'emoji-picker-react';
import { useFormik } from 'formik';
import React, { useState, KeyboardEventHandler, useMemo, FocusEvent } from 'react';
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
  width: '100%',

  '.EmojiPickerReact.epr-dark-theme': {
    '--epr-dark': theme.palette.background.voteResult,
    '--epr-bg-color': theme.palette.background.voteResult,
    '--epr-category-label-bg-color': theme.palette.background.voteResult,
    '--epr-picker-border-color': theme.palette.background.voteResult,
    '--epr-search-input-bg-color': theme.palette.secondary.main,
    '--epr-hover-bg-color': theme.palette.secondary.main,
    '--epr-category-icon-active-color': theme.palette.primary.main,
    '--epr-highlight-color': theme.palette.secondary.main,
    '--epr-search-border-color': theme.palette.primary.main,
    '--epr-search-input-text-color': theme.palette.background.voteResult,
    '--epr-focus-bg-color': theme.palette.background.paper,
  },

  '.EmojiPickerReact .epr-search-container input.epr-search:focus': {
    '--epr-search-input-text-color': theme.palette.secondary.main,
  },

  '.EmojiPickerReact .epr-category-nav': {
    display: 'none',
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

  const emojiPickerCategories = useMemo(() => {
    return Object.values(Categories).map((category) => {
      return { category, name: t(`emoji-category-${category}`) };
    });
  }, [t]);

  const handleEmojiClick = (data: EmojiClickData) => {
    formik.setFieldValue('message', formik.values.message + data.emoji);
  };

  const focusHandler = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target && event.target.tagName === 'INPUT') {
      dispatch(setHotkeysEnabled(false));
    }
  };

  const blurHandler = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target && event.target.tagName === 'INPUT') {
      dispatch(setHotkeysEnabled(true));
    }
  };

  const renderPicker = () =>
    openPicker && (
      <PickerContainer onFocus={focusHandler} onBlur={blurHandler}>
        <Picker
          onEmojiClick={handleEmojiClick}
          autoFocusSearch={false}
          defaultSkinTone={SkinTones.MEDIUM_LIGHT}
          lazyLoadEmojis={true}
          emojiVersion="11"
          theme={Theme.DARK}
          previewConfig={{
            showPreview: false,
          }}
          categories={emojiPickerCategories}
          searchPlaceHolder=""
          emojiStyle={EmojiStyle.NATIVE}
          skinTonePickerLocation={SkinTonePickerLocation.SEARCH}
          suggestedEmojisMode={SuggestionMode.RECENT}
          width="100%"
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
