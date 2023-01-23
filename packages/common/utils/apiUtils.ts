// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { DefaultAvatarImage } from '../types';

type LibravatarOptions = {
  size?: number;
  defaultImage?: DefaultAvatarImage;
};

/**
 * Add defaultImage parameter to a libravatarUrl
 *
 * @param url A libravatarUrl
 * @param options Options to modify the libravartUrl defaultImage = d in the documentation https://wiki.libravatar.org/api/
 */
export const addParameterToLibravatarUrl = (
  url: string,
  { size = 512, defaultImage = 'robohash' }: LibravatarOptions
) => {
  return `${url}?d=${defaultImage}&s=${size}`;
};
