// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  styled,
  Checkbox,
  Typography,
  Button,
  Popover,
  InputAdornment,
  ListItem,
  List,
  FormControlLabel as MuiFormControlLabel,
  ListItemAvatar,
  ListItemText,
  Container,
  Stack,
  Grid,
} from '@mui/material';
import { ParticipantId, ParticipationKind } from '@opentalk/common';
import { SearchIcon } from '@opentalk/common';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { selectWriter, uploadPdf } from '../../api/types/outgoing/protocol';
import TextField from '../../commonComponents/TextField';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectCombinedParticipantsAndUser } from '../../store/selectors';
import { selectProtocolUrl } from '../../store/slices/protocolSlice';
import ParticipantAvatar from '../ParticipantAvatar';

const ParticipantSelectContainer = styled(Container)(({ theme }) => ({
  width: '19rem',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

const ParticipantsListGrid = styled(Grid)({
  height: '20rem',
  overflowY: 'auto',
});

const FormControlLabel = styled(MuiFormControlLabel)({
  flex: 1,
  marginLeft: 0,
  minWidth: 0,
  '& .MuiTypography-root': {
    flex: 1,
  },
});

const SelectedParticipantsList = styled(List)({
  overflowY: 'auto',
  height: 'calc(100vh - 32rem)',
  width: '100%',
  minWidth: 0,
});

export interface ProtocolParticipant {
  id: ParticipantId;
  displayName: string;
  avatarUrl?: string;
  isSelected: boolean;
}

const ProtocolTab = () => {
  const [selectedParticipants, setSelectedParticipants] = useState<ProtocolParticipant[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [participants, setParticipants] = useState<ProtocolParticipant[]>([]);
  const { t } = useTranslation();
  const allParticipants = useAppSelector(selectCombinedParticipantsAndUser);
  const dispatch = useAppDispatch();
  const protocolUrl = useAppSelector(selectProtocolUrl);

  const participantArray = useCallback(() => {
    return allParticipants
      .filter((participant) => participant.participationKind !== ParticipationKind.Guest)
      .map(({ displayName, avatarUrl, id }) => ({
        displayName,
        avatarUrl,
        id,
        isSelected: false,
      }));
  }, [allParticipants]);

  const checkAllHandler = useCallback(() => {
    let allChecked = false;
    participants.forEach((participant) => {
      allChecked = participant.isSelected;
    });
    const checkedArray = participants.map((participant) => {
      participant.isSelected = !allChecked;
      return participant;
    });
    setParticipants(checkedArray);
  }, [participants]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setParticipants((prevState) => {
        if (e.target.value) {
          return prevState.filter((participant) => participant.displayName.includes(e.target.value));
        } else {
          return participantArray();
        }
      });
    },
    [participantArray]
  );

  const checkHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newParticipantsArray = [...participants];
      newParticipantsArray[index].isSelected = e.target.checked;
      setParticipants(newParticipantsArray);
    },
    [participants]
  );

  const sendInvitations = useCallback(() => {
    const selectedUsers = selectedParticipants.map((user) => {
      return user.id;
    });

    dispatch(
      selectWriter.action({
        participantIds: selectedUsers,
      })
    );
  }, [selectedParticipants, dispatch]);

  const closeParticipantsListPanel = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const assignButtonHandler = useCallback(() => {
    setSelectedParticipants(participants.filter((item) => item.isSelected));
    closeParticipantsListPanel();
  }, [participants, closeParticipantsListPanel]);

  const openParticipantsListPanel = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  useEffect(() => {
    setParticipants(participantArray);
  }, [participantArray]);

  const uploadPdfAction = useCallback(() => {
    dispatch(uploadPdf.action());
  }, [dispatch]);

  const open = Boolean(anchorEl);

  return (
    <Stack
      spacing={2}
      direction="column"
      justifyContent={'space-between'}
      alignItems={'center'}
      sx={{ width: '100%', height: '100%' }}
    >
      <Stack
        spacing={2}
        direction="column"
        justifyContent={'space-evenly'}
        alignItems={'flex-start'}
        sx={{ width: '100%' }}
        flex={0}
      >
        <Grid container>
          <Grid item xs={12}>
            <Button onClick={openParticipantsListPanel}>{t('protocol-invite-button')}</Button>
          </Grid>
        </Grid>
        <SelectedParticipantsList>
          {selectedParticipants.map((participant, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemAvatar>
                <ParticipantAvatar src={participant.avatarUrl}>{participant.displayName}</ParticipantAvatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography noWrap>{participant.displayName}</Typography>} />
            </ListItem>
          ))}
        </SelectedParticipantsList>
      </Stack>
      <Grid container>
        <Grid item xs={12}>
          {protocolUrl && (
            <Button sx={{ width: 'auto' }} onClick={uploadPdfAction} aria-label={t('protocol-upload-pdf-button')}>
              {t('protocol-upload-pdf-button')}
            </Button>
          )}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Button
            aria-label={t('protocol-invite-send-button')}
            disabled={!selectedParticipants.length}
            onClick={sendInvitations}
          >
            {t('protocol-invite-send-button')}
          </Button>
        </Grid>
      </Grid>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 0,
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={open}
        onClose={closeParticipantsListPanel}
      >
        <ParticipantSelectContainer disableGutters>
          <Stack spacing={2}>
            <TextField
              size={'small'}
              onChange={(e) => handleSearch(e)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              fullWidth
            />
            <Stack direction={'row'}>
              <Button size={'small'} onClick={checkAllHandler}>
                {t('poll-participant-list-button-select-all')}
              </Button>
            </Stack>
            <ParticipantsListGrid zeroMinWidth item>
              <List>
                {participants.map((participant, index) => (
                  <ListItem key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={participant.isSelected}
                          id={participant.id}
                          onChange={(e) => checkHandler(e, index)}
                          color="primary"
                        />
                      }
                      label={<Typography noWrap>{participant.displayName}</Typography>}
                      labelPlacement={'start'}
                    />
                  </ListItem>
                ))}
              </List>
            </ParticipantsListGrid>
            <Stack justifyContent="space-between" direction="row" spacing={2}>
              <Button variant={'text'} onClick={closeParticipantsListPanel}>
                {t('poll-participant-list-button-close')}
              </Button>
              <Button onClick={assignButtonHandler}>{t('poll-participant-list-button-select')}</Button>
            </Stack>
          </Stack>
        </ParticipantSelectContainer>
      </Popover>
    </Stack>
  );
};

export default ProtocolTab;
