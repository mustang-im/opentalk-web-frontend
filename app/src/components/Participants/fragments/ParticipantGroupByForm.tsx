// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
   styled,
   FormControlLabel as MuiFormControlLabel,
   Switch,
   Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectShowParticipantGroups, setSortByGroups } from '../../../store/slices/uiSlice';
import { memo } from 'react';

const FormControlLabel = styled(MuiFormControlLabel)({
  marginLeft: 0,
  marginRight: 0,
  justifyContent: 'space-between',
});

const ParticipantGroupByForm = () => {
   const { t } = useTranslation();
   const dispatch = useAppDispatch();
   const groupParticipantsEnabled = useAppSelector(selectShowParticipantGroups);

   return (
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
   )
}

export default memo(ParticipantGroupByForm);