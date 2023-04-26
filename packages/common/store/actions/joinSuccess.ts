// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createAction } from "@reduxjs/toolkit";
import { JoinSuccessOutgoing } from "../../types";

export const joinSuccess = createAction<JoinSuccessOutgoing>('signaling/control/join_success');