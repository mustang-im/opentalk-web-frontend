import { ParticipantId } from '@opentalk/common';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import automod from '../../../api/types/outgoing/automod';
import { useAppDispatch, useAppSelector, useDisplayName } from '../../../hooks';
import { selectAllOnlineParticipants } from '../../../store/slices/participantsSlice';
import { selectOurUuid } from '../../../store/slices/userSlice';
import SelectableList, { SelectableListItem } from '../../ui/SelectableList';

interface AllowListPanelProps {
  allowList: ParticipantId[];
  setAllowList: React.Dispatch<React.SetStateAction<ParticipantId[]>>;
}
export const AllowListPanel = ({ allowList, setAllowList }: AllowListPanelProps) => {
  const { t } = useTranslation();
  const allOnlineParticipant = useAppSelector(selectAllOnlineParticipants);

  const participantIds = Array<ParticipantId>();
  allOnlineParticipant.forEach((participant) => {
    participantIds.push(participant.id);
  });
  const ourUuid = useAppSelector(selectOurUuid);
  const participantIdsWithUs = ourUuid ? participantIds.concat([ourUuid]) : participantIds;
  const getDisplayName = useDisplayName();
  const dispatch = useAppDispatch();

  const handleToggle = useCallback(
    (value: ParticipantId) => () => {
      const currentIndex = allowList.indexOf(value);
      const newChecked = [...allowList];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setAllowList(newChecked);
    },
    [allowList, setAllowList]
  );

  const allSelected = useMemo(
    () => participantIdsWithUs.every((value) => allowList.includes(value as ParticipantId)),
    [participantIdsWithUs, allowList]
  );

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setAllowList([]);
    } else {
      setAllowList(participantIdsWithUs as ParticipantId[]);
    }
  }, [allSelected, participantIdsWithUs, setAllowList]);

  return (
    <>
      <h4>{t('automod-allowlist-tab-header')}</h4>
      <p>{t('automod-allowlist-tab-help')}</p>
      <SelectableList>
        <SelectableListItem selected={allSelected} label="all" onClick={() => toggleAll()}>
          {t('toggle-all')}
        </SelectableListItem>
        {participantIdsWithUs.map((participantId) => {
          const selected = allowList.includes(participantId as ParticipantId);
          return (
            <SelectableListItem
              selected={selected}
              key={participantId}
              label={participantId as string}
              onClick={handleToggle(participantId as ParticipantId)}
            >
              {getDisplayName.resolve(participantId as ParticipantId)}
              <button
                onClick={() =>
                  dispatch(
                    automod.actions.select.action({
                      how: 'specific',
                      participant: participantId as ParticipantId,
                      keepInRemaining: false,
                    })
                  )
                }
              >
                Set as speaker
              </button>
              <button
                onClick={() =>
                  dispatch(
                    automod.actions.select.action({
                      how: 'specific',
                      participant: participantId as ParticipantId,
                      keepInRemaining: true,
                    })
                  )
                }
              >
                Set as speaker (keep in remaining)
              </button>
            </SelectableListItem>
          );
        })}
      </SelectableList>
    </>
  );
};

export default AllowListPanel;
