// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useAppSelector } from '../../../hooks';
import { selectOurUuid } from '../../../store/slices/userSlice';
import { LegalVoteId, LegalVoteType, ParticipantId } from '../../../types';
import { fireEvent, render, screen } from '../../../utils/testUtils';
import { LegalVoteContainer } from './LegalVoteContainer';

const mockDispatch = jest.fn();

jest.mock('../../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(),
  useDateFormat: () => '',
}));

jest.mock('../../../store/slices/userSlice', () => ({
  selectOurUuid: jest.fn(),
}));

jest.mock('./VoteResultTable', () => ({
  __esModule: true,
  default: () => <div data-testid="result-table"></div>,
}));

jest.mock('./VoteResultDate', () => ({
  __esModule: true,
  default: ({ showTableHint, showResultsHandler }: { showTableHint: boolean; showResultsHandler(): void }) =>
    showTableHint && <button onClick={showResultsHandler} data-testid="vote-result-date"></button>,
}));

describe('LegalVoteContainer', () => {
  const legalVote: LegalVoteType = {
    id: 'test-id' as LegalVoteId,
    state: 'active',
    startTime: new Date(Date.now()).toISOString(),
    votes: {
      yes: 0,
      no: 0,
      abstain: 0,
    },
    allowedParticipants: [],
    votedAt: null,
    votingRecord: {},
    localStartTime: '',
    name: 'Legal Vote Test',
    subtitle: 'Legal Vote Subtitle',
    topic: 'Legal Vote Topic',
    enableAbstain: false,
    autoClose: false,
    duration: 60,
    createPdf: false,
    kind: 'roll_call',
  };

  it('can render', async () => {
    await render(<LegalVoteContainer legalVote={legalVote} onClose={jest.fn()} isAllowedToVote />);
    expect(screen.getByText(legalVote.name)).toBeInTheDocument();
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    expect(screen.getByText(legalVote.subtitle!)).toBeInTheDocument();
    expect(screen.getByText(legalVote.topic)).toBeInTheDocument();
  });

  it('executes onClose callback when close button is clicked.', async () => {
    const onClose = jest.fn();
    await render(<LegalVoteContainer legalVote={legalVote} onClose={onClose} isAllowedToVote />);
    fireEvent.click(screen.getByLabelText('global-close-dialog'));
    expect(onClose).toBeCalled();
  });

  it('shows message to user who is not allowed to vote', async () => {
    const vote: LegalVoteType = {
      ...legalVote,
      allowedParticipants: ['our-id' as ParticipantId],
    };
    await render(<LegalVoteContainer legalVote={vote} onClose={jest.fn()} isAllowedToVote={false} />);
    expect(screen.getByText('legal-vote-not-selected')).toBeInTheDocument();
  });

  it('shows submit button to user who can place a vote', async () => {
    const mockedUuid = 'mocked-uuid';
    const vote: LegalVoteType = {
      ...legalVote,
      allowedParticipants: [mockedUuid as ParticipantId],
    };
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === selectOurUuid) {
        return mockedUuid;
      }
      return null;
    });
    await render(<LegalVoteContainer legalVote={vote} onClose={jest.fn()} isAllowedToVote />);
    expect(screen.getByText('global-submit')).toBeInTheDocument();
  });

  it('can show result table', async () => {
    const mockedUuid = 'mocked-uuid';
    const vote: LegalVoteType = {
      ...legalVote,
      kind: 'pseudonymous',
      state: 'finished',
      votedAt: new Date(Date.now()).toISOString(),
      votingRecord: {
        ['1' as ParticipantId]: 'yes',
        ['2' as ParticipantId]: 'no',
      },
      allowedParticipants: [mockedUuid as ParticipantId],
    };
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === selectOurUuid) {
        return mockedUuid;
      }
      return null;
    });
    await render(<LegalVoteContainer legalVote={vote} onClose={jest.fn()} isAllowedToVote />);
    fireEvent.click(screen.getByTestId('vote-result-date'));
    expect(screen.getByTestId('result-table')).toBeInTheDocument();
  });
});
