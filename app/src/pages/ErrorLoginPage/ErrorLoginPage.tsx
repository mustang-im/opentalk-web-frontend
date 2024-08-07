// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Error from '../../components/Error';
import { useAppDispatch } from '../../hooks';
import { hangUp } from '../../store/commonActions';

interface ErrorLoginProps {
  error: Error;
}

const ErrorLoginPage = ({ error }: ErrorLoginProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hangUp());
  }, [dispatch]);

  return <Error isCrashError title={t(`${error.name}`)} description={t(`${error.message}`)} />;
};

export default ErrorLoginPage;
