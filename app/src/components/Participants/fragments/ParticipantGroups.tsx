// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ArrowDownIcon } from "@opentalk/common";
import { useAppSelector } from "../../../hooks";
import { selectAllGroupParticipantsSortedAndFiltered } from "../../../store/selectors";
import { 
   styled,
   Accordion as MuiAccordion,
   AccordionSummary as MuiAccordionSummary,
   AccordionDetails as MuiAccordionDetails,
   Typography,
   Stack,
   StackProps
} from '@mui/material';
import ParticipantSimpleList from "./ParticipantSimpleList";

const Accordion = styled(MuiAccordion)({
  backgroundColor: 'transparent',
});

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  margin: 0,
  padding: 0,
  flexDirection: 'row-reverse',
  maxHeight: '2rem !important',
  minHeight: '2rem !important',
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

const ParticipantGroups = (props: StackProps) => {
   const groupsParticipants = useAppSelector(selectAllGroupParticipantsSortedAndFiltered);

   if (groupsParticipants.size === 0) {
      return null;
   }

   const Groups = Array.from(groupsParticipants).reduce((accordions, [groupId, participants]) => {
      if (participants.length === 0) {
         return accordions;
      }

      accordions.push(
         <Accordion key={groupId} defaultExpanded={true} elevation={0}>
            <AccordionSummary id={groupId} aria-controls={groupId} expandIcon={<ArrowDownIcon />}>
               <Typography variant={'caption'}>{groupId}</Typography>
            </AccordionSummary>
            <AccordionDetails>
               <ParticipantSimpleList participants={participants} />
            </AccordionDetails>
         </Accordion>
      );

      return accordions;
   }, [] as JSX.Element[]);

   return <Stack overflow="auto" {...props}>{Groups}</Stack>;
}

export default ParticipantGroups;