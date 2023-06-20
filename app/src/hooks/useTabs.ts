// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RoomMode, TimerStyle } from '@opentalk/common';
import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '.';
import { ModerationTabKeys, Tab, tabs as initialTabs } from '../config/moderationTabs';
import { selectFeatures } from '../store/slices/configSlice';
import { selectCurrentRoomMode } from '../store/slices/roomSlice';
import { selectTimerStyle } from '../store/slices/timerSlice';
import { setActiveTab } from '../store/slices/uiSlice';
import { useEnabledModules } from './enabledModules';

const useTabs = () => {
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [mainTabValue, setMainTabValue] = useState<number>(0);
  const features = useAppSelector(selectFeatures);
  const enabledModules = useEnabledModules();
  const timerStyle = useAppSelector(selectTimerStyle);
  const currentRoomMode = useAppSelector(selectCurrentRoomMode);
  const dispatch = useAppDispatch();

  const handleMainTabSelect = useCallback((tabIndex: number) => setMainTabValue(tabIndex), [setMainTabValue]);

  useEffect(() => {
    const tab = tabs[mainTabValue];
    if (tab) {
      dispatch(setActiveTab(tab.key));
    }
  }, [mainTabValue]);

  useEffect(() => {
    // Only tabs with module key are conditional, otherwise they are always shown.
    const tabsFirstFilter = initialTabs.filter(
      (tab) =>
        tab.key === ModerationTabKeys.Divider ||
        (tab.featureKey && features[tab.featureKey]) ||
        (tab.moduleKey ? enabledModules.has(tab.moduleKey) : false)
    );
    setFilteredTabs(tabsFirstFilter);
    setTabs(tabsFirstFilter);
    setMainTabValue(0);
  }, [enabledModules, features]);

  const setDisabledTabs = useCallback(() => {
    if (!currentRoomMode && !timerStyle) {
      // We assume that the tabs are already filtered by the enabled module.
      return setTabs((tabs) => tabs.map((tab) => ({ ...tab, disabled: false })));
    }

    if (currentRoomMode === RoomMode.TalkingStick) {
      const enabledModules = [ModerationTabKeys.Home, ModerationTabKeys.TalkingStick];
      setMainTabValue(tabs.findIndex((tab) => tab.key === ModerationTabKeys.TalkingStick));
      return setTabs((tabs) =>
        tabs.map((tab) => {
          if (enabledModules.includes(tab.key as ModerationTabKeys)) {
            return { ...tab, disabled: false };
          }
          return { ...tab, disabled: true };
        })
      );
    }

    const isTimerCoffee = timerStyle === TimerStyle.CoffeeBreak;
    const isTimerNormal = timerStyle === TimerStyle.Normal;

    return setTabs((tabs) =>
      tabs.map((tab) => {
        if (isTimerNormal && tab.key === ModerationTabKeys.CoffeeBreak) {
          return { ...tab, disabled: true };
        }
        if (isTimerCoffee && tab.key === ModerationTabKeys.Timer) {
          return { ...tab, disabled: true };
        }
        return { ...tab, disabled: false };
      })
    );
  }, [tabs, timerStyle, currentRoomMode]);

  useEffect(() => {
    setDisabledTabs();
  }, [timerStyle, currentRoomMode, filteredTabs]);

  return { tabs, mainTabValue, handleMainTabSelect };
};

export default useTabs;
