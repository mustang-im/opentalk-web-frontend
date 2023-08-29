// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ArrowDownIcon } from "@opentalk/common";
import { useAppSelector } from "../../../hooks";
import { selectAllGroupParticipantsSortedAndFiltered } from "../../../store/selectors";
import { 
   styled,
   Typography,
   Stack,
   StackProps,
   Box,
   Button
} from '@mui/material';
import ParticipantSimpleList from "./ParticipantSimpleList";
import { Fragment, useState } from 'react';

const AccordionButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  padding: theme.spacing(0.5),
}))

const ParticipantGroups = (props: StackProps) => {
   const [expandedGroupId, setExpandedGroupId] = useState<string>('');
   const groupsParticipants = useAppSelector(selectAllGroupParticipantsSortedAndFiltered);

   if (groupsParticipants.size === 0) {
      return null;
   }

   const toggle = (groupId: string) => {
      setExpandedGroupId((currentGroupId) => currentGroupId === groupId ? '' : groupId);
   }

   const Groups = Array.from(groupsParticipants).reduce((accordions, [groupId, participants]) => {
      if (participants.length === 0) {
         return accordions;
      }

      const isExpanded = groupId === expandedGroupId;

      accordions.push(
         <Fragment key={groupId}>
            <AccordionButton
               type="button"
               variant="text"
               color="inherit"
               fullWidth
               aria-controls={groupId}
               aria-expanded={isExpanded}
               onClick={() => toggle(groupId)}
               focusRipple={true}
            >
               <ArrowDownIcon
                  sx={{
                     width: '0.6em',
                     transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                     transition: 'transform 0.3s ease-in',
                     marginRight: 1,
                  }}
               />
               <Typography variant={'caption'}>{groupId}</Typography>
            </AccordionButton>
            <Box id={groupId} overflow="hidden" flex={isExpanded ? 1 : 0}>
               <ParticipantSimpleList participants={participants} />
            </Box>
         </Fragment>
      );

      return accordions;
   }, [] as JSX.Element[]);

   return <Stack overflow="hidden" {...props}>{Groups}</Stack>;
}

export default ParticipantGroups;