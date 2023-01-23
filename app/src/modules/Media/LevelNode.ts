// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

// see https://webaudio.github.io/web-audio-api/#vu-meter-mode

export interface SignalLevel {
  level: number;
  peak: number;
  clip: boolean;
}

const UPDATE_INTERVAL_60HZ = 16.67; //ms -> 60 Hz

class LevelNode extends AudioWorkletNode {
  private _updateIntervalInMS;
  private _level: SignalLevel = { level: -Infinity, peak: -Infinity, clip: false };

  static async loadWorklet(context: AudioContext) {
    await context.audioWorklet.addModule('/workers/vumeter-processor.js');
  }

  /**
   * Create a LevelNode
   *
   * @param context The parent AudioContext
   * @param updateIntervalInMS update interval in milliseconds; must be above 0
   */
  constructor(context: AudioContext, updateIntervalInMS: number = UPDATE_INTERVAL_60HZ) {
    super(context, 'level-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 1,
      processorOptions: {
        updateIntervalInMS: updateIntervalInMS,
      },
    });

    if (updateIntervalInMS <= 0) {
      throw new Error('updateInterval out of range');
    }
    this._updateIntervalInMS = updateIntervalInMS;

    this.port.onmessage = (event) => {
      if (event.data.level) this._level = event.data as SignalLevel;
    };
    this.port.start();
  }

  get updateInterval() {
    return this._updateIntervalInMS;
  }

  set updateInterval(updateIntervalInMS) {
    this._updateIntervalInMS = updateIntervalInMS;
    this.port.postMessage({ updateIntervalInMS: updateIntervalInMS });
  }

  close() {
    this.port.postMessage({ close: true });
  }
  get level() {
    return this._level;
  }
}

export default LevelNode;
