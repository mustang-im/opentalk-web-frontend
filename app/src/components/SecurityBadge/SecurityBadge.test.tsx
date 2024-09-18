// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import userEvent from '@testing-library/user-event';

import { ParticipationKind } from '../../types';
import { screen, render, act, mockStore } from '../../utils/testUtils';
import SecurityBadge from './SecurityBadge';

const NUMBER_OF_PARTICIPANTS = 2;
describe('<SecurityBadge />', () => {
  it('should show secure connection popover on hover', async () => {
    const { store } = mockStore(NUMBER_OF_PARTICIPANTS, {});
    await render(<SecurityBadge />, store);

    const secureIcon = screen.getByLabelText('secure-connection-icon');
    expect(secureIcon).toBeInTheDocument();
    expect(screen.queryByText('secure-connection-message')).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.hover(secureIcon);
    });
    expect(screen.getByText('secure-connection-message')).toBeInTheDocument();

    await act(async () => {
      await userEvent.unhover(secureIcon);
    });
    expect(screen.queryByText('secure-connection-message')).not.toBeInTheDocument();
  });
  it('should show the guest participant popover message when a guest is present', async () => {
    const { store } = mockStore(NUMBER_OF_PARTICIPANTS, { participantKinds: [ParticipationKind.Guest] });
    await render(<SecurityBadge />, store);

    const secureIcon = screen.getByLabelText('secure-connection-icon');
    expect(secureIcon).toBeInTheDocument();
    expect(screen.queryByText('secure-connection-message')).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.hover(secureIcon);
    });
    expect(screen.getByText('secure-connection-guests')).toBeInTheDocument();

    await act(async () => {
      await userEvent.unhover(secureIcon);
    });
    expect(screen.queryByText('secure-connection-guests')).not.toBeInTheDocument();
  });
  it('should show the sip participant popover message when a sip user is present', async () => {
    const { store } = mockStore(NUMBER_OF_PARTICIPANTS, { participantKinds: [ParticipationKind.Sip] });
    await render(<SecurityBadge />, store);

    const secureIcon = screen.getByLabelText('secure-connection-icon');
    expect(secureIcon).toBeInTheDocument();
    expect(screen.queryByText('secure-connection-message')).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.hover(secureIcon);
    });
    expect(screen.getByText('secure-connection-sip')).toBeInTheDocument();
    expect(screen.queryByText('secure-connection-guests')).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.unhover(secureIcon);
    });
    expect(screen.queryByText('secure-connection-sip')).not.toBeInTheDocument();
  });
  it('should show the mixed popover message when a sip user and a guest user is present', async () => {
    const { store } = mockStore(NUMBER_OF_PARTICIPANTS, {
      participantKinds: [ParticipationKind.Sip, ParticipationKind.Guest],
    });
    await render(<SecurityBadge />, store);

    const secureIcon = screen.getByLabelText('secure-connection-icon');
    expect(secureIcon).toBeInTheDocument();
    expect(screen.queryByText('secure-connection-message')).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.hover(secureIcon);
    });
    expect(screen.getByText('secure-connection-contaminated')).toBeInTheDocument();
    expect(screen.queryByText('secure-connection-guests')).not.toBeInTheDocument();
    expect(screen.queryByText('secure-connection-sip')).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.unhover(secureIcon);
    });
    expect(screen.queryByText('secure-connection-contaminated')).not.toBeInTheDocument();
  });
});
