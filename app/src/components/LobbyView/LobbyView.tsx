// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Container, IconButton, InputAdornment, Stack } from '@mui/material';
import { BreakoutRoomId, RoomId, HiddenIcon, VisibleIcon, setHotkeysEnabled } from '@opentalk/common';
import { notifications } from '@opentalk/common';
import { useFormik } from 'formik';
import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { ApiErrorWithBody, StartRoomError, useGetMeQuery } from '../../api/rest';
import TextField from '../../commonComponents/TextField';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { startRoom } from '../../store/commonActions';
import { selectFeatures } from '../../store/slices/configSlice';
import {
  ConnectionState,
  selectInviteId,
  selectPasswordRequired,
  selectRoomConnectionState,
} from '../../store/slices/roomSlice';
import { selectIsLoggedIn } from '../../store/slices/userSlice';
import { formikProps } from '../../utils/formikUtils';
import { useMediaContext } from '../MediaProvider';
import SelfTest from '../SelfTest';

const LobbyView: FC = () => {
  const dispatch = useAppDispatch();
  const mediaContext = useMediaContext();
  const { t } = useTranslation();
  const { joinWithoutMedia } = useAppSelector(selectFeatures);
  const [showPassword, setShowPassword] = useState(false);

  const [joinError, setJoinError] = useState<string | undefined>();
  const { roomId, breakoutRoomId } = useParams<'roomId' | 'breakoutRoomId'>() as {
    roomId: RoomId;
    breakoutRoomId?: BreakoutRoomId;
  };
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const { data } = useGetMeQuery(undefined, { skip: !isLoggedIn });
  const inviteCode = useAppSelector(selectInviteId);
  const connectionState = useAppSelector(selectRoomConnectionState);
  const navigate = useNavigate();
  const passwordRequired = useAppSelector(selectPasswordRequired);

  const enterRoom = useCallback(
    async (displayName: string, password: string) => {
      if (joinWithoutMedia) {
        await mediaContext.trySetVideo(false);
        await mediaContext.trySetAudio(false);
      }

      return dispatch(
        startRoom({
          roomId,
          breakoutRoomId: breakoutRoomId || null,
          displayName,
          password,
          inviteCode,
        })
      )
        .unwrap()
        .then(() => dispatch(setHotkeysEnabled(true)))
        .catch((e) => {
          if ('code' in e) {
            const error = e as ApiErrorWithBody<StartRoomError>;
            switch (error.code) {
              case StartRoomError.InvalidBreakoutRoomId:
              case StartRoomError.NoBreakoutRooms:
                notifications.info(t('breakout-notification-session-ended-header'));
                navigate(`/room/${roomId}`);
                break;
              case StartRoomError.InvalidJson:
                console.error('invalid json request in startRoom', e);
                notifications.error(t('error-general'));
                break;
              case StartRoomError.WrongRoomPassword:
              case StartRoomError.InvalidCredentials:
                setJoinError('joinform-wrong-room-password');
                break;
              case StartRoomError.NotFound:
                notifications.error(t('joinform-room-not-found'));
                navigate('/dashboard');
                break;
              case StartRoomError.Forbidden:
                notifications.error(t('joinform-access-denied'));
                navigate('/dashboard');
                break;
              default:
                console.error(`unknown error code ${e.code} in startRoom`, e);
                notifications.error(t('error-general'));
            }
          } else {
            console.error('unknown error in startRoom', e);
            notifications.error(t('error-general'));
          }
        });
    },
    [dispatch, navigate, t, breakoutRoomId, roomId, inviteCode, joinWithoutMedia, mediaContext]
  );

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required(t('field-error-required', { fieldName: 'Name' })),
  });

  const formik = useFormik({
    initialValues: {
      name: data?.displayName || '',
      password: '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (isLoggedIn || inviteCode !== undefined) {
        return enterRoom(values.name, values.password);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Container>
        <Stack direction={'column'} spacing={4} justifyContent={'center'} alignItems={'center'}>
          <SelfTest
            actionButton={
              <Button
                type={'submit'}
                disabled={
                  !(isLoggedIn || inviteCode !== undefined) ||
                  connectionState === ConnectionState.Starting ||
                  !formik.isValid
                }
              >
                {t('joinform-enter-now')}
              </Button>
            }
          >
            <Stack direction={'row'} spacing={1}>
              <TextField
                {...formikProps('name', formik)}
                color={'secondary'}
                placeholder={t('joinform-enter-name')}
                autoComplete="user-name"
              />
              {passwordRequired && (
                <TextField
                  {...formikProps('password', formik)}
                  color={'secondary'}
                  placeholder={t('joinform-enter-password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={t('toggle-password-visibility')}
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {!showPassword ? <VisibleIcon /> : <HiddenIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  error={Boolean(joinError)}
                  helperText={joinError ? t(joinError) : ''}
                />
              )}
            </Stack>
          </SelfTest>
        </Stack>
      </Container>
    </form>
  );
};

export default LobbyView;
