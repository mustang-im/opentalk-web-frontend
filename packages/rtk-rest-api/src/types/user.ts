// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Email, UserId } from './common';

// FIXME: This needs an overhaul after we added all ne new settings related endpoints
// Request Bodies

/**
 * Modifies the own user
 *
 * RequestBody for PATCH /me
 */
export type UpdateMePayload = {
  title?: string;
  theme?: string;
  language?: string;
  displayName?: string;
  conferenceTheme?: string;
  dashboardTheme?: string;
};

// Response Objects

type UserFindType = {
  kind?: 'unregistered' | 'registered';
};

/**
 * Public User information
 *
 * Part of other embedded responses that reference a user.
 * E.g. GET /events
 */
export type User = {
  id: UserId;
  displayName: string;
  email: Email;
  title: string;
  firstname: string;
  lastname: string;
  avatarUrl?: string;
};

type RegisteredUser = User & UserFindType;
type UnregisteredUser = {
  email: Email;
  title: string;
  firstname: string;
  lastname: string;
  avatarUrl?: string;
} & UserFindType;

/**
 * Public User information
 *
 * Part of other embedded responses that reference a user.
 * GET /users/find?q=
 */
export type FindUserResponse = RegisteredUser | UnregisteredUser;

/**
 * Private User Information
 *
 * Usually retrieved by calling GET /me
 */
export type UserMe = {
  id: UserId;
  displayName: string;
  email: Email;
  title: string;
  firstname: string;
  lastname: string;
  conferenceTheme: string;
  dashboardTheme: string;
  language: string;
  avatarUrl?: string;
};
