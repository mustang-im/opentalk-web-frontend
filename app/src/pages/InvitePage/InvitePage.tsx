// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FetchRequestError, InviteCode } from '@opentalk/common';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import Error from '../../commonComponents/Error';
import SuspenseLoading from '../../commonComponents/SuspenseLoading';
import { useAppDispatch } from '../../hooks';
import { fetchRoomByInviteId, InviteRoomVerifyResponse } from '../../store/slices/roomSlice';

const InvitePage = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<FetchRequestError | undefined>();
  const { t } = useTranslation();
  const { inviteCode } = useParams<'inviteCode'>() as { inviteCode: InviteCode };
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRoomByInviteId(inviteCode))
      .unwrap()
      .then(({ roomId }: InviteRoomVerifyResponse) => {
        navigate(`/room/${roomId}`);
      })
      .catch((error: FetchRequestError) => setError(error));
  }, [dispatch, navigate, inviteCode]);

  if (error) {
    return <Error title={t('error-invite-link')} />;
  }

  return <SuspenseLoading />;
};

export default InvitePage;
