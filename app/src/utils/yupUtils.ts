// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import * as yup from 'yup';
import { RequiredStringSchema } from 'yup/lib/string';
import { AnyObject, Maybe } from 'yup/lib/types';

yup.addMethod<yup.StringSchema>(yup.string, 'maxBytes', function (maxBytes: number, message?: string) {
  return this.test('maxBytes', message || '', function (value) {
    const { path, createError } = this;

    const valueByteLenght = new TextEncoder().encode(value).length;
    const remainingCharacters = maxBytes - valueByteLenght;

    if (remainingCharacters < 0) {
      return createError({ path, message });
    }

    return true;
  });
});

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    maxBytes(maxBytes: number, message?: string): RequiredStringSchema<undefined, TContext>;
  }
}

export default yup;
