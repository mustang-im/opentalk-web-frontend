// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FormikProps } from 'formik';
import { get } from 'lodash';
import * as React from 'react';

type Primitive = string | number | null | undefined;
interface IFormikCommonPropsReturnValue {
  name: string;
  onChange: {
    (e: React.ChangeEvent<HTMLInputElement>): void;
    <T_1 = string | React.ChangeEvent<HTMLInputElement>>(
      field: T_1
    ): T_1 extends React.ChangeEvent<HTMLInputElement>
      ? void
      : (e: string | React.ChangeEvent<HTMLInputElement>) => void;
  };
  onBlur: {
    (e: React.FocusEvent<HTMLInputElement>): void;
    <T = HTMLInputElement>(fieldOrEvent: T): T extends string ? (e: HTMLInputElement) => void : void;
  };
  error?: boolean;
  helperText?: string;
}

interface IFormikPropsReturnValue extends IFormikCommonPropsReturnValue {
  value: string | undefined;
}

export interface IFormikSwitchPropsReturnValue extends IFormikCommonPropsReturnValue {
  checked: boolean;
}

export interface IFormikDateTimePickerPropsReturnValue extends IFormikCommonPropsReturnValue {
  value: string | number;
  setFieldValue: (field: string, value: Primitive, shouldValidate?: boolean) => void;
}

export interface IFormikCustomFieldPropsReturnDurationValue extends IFormikCommonPropsReturnValue {
  value: number | null;
  setFieldValue: (field: string, value: Primitive, shouldValidate?: boolean) => void;
}

export interface IFormikRatingPropsReturnValue extends IFormikCommonPropsReturnValue {
  value: number | null | undefined;
}

export function formikMinimalProps<Values>(fieldName: string, formik: FormikProps<Values>): IFormikPropsReturnValue {
  const { values, handleBlur, handleChange } = formik;

  return {
    name: fieldName,
    onChange: handleChange,
    onBlur: handleBlur,
    value: get(values, fieldName) ?? '',
  };
}

export function formikProps<Values>(fieldName: string, formik: FormikProps<Values>): IFormikPropsReturnValue {
  const { values, handleBlur, handleChange, errors } = formik;
  const errorMessage = get(errors, fieldName);
  const hasError = Boolean(errorMessage);

  return {
    name: fieldName,
    onChange: handleChange,
    onBlur: handleBlur,
    value: get(values, fieldName) ?? '',
    error: hasError,
    helperText: (hasError && (errorMessage as string)) || undefined,
  };
}

export function formikSwitchProps<Values>(
  fieldName: string,
  formik: FormikProps<Values>
): IFormikSwitchPropsReturnValue {
  const { values, handleBlur, handleChange, errors } = formik;

  const errorMessage = get(errors, fieldName);
  const hasError = Boolean(errorMessage);

  return {
    name: fieldName,
    onChange: handleChange,
    onBlur: handleBlur,
    checked: get(values, fieldName) ?? false,
    error: hasError,
    helperText: (hasError && (errorMessage as string)) || undefined,
  };
}

export function formikDateTimePickerProps<Values>(
  fieldName: string,
  formik: FormikProps<Values>
): IFormikDateTimePickerPropsReturnValue {
  const { values, handleBlur, handleChange, errors, setFieldValue } = formik;

  const errorMessage = get(errors, fieldName);
  const hasError = Boolean(errorMessage);

  return {
    name: fieldName,
    value: get(values, fieldName) ?? '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: hasError,
    helperText: (hasError && (errorMessage as string)) || undefined,
    setFieldValue,
  };
}

export function formikRatingProps<Values>(
  fieldName: string,
  formik: FormikProps<Values>
): IFormikRatingPropsReturnValue {
  const { values, handleBlur, handleChange, errors } = formik;

  const errorMessage = get(errors, fieldName);
  const hasError = Boolean(errorMessage);

  return {
    name: fieldName,
    onChange: handleChange,
    onBlur: handleBlur,
    error: hasError,
    value: parseInt(get(values, fieldName) ?? 0),
    helperText: (hasError && (errorMessage as string)) || undefined,
  };
}

export function formikGetValue<Values>(fieldName: string, formik: FormikProps<Values>, defaultValue = '') {
  const { values } = formik;
  return get(values, fieldName, defaultValue);
}

export function formikDurationFieldProps<Values>(
  fieldName: string,
  formik: FormikProps<Values>,
  /**
   * Duration value in minutes
   *
   * Default: 1
   */
  defaultValue?: number
): IFormikCustomFieldPropsReturnDurationValue {
  const { setFieldValue, values, handleBlur, handleChange, errors } = formik;

  const errorMessage = get(errors, fieldName);
  const hasError = Boolean(errorMessage);

  return {
    name: fieldName,
    setFieldValue: setFieldValue,
    onChange: handleChange,
    onBlur: handleBlur,
    error: hasError,
    value: get(values, fieldName, defaultValue ?? 1) as number,
    helperText: (hasError && (errorMessage as string)) || undefined,
  };
}
