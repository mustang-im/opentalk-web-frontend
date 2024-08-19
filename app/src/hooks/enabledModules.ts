// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BackendFeatures, Modules } from '@opentalk/rest-api-rtk-query';
import { useMemo } from 'react';

import { useAppSelector } from '.';
import { selectEnabledModules, selectModules } from '../store/slices/configSlice';

export function useEnabledModules() {
  const enabledModules = useAppSelector(selectEnabledModules);

  return useMemo(() => {
    return new Set(enabledModules);
  }, [enabledModules]);
}

export function isFeatureInModulesPredicate(featureKey: BackendFeatures, modules: Modules) {
  return Object.values(modules).some((module) => module?.features.includes(featureKey));
}

export function useIsFeatureEnabledInConference(featureKey: BackendFeatures) {
  const modules = useAppSelector(selectModules);

  return isFeatureInModulesPredicate(featureKey, modules);
}
