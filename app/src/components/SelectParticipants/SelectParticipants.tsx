// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Chip, CircularProgress, InputAdornment, Stack, Typography } from '@mui/material';
import { CloseIcon, CopyIcon, SearchIcon } from '@opentalk/common';
import { Email, FindUserResponse, EventInvite } from '@opentalk/rest-api-rtk-query';
import { differenceBy, debounce } from 'lodash';
import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useGetMeQuery, useLazyFindUsersQuery } from '../../api/rest';
import TextField from '../../commonComponents/TextField';
import ParticipantAvatar from '../ParticipantAvatar';

export type EmailUser = {
  email: Email;
};

type SelectParticipantsProps = {
  label?: string;
  placeholder?: string;
  invitees?: Array<EventInvite>;
  resetSelected?: boolean;
  onChange: (selected: Array<FindUserResponse | EmailUser>) => void;
};

const Container = ({ children, title, testId }: { children: React.ReactNode; title: string; testId?: string }) => (
  <Stack direction={'column'} spacing={1} data-testid={testId ? testId : null}>
    <Typography variant={'caption'}>{title}</Typography>
    <Stack direction={'row'} gap={2} flexWrap="wrap">
      {children}
    </Stack>
  </Stack>
);

const SelectParticipants = ({
  onChange,
  label,
  placeholder,
  invitees = [],
  resetSelected,
}: SelectParticipantsProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Array<FindUserResponse | EmailUser>>([]);
  const { t } = useTranslation();
  const { myId } = useGetMeQuery(undefined, {
    selectFromResult: ({ data }) => ({
      myId: data?.email,
    }),
  });

  const [findUsers, { isLoading, foundUsers }] = useLazyFindUsersQuery({
    selectFromResult: ({ data, ...props }) => ({
      foundUsers: data?.filter((user) => user.email !== myId),
      ...props,
    }),
  });

  const debounceFindUsers = useCallback(
    debounce((inputValue: string) => {
      inputValue.length > 2 && findUsers({ q: inputValue });
    }, 250),
    []
  );

  const searchEntryHandler = useCallback((inputValue: string) => {
    setSearchValue(inputValue);
    debounceFindUsers(inputValue);
  }, []);

  useEffect(() => {
    onChange(selectedUsers);
  }, [onChange, selectedUsers]);

  useEffect(() => {
    resetSelected && setSelectedUsers([]);
  }, [resetSelected]);

  const addSelectedUser = useCallback((user: FindUserResponse | EmailUser) => {
    setSelectedUsers((selectedUsers) => [...selectedUsers, user]);
    setSearchValue('');
  }, []);

  const deleteSelectedUser = (user: FindUserResponse | EmailUser) => {
    const upUsers = selectedUsers.filter(
      (selectedUser: FindUserResponse | EmailUser) => selectedUser.email !== user.email
    );
    setSelectedUsers(upUsers);
  };

  const renderUserData = (user: FindUserResponse) => {
    if (typeof user.firstname === 'string') {
      return (
        <Stack>
          <Typography noWrap>
            {user.firstname} {user.lastname}
          </Typography>
          <Typography variant="caption" noWrap>
            {user.email}
          </Typography>
        </Stack>
      );
    }

    if (typeof user.email === 'string') {
      return (
        <Stack>
          <Typography variant="caption" noWrap>
            {user.email}
          </Typography>
        </Stack>
      );
    }
  };

  const renderFoundSuggestions = () => {
    const invitedUsers = invitees?.map((invited) => invited.profile) || [];
    const suggestedUsers = differenceBy(foundUsers, invitedUsers, selectedUsers, 'email');

    if (suggestedUsers.length === 0) {
      return;
    }
    if (searchValue.length <= 2) {
      return;
    }

    return (
      <Container title={t('dashboard-select-participants-label-suggestions')}>
        {suggestedUsers.map((user) => (
          <Stack
            data-testid={'SuggestedParticipant'}
            key={`${user.email}-suggested`}
            direction={'row'}
            spacing={1.5}
            onClick={() => addSelectedUser(user)}
            alignItems={'center'}
            sx={{ cursor: 'pointer' }}
          >
            <ParticipantAvatar src={user.avatarUrl}>{`${user.firstname} ${user.lastname}`}</ParticipantAvatar>
            {renderUserData(user)}
          </Stack>
        ))}
      </Container>
    );
  };

  const renderSuggestedEmail = () => {
    const schema = Yup.string().email();
    const isEmail = schema.isValidSync(searchValue);

    if (searchValue.length > 0 && isEmail) {
      const emailUser: EmailUser = {
        email: searchValue as Email,
      };

      return (
        <Container title={t('dashboard-select-participants-label-suggestions')}>
          <Stack
            data-testid={'SuggestedEmail'}
            direction={'row'}
            spacing={1.5}
            onClick={() => addSelectedUser(emailUser)}
            alignItems={'center'}
            sx={{ cursor: 'pointer' }}
          >
            <ParticipantAvatar specialCharacter="@" />
            <Typography noWrap>{searchValue}</Typography>
          </Stack>
        </Container>
      );
    }
  };

  const renderSelectedParticipants = () =>
    selectedUsers.length > 0 && (
      <Container title={t('dashboard-select-participants-label-added')}>
        {selectedUsers.map((selectedUser) => (
          <Chip
            key={`${selectedUser.email}-selected`}
            label={
              'firstname' in selectedUser ? `${selectedUser.firstname} ${selectedUser.lastname}` : selectedUser.email
            }
            avatar={
              'firstname' in selectedUser ? (
                <ParticipantAvatar src={selectedUser.avatarUrl} />
              ) : (
                <ParticipantAvatar specialCharacter="@" />
              )
            }
            onDelete={() => deleteSelectedUser(selectedUser)}
            deleteIcon={<CloseIcon data-testid={'SelectedParticipants-deleteButton'} />}
            data-testid={'SelectedParticipant'}
          />
        ))}
      </Container>
    );

  const renderInvitees = () =>
    invitees.length > 0 && (
      <Container title={t('dashboard-select-participants-label-invited')} testId={'InvitedParticipants'}>
        {invitees.map(({ profile: invitee }) => (
          <Chip
            key={`${invitee.email}-invitees`}
            label={renderUserData(invitee)}
            avatar={<ParticipantAvatar src={invitee.avatarUrl} />}
          />
        ))}
      </Container>
    );

  return (
    <Stack spacing={2} data-testid={'SelectParticipants'}>
      <TextField
        inputProps={{ 'data-testid': 'InputSearchUsers' }}
        onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          searchEntryHandler(event.target.value)
        }
        placeholder={placeholder}
        label={label}
        value={searchValue}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon aria-label={t('dashboard-select-participants-label-search')}>
              <CopyIcon />
            </SearchIcon>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
          </InputAdornment>
        }
        fullWidth
      />

      {renderInvitees()}

      {renderSelectedParticipants()}

      {renderFoundSuggestions()}

      {renderSuggestedEmail()}
    </Stack>
  );
};

export default SelectParticipants;
