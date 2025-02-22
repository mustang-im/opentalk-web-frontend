// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputAdornment, styled, Tooltip, Popover, useTheme } from '@mui/material';
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
import { useState, KeyboardEventHandler, useMemo, FocusEvent, useRef, useLayoutEffect, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { sendChatMessage } from '../../../api/types/outgoing/chat';
import { EmojiIcon, SendMessageIcon } from '../../../assets/icons';
import { AdornmentIconButton, VisuallyHiddenTitle, CommonTextField } from '../../../commonComponents';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectChatEnabledState } from '../../../store/slices/chatSlice';
import { saveDefaultChatMessage, selectDefaultChatMessage } from '../../../store/slices/uiSlice';
import { GroupId, ParticipantId, TargetId, ChatScope } from '../../../types';
import { formikGetValue, formikProps } from '../../../utils/formikUtils';
import yup from '../../../utils/yupUtils';

export const CHAT_INPUT_ID = 'chat-input';

const Form = styled('form')({
  position: 'relative',
});

const SendMessageButton = styled(AdornmentIconButton)({
  fontSize: '1rem',
});

/**
 * We have to adjust here because there is no glyphicon in this button
 * there is an emoji. It screws up all sizes and makes the ripple effect
 * cut through the border of the parent input field
 */
const EmojiIconButton = styled(AdornmentIconButton)({
  padding: '0.5rem',
  lineHeight: '1.25rem',
});

