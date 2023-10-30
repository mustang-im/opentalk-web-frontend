// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Autocomplete,
  Chip,
  CircularProgress,
  InputAdornment,
  Stack,
  Typography,
  TextField,
  styled,
  UseAutocompleteProps,
} from '@mui/material';
import { CloseIcon, CopyIcon, ParticipantAvatar, SearchIcon, setLibravatarOptions } from '@opentalk/common';
import { EventInvite, User } from '@opentalk/rest-api-rtk-query';
import { differenceBy, debounce } from 'lodash';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetMeQuery, useLazyFindUsersQuery } from '../../api/rest';
import { useAppSelector } from '../../hooks';
import { selectLibravatarDefaultImage } from '../../store/slices/configSlice';
import { EmailStrategy } from './fragments/EmailStrategy';
import { ParticipantOption } from './fragments/ParticipantOption';
import { SuggestedUserStrategy } from './fragments/SuggestedUserStrategy';

type SelectParticipantsProps = {
  label?: string;
  placeholder?: string;
  invitees?: Array<EventInvite>;
  resetSelected?: boolean;
  onChange: (selected: Array<ParticipantOption>) => void;
  onRevokeUserInvite: (invitee: User) => void;
};

const Container = ({ children, title, testId }: { children: React.ReactNode; title: string; testId?: string }) => (
  <Stack direction={'column'} spacing={1} data-testid={testId ? testId : null}>
    <Typography variant={'caption'}>{title}</Typography>
    <Stack direction={'row'} gap={2} flexWrap="wrap">
      {children}
    </Stack>
  </Stack>
);

const AutocompleteTextField = styled(TextField)(({ theme }) => ({
  '.MuiInputBase-root': {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.secondary.dark,
    padding: theme.spacing(0.5),
    borderRadius: 0,
  },
  '& .MuiSvgIcon-root': {
    color: `${theme.palette.secondary.dark} !important`,
  },
  '& fieldset': {
    display: 'none',
  },
  '.MuiFormLabel-root': {
    fontSize: '1rem',
    transformOrigin: 'unset',
    position: 'relative',
    transform: 'unset',
    paddingBottom: theme.spacing(1.5),
  },
}));

