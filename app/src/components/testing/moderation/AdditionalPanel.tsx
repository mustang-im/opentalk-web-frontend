import { AutomodSelectionStrategy } from '@opentalk/common';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}
type Settings = {
  timeLimit: { enabled: boolean; value: number };
  considerHandRaise: boolean;
  allowDoubleSelection: boolean;
  showList: boolean;
  selectionStrategy: AutomodSelectionStrategy;
  animationOnRandom: boolean;
};
interface AdditionalPanelProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}
export const AdditionalPanel = ({ settings, setSettings }: AdditionalPanelProps) => {
  const { t } = useTranslation();
  const selectionStrategyOptions = [];
  for (const selectionStrategy of enumKeys(AutomodSelectionStrategy)) {
    selectionStrategyOptions.push(
      <option key={AutomodSelectionStrategy[selectionStrategy]} value={AutomodSelectionStrategy[selectionStrategy]}>
        {t(AutomodSelectionStrategy[selectionStrategy])}
      </option>
    );
  }

  return (
    <>
      <h4>{t('automod-additional-tab-header')}</h4>
      <p>{t('automod-additional-tab-help')}</p>
      <div>
        <label>
          {t('automod-additional-time-limit')}{' '}
          <input
            type="checkbox"
            onChange={(value) => setSettings((s) => _.merge({}, s, { timeLimit: { enabled: value.target.checked } }))}
            checked={settings.timeLimit.enabled}
          />{' '}
          <input
            type="number"
            step="10"
            disabled={!settings.timeLimit.enabled}
            value={settings.timeLimit.value / 1000}
            onChange={(value) =>
              setSettings((s) => _.merge({}, s, { timeLimit: { value: parseFloat(value.target.value) * 1000 } }))
            }
          />
        </label>
      </div>
      <div>
        <label>
          {t('automod-additional-consider-raise-hand')}{' '}
          <input
            type="checkbox"
            onChange={(value) => setSettings((s) => _.merge({}, s, { considerHandRaise: value.target.checked }))}
            checked={settings.considerHandRaise}
          />
        </label>
      </div>
      <div>
        <label>
          {t('automod-additional-show-list')}{' '}
          <input
            type="checkbox"
            onChange={(value) => setSettings((s) => _.merge({}, s, { showList: value.target.checked }))}
            checked={settings.showList}
          />
        </label>
      </div>
      <div>
        <label>
          {t('automod-additional-allow-double-selection')}{' '}
          <input
            type="checkbox"
            onChange={(value) => setSettings((s) => _.merge({}, s, { allowDoubleSelection: value.target.checked }))}
            checked={settings.allowDoubleSelection}
          />
        </label>
      </div>
      <div>
        <label>
          {t('automod-additional-animation-on-random')}{' '}
          <input
            type="checkbox"
            onChange={(value) => setSettings((s) => _.merge({}, s, { animationOnRandom: value.target.checked }))}
            checked={settings.animationOnRandom}
          />
        </label>
      </div>
      <div>
        <label>
          {t('automod-additional-selection-strategy')}{' '}
          <select
            onChange={(value) =>
              setSettings((s) => _.merge({}, s, { selectionStrategy: value.target.value as AutomodSelectionStrategy }))
            }
            value={settings.selectionStrategy}
          >
            {selectionStrategyOptions}
          </select>
        </label>
      </div>
    </>
  );
};

export default AdditionalPanel;
