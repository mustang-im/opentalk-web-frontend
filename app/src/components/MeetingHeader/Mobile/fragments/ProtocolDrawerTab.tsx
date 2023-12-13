// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { ModerationTabKey } from '../../../../config/moderationTabs';
import LayoutOptions from '../../../../enums/LayoutOptions';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { selectProtocolUrl } from '../../../../store/slices/protocolSlice';
import {
  selectCinemaLayout,
  selectIsCurrentProtocolHighlighted,
  setActiveTab,
  updatedCinemaLayout,
} from '../../../../store/slices/uiSlice';
import { selectIsModerator } from '../../../../store/slices/userSlice';
import DrawerTab from './DrawerTab';

export const ProtocolDrawerTab = ({ active, children }: ComponentProps<typeof DrawerTab>) => {
  const protocolUrl = useAppSelector(selectProtocolUrl);
  const isCurrentProtocolHighlighted = useAppSelector(selectIsCurrentProtocolHighlighted);
  const cinemaLayout = useAppSelector(selectCinemaLayout);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isModerator = useAppSelector(selectIsModerator);
  const isProtocolActive = cinemaLayout === LayoutOptions.Protocol;
  const getProtocolTitle = () => (isProtocolActive ? t('protocol-tab-close-title') : t('protocol-tab-open-title'));

  const tabTitle = isModerator ? t('protocol-tab-title') : getProtocolTitle();

  const handleClick = () => {
    if (!isModerator) {
      dispatch(updatedCinemaLayout(isProtocolActive ? LayoutOptions.Grid : LayoutOptions.Protocol));
    }
    dispatch(setActiveTab(ModerationTabKey.Protocol));
  };

  if (!isModerator && !protocolUrl) {
    return <></>; // We don't want to show "open protocol" link as non moderator when it is not active.
  }

  return (
    <DrawerTab
      active={isModerator && active}
      handleClick={handleClick}
      showIndicator={!isModerator && isCurrentProtocolHighlighted}
      tabTitle={tabTitle}
    >
      {isModerator && active ? children : null}
    </DrawerTab>
  );
};