const SelectParticipants = ({
  onChange,
  label,
  placeholder,
  invitees = [],
  resetSelected,
  onRevokeUserInvite,
}: SelectParticipantsProps) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Array<ParticipantOption>>([]);
  const avatarDefaultImage = useAppSelector(selectLibravatarDefaultImage);

  const { myEmail } = useGetMeQuery(undefined, {
    selectFromResult: ({ data }) => ({
      myEmail: data?.email,
    }),
  });

  const [findUsers, { isLoading, foundUsers }] = useLazyFindUsersQuery({
    selectFromResult: ({ data, ...props }) => ({
      foundUsers: data?.filter((user) => user.email !== myEmail),
      ...props,
    }),
  });

  const debounceFindUsers = useCallback(
    debounce((inputValue: string) => {
      inputValue.length > 2 && findUsers({ q: inputValue });
    }, 250),
    []
  );

  const suggestedParticipants: Array<{ firstname: string; lastname: string; email: string; avatarUrl?: string }> =
    useMemo(() => {
      if (isLoading || searchValue.length < 3) {
        return [];
      }
      const invitedUsers = invitees?.map((invited) => invited.profile) || [];
      return differenceBy(foundUsers, invitedUsers, selectedUsers, 'email').sort((a, b) => {
        const aName = `${a.firstname} ${a.lastname}`;
        const bName = `${b.firstname} ${b.lastname}`;
        return aName.localeCompare(bName);
      });
    }, [isLoading, foundUsers, selectedUsers, searchValue]);

  const searchEntryHandler = useCallback((inputValue: string) => {
    setSearchValue(inputValue);
    debounceFindUsers(inputValue);
  }, []);

  const getAvatarSrc = (url: string | undefined) => {
    return setLibravatarOptions(url, { defaultImage: avatarDefaultImage });
  };

  useEffect(() => {
    onChange(selectedUsers);
  }, [onChange, selectedUsers]);

  useEffect(() => {
    resetSelected && setSelectedUsers([]);
  }, [resetSelected]);

  const addSelectedUser = useCallback((user: ParticipantOption) => {
    if (user) {
      setSelectedUsers((selectedUsers) => [...selectedUsers, user]);
    }
    setSearchValue('');
  }, []);

  const deleteSelectedUser = (user: ParticipantOption) => {
    const upUsers = selectedUsers.filter((selectedUser: ParticipantOption) => selectedUser.email !== user.email);
    setSelectedUsers(upUsers);
  };

  const renderUserData = (user: { firstname?: string; email?: string; lastname?: string }) => {
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

  /**
   * Function that renders participants once they are
   * selected from the dropdown but not yet invited.
   */
  const renderSelectedParticipants = () =>
    selectedUsers.length > 0 && (
      <Container data-testid={'SelectedParticipant'} title={t('dashboard-select-participants-label-added')}>
        {selectedUsers.map((selectedUser) => (
          <Chip
            key={`${selectedUser.email}-selected`}
            label={
              'firstname' in selectedUser ? `${selectedUser.firstname} ${selectedUser.lastname}` : selectedUser.email
            }
            avatar={
              'firstname' in selectedUser ? (
                <ParticipantAvatar src={getAvatarSrc(selectedUser.avatarUrl)} />
              ) : (
                <ParticipantAvatar specialCharacter="@" />
              )
            }
            onDelete={() => deleteSelectedUser(selectedUser)}
            deleteIcon={<CloseIcon data-testid={'SelectedParticipants-deleteButton'} />}
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
            avatar={<ParticipantAvatar src={getAvatarSrc(invitee.avatarUrl)} />}
            deleteIcon={<CloseIcon data-testid={'InvitedParticipants-deleteButton'} />}
            onDelete={() => onRevokeUserInvite(invitee)}
          />
        ))}
      </Container>
    );

  const onAutocompleteChange: UseAutocompleteProps<ParticipantOption, undefined, undefined, undefined>['onChange'] = (
    _event,
    value
  ) => {
    if (value) {
      addSelectedUser(value);
    }
  };

  const onInputChange: UseAutocompleteProps<ParticipantOption, undefined, undefined, undefined>['onInputChange'] = (
    _event,
    value
  ) => {
    searchEntryHandler(value || '');
  };

  const emailSuggestion = useMemo(() => {
    if (
      !(
        selectedUsers.find((user) => user.email === searchValue) ||
        invitees.find((invitee) => invitee.profile.email === searchValue)
      )
    ) {
      return [{ email: searchValue }];
    }
    return [];
  }, [searchValue, selectedUsers, invitees]);

  return (
    <>
      <Autocomplete
        data-testid="SelectParticipants"
        options={
          suggestedParticipants.length
            ? (suggestedParticipants as ParticipantOption[])
            : (emailSuggestion as ParticipantOption[])
        }
        getOptionLabel={
          suggestedParticipants.length ? SuggestedUserStrategy.getOptionLabel : EmailStrategy.getOptionLabel
        }
        renderOption={
          suggestedParticipants.length
            ? SuggestedUserStrategy.renderOption(avatarDefaultImage)
            : EmailStrategy.renderOption(t('global-no-result'))
        }
        inputValue={searchValue || ''}
        value={null}
        clearOnEscape={true}
        onChange={onAutocompleteChange}
        onInputChange={onInputChange}
        noOptionsText={t('global-no-result')}
        loading={isLoading}
        open={!isLoading && (suggestedParticipants.length !== 0 || searchValue.length > 2)}
        renderInput={({ InputProps, ...params }) => (
          <AutocompleteTextField
            {...params}
            placeholder={placeholder}
            label={label}
            variant="outlined"
            InputProps={{
              ...InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon aria-label={t('dashboard-select-participants-label-search')}>
                    <CopyIcon />
                  </SearchIcon>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {isLoading ? <CircularProgress color="inherit" size={16} /> : null}
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <Stack mt={2} spacing={2}>
        {renderSelectedParticipants()}
        {renderInvitees()}
      </Stack>
    </>
  );
};

export default SelectParticipants;
