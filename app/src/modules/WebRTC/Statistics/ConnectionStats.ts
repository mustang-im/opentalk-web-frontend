// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { maxBy, sumBy } from 'lodash';

import { CandidatePairState, CandidatePairStats } from './CandidatePairState';
import { InboundStreamState } from './InboundStreamState';
import { OutboundStreamState } from './OutboundStreamState';
import { MediaStats } from './StreamState';

export interface StreamStats extends MediaStats {
  type: 'inbound' | 'outbound';
  timestamp: number;
  bitRate?: number;
  packetRate?: number;
  packetLoss?: number;
  packetsDiscarded?: number;
  jitter?: number;
  roundTripTime?: number;
  retransmitRatio?: number;
}

export interface StatsEvent {
  connection: CandidatePairStats;
  inbound?: StreamStats;
  outbound?: StreamStats;
}

export default class ConnectionStats {
  private candidates: Record<string, CandidatePairState> = {};
  private inbound: Record<string, InboundStreamState> = {};
  private outbound: Record<string, OutboundStreamState> = {};

  constructor(reports: RTCStatsReport) {
    this.update(reports);
  }

  public update(reports: RTCStatsReport): StatsEvent {
    const activeCandidates: CandidatePairStats[] = [];
    const streams: StreamStats[] = [];

    for (const [id, report] of reports) {
      switch (report.type) {
        case 'inbound-rtp': {
          let remoteReport;
          if (report.remoteId) {
            remoteReport = reports.get(report.remoteId) as RTCRemoteOutboundRtpStreamStats;
            if (remoteReport?.type !== 'remote-outbound-rtp') {
              throw new Error(`RTCStats expected remote report`);
            }
          }
          const inbound = this.inbound[id];
          if (inbound === undefined) {
            this.inbound[id] = new InboundStreamState(report, remoteReport);
          } else {
            const rates = inbound.update(report, remoteReport);
            // TODO: remove when Safari and Edge are done
            /*
              console.debug(
                `RTP ${report.type} ${report.kind} bitrate:${formatBitRate(rates.bitRate)} ssrc:${report.ssrc} loss: ${(rates.packetLoss || 0) * 100}% jitter:${
                  rates.jitter
                })`,
                rates,
                report,
                remoteReport
              );
              */
            streams.push(rates);
          }
          break;
        }
        case 'outbound-rtp': {
          let remoteReport;
          if (report.remoteId) {
            remoteReport = reports.get(report.remoteId) as RTCRemoteInboundRtpStreamStats;
            if (remoteReport?.type !== 'remote-inbound-rtp') {
              throw new Error(`RTCStats expected remote report`);
            }
          }
          const outbound = this.outbound[id];
          if (outbound === undefined) {
            this.outbound[id] = new OutboundStreamState(report, remoteReport);
          } else {
            const rates = outbound.update(report, remoteReport);
            // TODO: remove when Safari and Edge are done
            /*
              console.debug(
                `RTPstats ${report.type} ${report.kind} ssrc:${report.ssrc} bitrate:${formatBitRate(
                  rates.bitRate
                )} RTT:${(rates?.roundTripTime || 0) * 1000}ms loss: ${((rates.packetLoss || 0) * 100).toFixed(
                  1
                )}% jitter:${((rates?.jitter || 0) * 1000).toFixed(1)}ms)`,
                rates,
                report,
                remoteReport
              );
              */
            streams.push(rates);
          }
          break;
        }
        case 'candidate-pair': {
          const candidates = this.candidates[id];
          if (candidates === undefined) {
            this.candidates[id] = new CandidatePairState(report);
          } else {
            const rates = candidates.update(report);
            // report.selected is deprecated but still in use in Firefox v97
            if (report.nominated && report.state === 'succeeded' && report.selected !== false) {
              /* TODO: remove when Safari and Edge are done
              let localCandidate = reports.get(report.localCandidateId);
              let remoteCandidate = reports.get(report.remoteCandidateId);
              let transport = reports.get(report.transportId);
              console.debug(`RTP ${report.type}`, rates, report, { localCandidate, remoteCandidate, transport });
              */
              activeCandidates.push(rates);
            }
          }
          break;
        }
        default:
          break;
      }
    }

    const connection: CandidatePairStats = activeCandidates.reduce(
      (acc, rates) => {
        const timestamp = Math.max(acc.timestamp, rates.timestamp || 0);
        const bitRateDown = (acc.bitRateDown || 0) + (rates.bitRateDown || 0);
        const bitRateUp = (acc.bitRateUp || 0) + (rates.bitRateUp || 0);
        const dataLoss = Math.max(acc.dataLoss || 0, rates.dataLoss || 0);
        const avgRTT = Math.max(acc.avgRTT || 0, rates.avgRTT || 0);
        return { bitRateUp, bitRateDown, dataLoss, avgRTT, timestamp };
      },
      { timestamp: 0 }
    );

    const aggregateStreams = (streams: StreamStats[], type: 'inbound' | 'outbound'): StreamStats | undefined => {
      const currentDirection = streams.filter((rates) => rates.type === type);
      return {
        timestamp: maxBy(currentDirection, 'timestamp')?.timestamp || 0,
        bitRate: sumBy(currentDirection, 'bitRate'),
        packetRate: sumBy(currentDirection, 'packetRate'),
        packetLoss: maxBy(currentDirection, 'packetLoss')?.packetLoss,
        frameRate: maxBy(currentDirection, 'frameRate')?.frameRate,
        jitter: maxBy(currentDirection, 'jitter')?.jitter,
        roundTripTime: maxBy(currentDirection, 'roundTripTime')?.roundTripTime,
        codingTime: sumBy(currentDirection, 'codingTime'),
        frameSkip: sumBy(currentDirection, 'frameSkip'),
        pictureLoss: sumBy(currentDirection, 'pictureLoss'),
        frameWidth: maxBy(currentDirection, 'frameWidth')?.frameWidth,
        frameHeight: maxBy(currentDirection, 'frameHeight')?.frameHeight,
        type,
      };
    };

    const inbound = aggregateStreams(streams, 'inbound');
    const outbound = aggregateStreams(streams, 'outbound');

    return { connection, inbound, outbound };
  }
}