const PickerContainer = styled('div')(({ theme }) => ({
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

interface ChatFormProps {
  scope: ChatScope;
  targetId?: TargetId;
  autoFocusMessageInput?: boolean;
}

const MAX_CHAT_CHARS = 4000;

const ChatForm = ({ scope, targetId, autoFocusMessageInput }: ChatFormProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [openPicker, setOpenPicker] = useState(false);
  const [hasFocus, setFocus] = useState(false);
  const isChatEnabled = useAppSelector(selectChatEnabledState);
  const emojiButton = useRef<HTMLButtonElement | null>(null);
  const defaultChatMessage = useAppSelector(selectDefaultChatMessage(scope, targetId));
  const messageInputReference = useRef<HTMLInputElement>(null);

  useLayoutEffect(
    function bootstrapMessageInputAutofocusing() {
      if (autoFocusMessageInput && messageInputReference.current) {
        /**
         * Not a big fan of the solution but at the moment I couldn't find
         * proper way to put nested textarea in the MUI BaseInput component in focus.
         * Reference object is pointing to the HTMLDivElement and calling .focus on it does
         * nothing.
         */
        const nestedTextarea = messageInputReference.current.querySelector('textarea');
        if (nestedTextarea) {
          nestedTextarea.focus();
        }
      }
    },
    [autoFocusMessageInput]
  );

  const emojiPickerCategories = useMemo(() => {
    return Object.values(Categories).reduce(
      (categories, category) => {
        if (category === Categories.SUGGESTED) return categories;
        return categories.concat({ category, name: t(`emoji-category-${category}`) });
      },
      [] as Array<{ category: Categories; name: string }>
    );
  }, [t]);

  const handleEmojiClick = (data: EmojiClickData) => {
    const message = formik.values.message + data.emoji;
    formik.setFieldValue('message', message);
    dispatch(saveDefaultChatMessage({ scope, targetId, input: message }));
  };

  const blurHandler = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target && event.target.tagName === 'INPUT') {
      dispatch(saveDefaultChatMessage({ scope, targetId, input: formikGetValue('message', formik, '') }));
    }
  };

  const onEmojiPickerContainerKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();
    /**
     * Since we don't have direct access to the library's search field, we depend on event bubbling and identify the source element of the event.
     *
     * With only one nested input field, we can safely rely on this check.
     */
    if (event.key === 'Escape' && 'tagName' in event.target && (event.target as HTMLElement).tagName === 'INPUT') {
      setOpenPicker(false);
      /**
       * The emoji picker state is managed within the same component as the emoji button, leading to re-renders.
       * When the state changes, it overrides the focused button, causing it to lose focus. Therefore,
       * this workaround ensures the emoji button regains focus in the next painting cycle after the re-render completes.
       *
       * Focusing the triggering button is necessary for accessibility compliance (A11Y).
       */
      requestAnimationFrame(() => {
        if (emojiButton.current) {
          emojiButton.current.focus();
        }
      });
    }
  };

  const renderPicker = () => (
    <Popover
      open={openPicker}
      anchorEl={emojiButton.current}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      onClose={() => setOpenPicker(false)}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-label': 'Emoji picker',
        },
      }}
    >
      <PickerContainer
        onBlur={blurHandler}
        onKeyDown={onEmojiPickerContainerKeyDown}
        onKeyUp={(event) => event.stopPropagation()}
      >
        <Picker
          onEmojiClick={handleEmojiClick}
          autoFocusSearch={true}
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
          width="300px"
        />
      </PickerContainer>
    </Popover>
  );

  const handleSubmitOnEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    // Workaround for handling dead keys (special char) for German and other non-english keyboards
    if (event.key === 'Dead') {
      const nestedTextarea = messageInputReference.current?.querySelector('textarea');
      nestedTextarea?.blur();
      nestedTextarea?.focus();
    }
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
    initialValues: { message: defaultChatMessage },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true, // It is essential to reinitialize in order to pick up new default input message.
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
      dispatch(saveDefaultChatMessage({ scope, targetId, input: '' }));
    },
  });

  const handleFormBlur = (e: FocusEvent<HTMLInputElement>) => {
    dispatch(saveDefaultChatMessage({ scope, targetId, input: formikGetValue('message', formik, '') }));
    setFocus(false);
    if (e.currentTarget.value.trim() === '') {
      formik.setErrors({});
    }
  };

  const handleEmojiKeypress: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      setOpenPicker(!openPicker);
    }
  };

  const renderForm = (
    <Form onSubmit={formik.handleSubmit}>
      {renderPicker()}
      <CommonTextField
        ref={messageInputReference}
        maxCharacters={MAX_CHAT_CHARS}
        showLimitAt={MAX_CHAT_CHARS / 2}
        {...formikProps('message', formik)}
        size="small"
        id={CHAT_INPUT_ID}
        placeholder={t('chat-input-placeholder')}
        label={t('chat-input-label')}
        onKeyDown={handleSubmitOnEnter}
        onFocus={() => setFocus(true)}
        onBlur={handleFormBlur}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SendMessageButton
                aria-label={t('chat-submit-button')}
                type="submit"
                edge="end"
                data-testid="send-message-button"
                disabled={!isChatEnabled}
                parentHasFocus={hasFocus}
              >
                <SendMessageIcon />
              </SendMessageButton>
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <EmojiIconButton
                ref={emojiButton}
                onClick={() => setOpenPicker(!openPicker)}
                onKeyDown={handleEmojiKeypress}
                onKeyUp={handleEmojiKeypress}
                type="button"
                edge="start"
                disabled={!isChatEnabled}
                parentHasFocus={hasFocus}
              >
                <EmojiIcon />
                <VisuallyHiddenTitle component="span" label={`chat-${openPicker ? 'close' : 'open'}-emoji-picker`} />
              </EmojiIconButton>
            </InputAdornment>
          ),
        }}
        maxRows={3}
        multiline
        fullWidth
        disabled={!isChatEnabled}
        InputLabelProps={{ sx: { fontWeight: theme.typography.fontWeightRegular } }}
      />
    </Form>
  );

  if (!isChatEnabled) {
    return <Tooltip title={t('chat-disabled-tooltip')} placement="top" children={renderForm} />;
  }

  return renderForm;
};

ChatForm.defaultProps = {
  scope: ChatScope.Global,
};

export default ChatForm;
