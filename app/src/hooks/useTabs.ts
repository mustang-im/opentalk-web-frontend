// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '.';
import { TimerStyle } from '../api/types/outgoing/timer';
import { ModerationTabKeys, Tab, tabs as initialTabs } from '../config/moderationTabs';
import { selectFeatures } from '../store/slices/configSlice';
import { selectTimerStyle } from '../store/slices/timerSlice';
import { useEnabledModules } from './enabledModules';

const useTabs = () => {
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [value, setValue] = useState<number>(0);
  const features = useAppSelector(selectFeatures);
  const enabledModules = useEnabledModules();
  const timerStyle = useAppSelector(selectTimerStyle);
  const handleTabSelect = useCallback((tabIndex: number) => setValue(tabIndex), [setValue]);

  useEffect(() => {
    // Only tabs with module key are conditional, otherwise they are always shown.
    const tabsFirstFilter = initialTabs.filter(
      (tab) =>
        tab.divider ||
        (tab.featureKey && features[tab.featureKey]) ||
        (tab.moduleKey ? enabledModules.has(tab.moduleKey) : false)
    );
    setFilteredTabs(tabsFirstFilter);
    setTabs(tabsFirstFilter);
    setValue(0);
  }, [enabledModules, features]);

  const setDisabledTabs = useCallback(() => {
    if (tabs.length === 0) {
      return;
    }

    if (!timerStyle) {
      setTabs(filteredTabs);
      return;
    }

    const isTimerCoffee = timerStyle === TimerStyle.CoffeeBreak;
    const isTimerNormal = timerStyle === TimerStyle.Normal;

    const mapTabs = tabs.map((tab) => {
      if (isTimerNormal && tab.key === ModerationTabKeys.CoffeeBreak) {
        return { ...tab, disabled: true };
      }
      if (isTimerCoffee && tab.key === ModerationTabKeys.Timer) {
        return { ...tab, disabled: true };
      }
      return tab;
    });

    setTabs(mapTabs);
  }, [tabs, timerStyle]);

  useEffect(() => {
    setDisabledTabs();
  }, [timerStyle, filteredTabs]);

  return { tabs, value, handleTabSelect };
};

export default useTabs;
