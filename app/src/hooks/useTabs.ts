// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RoomMode, TimerStyle } from '@opentalk/common';
import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '.';
import { ModerationTabKey, Tab, tabs as initialTabs } from '../config/moderationTabs';
import { selectFeatures } from '../store/slices/configSlice';
import { selectCurrentRoomMode } from '../store/slices/roomSlice';
import { selectTimerStyle } from '../store/slices/timerSlice';
import { selectActiveTab, setActiveTab } from '../store/slices/uiSlice';
import { selectIsModerator } from '../store/slices/userSlice';
import { useEnabledModules } from './enabledModules';

const useTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const features = useAppSelector(selectFeatures);
  const enabledModules = useEnabledModules();
  const timerStyle = useAppSelector(selectTimerStyle);
  const currentRoomMode = useAppSelector(selectCurrentRoomMode);
  const isModerator = useAppSelector(selectIsModerator);
  const activeTab = useAppSelector(selectActiveTab);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only tabs with module key are conditional, otherwise they are always shown.
    const tabsFirstFilter = initialTabs.filter(
      (tab) =>
        tab.divider ||
        (tab.featureKey && features[tab.featureKey]) ||
        (tab.moduleKey ? enabledModules.has(tab.moduleKey) : false)
    );
    setTabs(tabsFirstFilter);
  }, [enabledModules, features]);

  const setDisabledTabs = useCallback(() => {
    if (!currentRoomMode && !timerStyle) {
      // We assume that the tabs are already filtered by the enabled module.
      return setTabs((tabs) => tabs.map((tab) => ({ ...tab, disabled: false })));
    }

    if (currentRoomMode === RoomMode.TalkingStick) {
      const enabledModules = [ModerationTabKey.Home, ModerationTabKey.TalkingStick];
      dispatch(setActiveTab(ModerationTabKey.TalkingStick));
      return setTabs((tabs) =>
        tabs.map((tab) => {
          if (enabledModules.includes(tab.key)) {
            return { ...tab, disabled: false };
          }
          return { ...tab, disabled: true };
        })
      );
    }

    const isTimerCoffee = timerStyle === TimerStyle.CoffeeBreak;
    const isTimerNormal = timerStyle === TimerStyle.Normal;

    //Forced redirection for other moderators than the one starting a timer to avoid them being on a disabled tab.
    if (currentRoomMode === RoomMode.CoffeeBreak && isModerator && activeTab === ModerationTabKey.Timer) {
      dispatch(setActiveTab(ModerationTabKey.Home));
    }
    if (isTimerNormal && isModerator && activeTab === ModerationTabKey.CoffeeBreak) {
      dispatch(setActiveTab(ModerationTabKey.Home));
    }

    return setTabs((tabs) =>
      tabs.map((tab) => {
        if (isTimerNormal && tab.key === ModerationTabKey.CoffeeBreak) {
          return { ...tab, disabled: true };
        }
        if (isTimerCoffee && tab.key === ModerationTabKey.Timer) {
          return { ...tab, disabled: true };
        }
        return { ...tab, disabled: false };
      })
    );
  }, [tabs, timerStyle, currentRoomMode]);

  useEffect(() => {
    setDisabledTabs();
  }, [timerStyle, currentRoomMode]);

  return tabs;
};

export default useTabs;
