// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { isEmpty } from 'lodash';

/**
 * Return the initials split by whitespace or before any number
 * @param name
 * @param length optional parameter to define the max amount of letters
 * @returns
 */
export const getInitials = (name: string, length?: number) => {
  if (isEmpty(name)) {
    return '';
  }
  const matches = Array.from(name.matchAll(/(?:(\p{Letter}+)(?=[0-9]|$|\s+)|([0-9]+)(?=\p{Letter}+|$|\s+))/gmu));
  return matches
    .flatMap((regex_array) => regex_array.slice(1))
    .filter((s) => s !== undefined)
    .map((s) => parseInt(s) || s)
    .map((s) => (typeof s === 'number' ? s : s[0].toUpperCase()))
    .slice(0, length)
    .join('');
};

export const deriveErrorString = (error: string) => {
  return `joinform-${error.replaceAll('_', '-')}`;
};

export const getEnumKey = <T>(enumType: Record<string, T>, value: T) => {
  const index = Object.values(enumType).indexOf(value);
  return Object.keys(enumType)[index];
};

/**
 * Split text into sentences. Sentences can be separated by '.', '?' or '!' charracters.
 * A whitespace at the beggining of a sentence will be removed.
 * 
 * Note: We can switch to `Intl.Segment` instead as soon as Firefox will get support for it.
 * 
 * @param {string} text - original text
 * @returns {Array<string>} 
 */
export const getSentences = (text: string): Array<string> => {
  const segments = text.split(/(?=[.?!])|(?<=[.?!])/g);
  const sentencesJoinedWithTheirSeparators = new Array<string>;
  segments.forEach((segment) => {
    const sentencesIndex = sentencesJoinedWithTheirSeparators.length;
    // If segment is a separator, add it to the corresponding sentence
    if (segment.match(/(?=[.?!])/) && sentencesIndex > 0) {
      const sentence = sentencesJoinedWithTheirSeparators[sentencesIndex-1]
      const sentenceWithItsSeparator = sentence.concat(segment);
      sentencesJoinedWithTheirSeparators[sentencesIndex-1] = sentenceWithItsSeparator
    } else {
      let sentence = segment;
      // Remove the whitespace at the beginning
      if(segment.startsWith(' ')){
        sentence = segment.slice(1)
      }
      sentencesJoinedWithTheirSeparators.push(sentence);
    }
  });

  return sentencesJoinedWithTheirSeparators;
};
