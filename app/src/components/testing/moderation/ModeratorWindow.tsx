import { Tab, Tabs, Box } from '@mui/material';
import { AutomodSelectionStrategy, MilliSeconds, ParticipantId } from '@opentalk/common';
import { WheelOfNamesIcon, RaiseHandOnIcon, WoolBallIcon, TimerIcon } from '@opentalk/common';
import _ from 'lodash';
import React, { useState } from 'react';

import automod from '../../../api/types/outgoing/automod';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectModerationActive, selectParameters, selectSelectionMode } from '../../../store/slices/moderationSlice';
import TabPanel from '../../ui/TabPanel';
import AdditionalPanel from './AdditionalPanel';
import AllowListPanel from './AllowListPanel';
import PlaylistPanel from './PlaylistPanel';
import PresetCard from './PresetCard';

enum Preset {
  Playlist = 'Playlist',
  WheelOfNames = 'Random',
  Off = 'Off',
  Wool = 'Wool',
}
// Not sure where we want to store these presets. Possibility to get them via the backend in the future.
const presets_settings: Record<
  Preset,
  {
    selectionStrategy: AutomodSelectionStrategy;
    considerHandRaise: boolean;
    showList: boolean;
    allowDoubleSelection: boolean;
    timeLimit: boolean | number;
    animationOnRandom: boolean;
  }
> = {
  Playlist: {
    selectionStrategy: AutomodSelectionStrategy.Playlist,
    considerHandRaise: true,
    showList: true,
    allowDoubleSelection: false,
    timeLimit: false,
    animationOnRandom: false,
  },
  Random: {
    selectionStrategy: AutomodSelectionStrategy.Random,
    considerHandRaise: false,
    showList: true,
    allowDoubleSelection: false,
    timeLimit: false,
    animationOnRandom: true,
  },
  Wool: {
    selectionStrategy: AutomodSelectionStrategy.Nomination,
    considerHandRaise: false,
    showList: false,
    allowDoubleSelection: false,
    timeLimit: 3000,
    animationOnRandom: false,
  },
  Off: {
    selectionStrategy: AutomodSelectionStrategy.None,
    considerHandRaise: false,
    showList: true,
    allowDoubleSelection: false,
    timeLimit: false,
    animationOnRandom: false,
  },
};

