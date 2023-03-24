// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { getSentences } from './stringUtils';

describe('should split text in sentences', () => {
  test('split sentences separated by periods', () => {
    const text = 'First sentence. Second sentence.';
    expect(getSentences(text)).toEqual(['First sentence.', 'Second sentence.']);
  });
  test('split sentences separated by question mark and exclamation mark', () => {
    const text = 'First sentence! Second sentence?';
    expect(getSentences(text)).toEqual(['First sentence!', 'Second sentence?']);
  });
  test('do not split sentences separated by comma', () => {
    const text = 'First sentence, second sentence.';
    expect(getSentences(text)).toEqual(['First sentence, second sentence.']);
  });
  test('handle empty text', () => {
    const text = '';
    expect(getSentences(text)).toEqual(['']);
  });
  test('return empty string on whitespace', () => {
    const text = ' ';
    expect(getSentences(text)).toEqual(['']);
  });
});
