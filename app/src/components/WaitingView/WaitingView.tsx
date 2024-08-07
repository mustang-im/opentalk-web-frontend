// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Button,
  Checkbox,
  Container,
  Grid,
  FormControlLabel as MuiFormControlLabel,
  Typography,
  styled,
} from '@mui/material';
import { RoomId } from '@opentalk/rest-api-rtk-query';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetRoomEventInfoQuery } from '../../api/rest';
import { enterRoom } from '../../api/types/outgoing/control';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useInviteCode } from '../../hooks/useInviteCode';
import { selectFeatures } from '../../store/slices/configSlice';
import { selectRoomConnectionState, ConnectionState, selectRoomId } from '../../store/slices/roomSlice';
import ImprintContainer from '../ImprintContainer';
import { useMediaContext } from '../MediaProvider/MediaProvider';
import SelfTest from '../SelfTest';

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '&.MuiFormControlLabel-root, .MuiButtonBase-root.MuiCheckbox-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiButtonBase-root.MuiCheckbox-root.Mui-checked': {
    color: theme.palette.primary.main,
  },
}));

const WaitingRoomText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '1.37rem',
  color: theme.palette.text.secondary,
  justifyContent: 'center',
  width: '100%',
}));

const ActionButton = styled(Button)({
  height: '100%',
});

const WaitingView = () => {
  const connectionState = useAppSelector(selectRoomConnectionState);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const mediaContext = useMediaContext();
  const { joinWithoutMedia } = useAppSelector(selectFeatures);
  const inviteCode = useInviteCode();
  const roomId = useAppSelector(selectRoomId);
  const { data: roomData } = useGetRoomEventInfoQuery({ id: roomId as RoomId, inviteCode }, { skip: !roomId });

  const [isAutoJoinEnabled, setIsAutoJoinEnabled] = useState(true);

  const readyToEnter = connectionState === ConnectionState.ReadyToEnter;

  const moveToRoom = useCallback(async () => {
    if (joinWithoutMedia) {
      await mediaContext.trySetVideo(false);
      await mediaContext.trySetAudio(false);
    }
    dispatch(enterRoom.action());
  }, [dispatch, joinWithoutMedia, mediaContext]);

  useEffect(() => {
    if (readyToEnter && isAutoJoinEnabled) {
      moveToRoom();
    }
  }, [readyToEnter]);

  return (
    <>
      <Container>
        <SelfTest
          actionButton={
            !isAutoJoinEnabled && (
              <ActionButton onClick={moveToRoom} disabled={!readyToEnter}>
                {readyToEnter ? t('joinform-enter-now') : t('joinform-waiting-room-enter')}
              </ActionButton>
            )
          }
          title={roomData?.title}
        >
          <Grid container item alignItems="center" direction="column" sm={12} md="auto" mt={0}>
            <WaitingRoomText variant="body1">
              {readyToEnter ? t('in-waiting-room-ready') : t('in-waiting-room')}
            </WaitingRoomText>
            {!readyToEnter && (
              <FormControlLabel
                control={
                  <Checkbox checked={isAutoJoinEnabled} onChange={() => setIsAutoJoinEnabled((state) => !state)} />
                }
                label={t(`waiting-room-auto-join-label`)}
              />
            )}
          </Grid>
        </SelfTest>
      </Container>
      <ImprintContainer />
    </>
  );
};

export default WaitingView;
