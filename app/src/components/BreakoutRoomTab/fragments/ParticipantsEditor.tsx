// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Checkbox, FormControlLabel as MuiFormControlLabel, Popover, styled, Typography } from '@mui/material';
import { Participant } from '@opentalk/common';
import { concat, without } from 'lodash';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface IParticipantsEditorProps {
  onChange: (participants: Participant[]) => void;
  assignedParticipants: Participant[];
  unAssignedParticipants: Participant[];
  title: string;
}

const FormControlLabel = styled(MuiFormControlLabel)({
  justifyContent: 'space-between',
  marginLeft: 0,
  marginRight: 0,
});

const ParticipantContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 200,
  width: '17.875rem',
  overflowY: 'scroll',
  padding: theme.spacing(0, 1, 0, 2),
}));

const ButtonGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1.25, 2),
  borderTop: `1px solid #385865`,
}));

const Title = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: 6,
  backgroundColor: '#385865',
}));

const ParticipantsEditor = ({
  onChange,
  assignedParticipants,
  unAssignedParticipants,
  title,
}: IParticipantsEditorProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [participantsToAssign, setParticipantsToAssign] = React.useState<Participant[]>(assignedParticipants);
  const { t } = useTranslation();

  useEffect(() => {
    setParticipantsToAssign(assignedParticipants);
  }, [assignedParticipants]);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleOnChangeParticipant = (event: React.ChangeEvent<HTMLInputElement>, participant: Participant) => {
    event.stopPropagation();
    const checked = event.target.checked;
    if (checked) {
      setParticipantsToAssign(concat(participantsToAssign, participant));
    } else {
      setParticipantsToAssign(without(participantsToAssign, participant));
    }
  };

  const handleSaveParticipants = () => {
    onChange(participantsToAssign);
    setAnchorEl(null);
  };

  const renderParticipants = (participants: Participant[]) =>
    participants.map((participant) => (
      <FormControlLabel
        key={participant.id}
        control={
          <Checkbox
            checked={
              participantsToAssign.findIndex((participantToAssign) => participantToAssign.id === participant.id) !== -1
            }
            id={participant.id}
            color={'primary'}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleOnChangeParticipant(event, participant)}
          />
        }
        translate="no"
        label={participant.displayName}
        labelPlacement={'start'}
      />
    ));

  const open = Boolean(anchorEl);

  return (
    <div>
      <Button size={'small'} variant={'text'} onClick={handlePopoverOpen}>
        {t('user-editor-button-edit')}
      </Button>
      <Popover
        open={open}
        onClose={handlePopoverClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted={false}
      >
        <Title variant={'body2'}>{title}</Title>
        <ParticipantContainer>
          <Typography variant={'caption'}>{`${t('user-selection-not-assigned-users')}:`}</Typography>
          {renderParticipants(unAssignedParticipants)}
          <Typography variant={'caption'}>{`${t('user-selection-assigned-users')}:`}</Typography>
          {renderParticipants(assignedParticipants)}
        </ParticipantContainer>
        <ButtonGroup>
          <Button size={'small'} variant={'text'} onClick={handlePopoverClose}>
            {t('user-selection-button-cancel')}
          </Button>
          <Button size={'small'} onClick={handleSaveParticipants}>
            {t('user-selection-button-save')}
          </Button>
        </ButtonGroup>
      </Popover>
    </div>
  );
};

export default ParticipantsEditor;
