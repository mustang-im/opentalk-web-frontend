// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Participant } from '../../../types';

type ListableParticipantProps = 'id' | 'displayName' | 'avatarUrl' | 'joinedAt';
export type ListableParticipant = Pick<Participant, ListableParticipantProps>;
