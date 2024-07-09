// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { shuffle } from 'lodash';

export const spliceIntoChunks = <T>(array: Array<T>, splitSize: number): Array<T[]> => {
  const chunkedArray: Array<T[]> = [];
  const chunkSize = Math.floor(array.length / splitSize);
  while (array.length > 0) {
    const chunk = array.length - chunkSize >= chunkSize ? array.splice(0, chunkSize) : array.splice(0);
    chunkedArray.push(chunk);
  }
  return chunkedArray;
};
/**
 * Creates an array of shuffled values, using a version of the Fisher-Yates shuffle.
 * Facade of Lodash `shuffle` method.
 *
 * The fisher-yates algorithm that lodash is using is the fast running
 * variation based on the random values. This algorithm has time complexity of O(nlogn)
 * but is not guaranteed to return
 */
export function shuffleArrayItems<T>(array: Array<T>): Array<T> {
  const shuffled = shuffle(array);
  if (shuffled.every((value, index) => value === array[index])) {
    return shuffleArrayItems(array);
  }
  return shuffled;
}