const ModerationWindow = () => {
  const dispatch = useAppDispatch();
  const moderationActive = useAppSelector(selectModerationActive);
  const moderationParameters = useAppSelector(selectParameters);
  const moderationStrategy = useAppSelector(selectSelectionMode);

  const [preset, setPreset] = useState<Preset | undefined>();
  // Not a fan of this, get current running settings or else default.
  type State = {
    timeLimit: { enabled: boolean; value: number };
    considerHandRaise: boolean;
    allowDoubleSelection: boolean;
    showList: boolean;
    selectionStrategy: AutomodSelectionStrategy;
    animationOnRandom: boolean;
  };

  const [settings, setSettings] = useState<State>({
    timeLimit: moderationParameters?.timeLimit
      ? { enabled: true, value: moderationParameters.timeLimit }
      : { enabled: false, value: 3000 },
    considerHandRaise: moderationParameters?.considerHandRaise || false,
    allowDoubleSelection: moderationParameters?.allowDoubleSelection || false,
    showList: moderationParameters?.showList || false,
    selectionStrategy: moderationStrategy || AutomodSelectionStrategy.None,
    animationOnRandom: moderationParameters?.animationOnRandom || false,
  });

  const [allowList, setAllowList] = useState<ParticipantId[]>([]);
  const [playlist, setPlaylist] = useState<ParticipantId[]>([]);

  const [tab, setTab] = useState<number | string>('allowlist');

  // Merge the Preset into the settings
  const setPresetSettings = (preset: Preset) => {
    setSettings((s) => _.merge({}, s, { considerHandRaise: presets_settings[preset].considerHandRaise }));
    setSettings((s) =>
      _.merge({}, s, {
        timeLimit: {
          enabled: presets_settings[preset].timeLimit !== false,
          value:
            typeof presets_settings[preset].timeLimit === 'number'
              ? (presets_settings[preset].timeLimit as number)
              : 3000,
        },
      })
    );
    setSettings((s) => _.merge({}, s, { showList: presets_settings[preset].showList }));
    setSettings((s) => _.merge({}, s, { allowDoubleSelection: presets_settings[preset].allowDoubleSelection }));
    setSettings((s) => _.merge({}, s, { selectionStrategy: presets_settings[preset].selectionStrategy }));
    setSettings((s) => _.merge({}, s, { animationOnRandom: presets_settings[preset].animationOnRandom }));
  };
  if (moderationActive || preset) {
    return (
      <>
        <button onClick={() => setPreset(undefined)} title="Back">
          {'<<'}
        </button>
        <Tabs onChange={(e, v) => setTab(v)} value={tab} variant="fullWidth">
          <Tab label="Allowlist" value="allowlist" />
          <Tab label="Playlist" value="playlist" />
          <Tab label="Additional" value="additional" />
        </Tabs>
        <TabPanel value={tab} index="allowlist">
          <AllowListPanel allowList={allowList} setAllowList={setAllowList} />
        </TabPanel>
        <TabPanel value={tab} index="playlist">
          <PlaylistPanel playlist={playlist} setPlaylist={setPlaylist} />
        </TabPanel>
        <TabPanel value={tab} index="additional">
          <AdditionalPanel settings={settings} setSettings={setSettings} />
        </TabPanel>
        <button
          disabled={moderationActive}
          onClick={() => {
            dispatch(
              automod.actions.start.action({
                allowList,
                playlist,
                ...settings,
                timeLimit: settings.timeLimit.enabled ? (settings.timeLimit.value as MilliSeconds) : undefined,
              })
            );
          }}
        >
          Start moderation
        </button>
        <button
          disabled={!moderationActive}
          onClick={() => {
            dispatch(
              automod.actions.edit.action({
                allowList,
                playlist,
              })
            );
          }}
        >
          Edit
        </button>
        <button
          disabled={!moderationActive}
          onClick={() => {
            dispatch(automod.actions.stop.action({}));
          }}
        >
          Stop moderation
        </button>
        <button
          disabled={!moderationActive}
          onClick={() => {
            dispatch(automod.actions.select.action({ how: 'random' }));
          }}
        >
          Draw random speaker
        </button>
        <button
          disabled={!moderationActive}
          onClick={() => {
            dispatch(automod.actions.select.action({ how: 'next' }));
          }}
        >
          Select next speaker
        </button>
      </>
    );
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between">
        <PresetCard
          active={preset === Preset.Off}
          onClick={() => {
            setPreset(Preset.Off);
            setPresetSettings(Preset.Off);
          }}
          icon={<TimerIcon />}
          label="Off"
        />
        <PresetCard
          active={preset === Preset.Playlist}
          onClick={() => {
            setPreset(Preset.Playlist);
            setPresetSettings(Preset.Playlist);
          }}
          icon={<RaiseHandOnIcon />}
          label="Playlist with Handraise"
        />
        <PresetCard
          active={preset === Preset.WheelOfNames}
          onClick={() => {
            setPreset(Preset.WheelOfNames);
            setPresetSettings(Preset.WheelOfNames);
          }}
          icon={<WheelOfNamesIcon />}
          label="WheelOfNames (kindof)"
        />
        <PresetCard
          active={preset === Preset.Wool}
          onClick={() => {
            setPreset(Preset.Wool);
            setPresetSettings(Preset.Wool);
          }}
          icon={<WoolBallIcon />}
          label="Wool"
        />
      </Box>
    </div>
  );
};

export default ModerationWindow;
