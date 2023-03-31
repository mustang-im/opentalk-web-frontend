// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  styled,
  List,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Typography,
  FormControlLabel as MuiFormControlLabel,
  Switch,
  ListItem,
} from '@mui/material';
import { ArrowDownIcon, Participant } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '../../../hooks';
import {
  selectAllGroupParticipantsSortedAndFiltered,
  selectAllParticipantsSortedAndFiltered,
} from '../../../store/selectors';
import { selectShowParticipantGroups, setSortByGroups } from '../../../store/slices/uiSlice';
import ParticipantListItem from './ParticipantListItem';

const ListContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 25em)',
  overflow: 'auto',
});

const CustomList = styled(List)({
  flex: '1 1 auto',
  overflowY: 'auto',
  textAlign: 'left',
  width: '100%',
});

const Accordion = styled(MuiAccordion)({
  margin: '0 !important',
  backgroundColor: 'transparent',
});

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  margin: 0,
  padding: 0,
  flexDirection: 'row-reverse',
  maxHeight: '2rem !important',
  minHeight: '2rem !important',
  '& .MuiAccordionSummary-content.Mui-expanded': {
    marginLeft: theme.spacing(1),
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  '& .MuiIconButton-edgeEnd': {
    marginRight: 0,
  },
  '& svg': {
    width: '0.75rem',
    color: 'white',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)({
  flex: 1,
  flexDirection: 'column',
  padding: 0,
  backgroundColor: 'transparent',
});

const FormControlLabel = styled(MuiFormControlLabel)({
  flex: 1,
  marginLeft: 0,
  marginRight: 0,
  justifyContent: 'space-between',
});

const ParticipantList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const groupsParticipants = useAppSelector(selectAllGroupParticipantsSortedAndFiltered, () => false);
  const allParticipants = useAppSelector(selectAllParticipantsSortedAndFiltered);
  const groupParticipantsEnabled = useAppSelector(selectShowParticipantGroups);

  if (groupsParticipants.size === 0) {
    return null;
  }

  const renderParticipantList = (participants: Participant[]) => (
    <CustomList>
      {participants.map((participant) => (
        <ParticipantListItem key={participant.id} participant={participant} />
      ))}
    </CustomList>
  );

  const renderAccordions = () => {
    const accordions: Array<React.ReactNode> = [];
    groupsParticipants.forEach((participants, groupId) => {
      if (participants.length === 0) {
        return;
      }
      accordions.push(
        <Accordion key={groupId} defaultExpanded={true} elevation={0}>
          <AccordionSummary id={groupId} aria-controls={groupId} expandIcon={<ArrowDownIcon />}>
            <Typography variant={'caption'}>{groupId}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CustomList>{renderParticipantList(participants)}</CustomList>
          </AccordionDetails>
        </Accordion>
      );
    });
    return accordions;
  };

  return (
    <ListContainer>
      <ListItem sx={{ px: 0 }}>
        <FormControlLabel
          control={
            <Switch
              color="primary"
              onChange={(_, checked) => dispatch(setSortByGroups(checked))}
              value={groupParticipantsEnabled}
              checked={groupParticipantsEnabled}
            />
          }
          label={
            <Typography variant="body2">
              {t(groupParticipantsEnabled ? 'sort-groups-on' : 'sort-groups-off')}
            </Typography>
          }
          labelPlacement="start"
        />
      </ListItem>
      {groupParticipantsEnabled ? renderAccordions() : renderParticipantList(allParticipants)}
    </ListContainer>
  );
};

export default React.memo(ParticipantList);
