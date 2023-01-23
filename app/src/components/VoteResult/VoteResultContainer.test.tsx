import { ChoiceId, PollId } from '@opentalk/common';
import { LegalVoteType } from '@opentalk/components';

import { render, screen, createStore, cleanup, fireEvent, waitFor, mockedParticipant } from '../../utils/testUtils';
import VoteResultContainer, { Vote } from './VoteResultContainer';

const choiseId = 987 as ChoiceId;
const testId = 'vote_testid_$)(*&%*' as PollId;
const testName = 'vote_test_name';
const testTopic = 'vote_test_topic';
const participants = [...Array(5)].map((_, index) => mockedParticipant(index));
const allowedParticipants = participants
  .filter((participant) => participant.id !== participants[4].id)
  .map((participant) => participant.id);

const votesData: Vote | LegalVoteType = {
  id: testId,
  state: 'active',
  name: testName,
  topic: testTopic,
  votes: { yes: 1, no: 2, abstain: 1 },
  voted: true,
  voters: {
    [participants[0].id]: 'yes',
    [participants[1].id]: 'no',
    [participants[2].id]: 'abstain',
    [participants[3].id]: 'no',
  },
  results: [{ id: choiseId, count: 4 }],
  enableAbstain: true,
  allowedParticipants: [...allowedParticipants],
};

describe('VoteResultContainer', () => {
  afterEach(() => cleanup());
  const { store, dispatch } = createStore({
    initialState: {
      poll: {
        activeVote: testId,
        currentShownVote: testId,
        votes: {
          ids: [testId],
          entities: { [testId]: { ...votesData } },
        },
      },
      user: {
        uuid: participants[3].id,
        ...participants[3],
      },
    },
  });

  test('render VoteResultContainer component without crashing', async () => {
    await render(<VoteResultContainer legalVoteId={testId} />, store);

    expect(screen.getByText(testName)).toBeInTheDocument();
    expect(screen.getByText(testTopic)).toBeInTheDocument();
    expect(screen.getByText('legal-vote-success')).toBeInTheDocument();

    expect(screen.getByRole('checkbox', { name: 'legal-vote-yes-label' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'legal-vote-no-label' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'legal-vote-abstain-label' })).toBeInTheDocument();
    expect(screen.queryByText('legal-vote-not-selected')).not.toBeInTheDocument();
    expect(screen.getByLabelText('close-vote-results')).toBeInTheDocument();
  });

  test('render VoteResultContainer component without crashing with enableAbstain = false, should not display checkboxAbstain', async () => {
    const { store } = createStore({
      initialState: {
        poll: {
          activeVote: testId,
          currentShownVote: testId,
          votes: {
            ids: [testId],
            entities: { [testId]: { ...votesData, enableAbstain: false } },
          },
        },
      },
    });

    await render(<VoteResultContainer legalVoteId={testId} />, store);

    const checkboxYes = screen.getByRole('checkbox', { name: 'legal-vote-yes-label' });
    const checkboxNo = screen.getByRole('checkbox', { name: 'legal-vote-no-label' });
    const checkboxAbstain = screen.queryByRole('checkbox', { name: 'legal-vote-abstain-label' });

    expect(checkboxYes).toBeInTheDocument();
    expect(checkboxNo).toBeInTheDocument();
    expect(checkboxAbstain).not.toBeInTheDocument();
  });

  test('click on vote checkbox should dispatch action signaling/legal_vote/vote with selected option', async () => {
    await render(<VoteResultContainer legalVoteId={testId} />, store);

    const checkboxYes = screen.getByRole('checkbox', { name: 'legal-vote-yes-label' });
    const checkboxNo = screen.getByRole('checkbox', { name: 'legal-vote-no-label' });
    const checkboxAbstain = screen.getByRole('checkbox', { name: 'legal-vote-abstain-label' });

    expect(checkboxYes).toBeInTheDocument();
    expect(checkboxYes).not.toBeChecked();

    expect(checkboxNo).toBeInTheDocument();
    expect(checkboxNo).not.toBeChecked();

    expect(checkboxAbstain).toBeInTheDocument();
    expect(checkboxAbstain).not.toBeChecked();

    fireEvent.click(checkboxYes);
    expect(checkboxYes).toBeChecked();
    expect(checkboxNo).not.toBeChecked();
    expect(checkboxAbstain).not.toBeChecked();

    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([
        { payload: { legalVoteId: testId, option: 'yes' }, type: 'signaling/legal_vote/vote' },
      ]);
    });

    fireEvent.click(checkboxNo);
    expect(checkboxNo).toBeChecked();
    expect(checkboxAbstain).not.toBeChecked();

    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([
        { payload: { legalVoteId: testId, option: 'no' }, type: 'signaling/legal_vote/vote' },
      ]);
    });

    fireEvent.click(checkboxAbstain);
    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([
        { payload: { legalVoteId: testId, option: 'abstain' }, type: 'signaling/legal_vote/vote' },
      ]);
    });
    expect(checkboxAbstain).toBeChecked();
  });

  test('should display proper percentages of vote result and on mouse over field should show additional info for users votes', async () => {
    await render(<VoteResultContainer legalVoteId={testId} />, store);

    const checkboxYes = screen.getByRole('checkbox', { name: 'legal-vote-yes-label' });
    const checkboxNo = screen.getByRole('checkbox', { name: 'legal-vote-no-label' });

    await fireEvent.mouseOver(checkboxYes);
    await waitFor(() => {
      expect(screen.getByText('25.0% 1 / 4')).toBeInTheDocument();
    });

    await fireEvent.mouseOver(checkboxNo);
    await waitFor(() => {
      expect(screen.getByText('50.0% 2 / 4')).toBeInTheDocument();
    });
  });

  test("if user didn't vote, legal-vote-success message should not be rendered", async () => {
    const { store } = createStore({
      initialState: {
        poll: {
          activeVote: testId,
          currentShownVote: testId,
          votes: {
            ids: [testId],
            entities: { [testId]: { ...votesData, voted: false } },
          },
        },
      },
    });

    await render(<VoteResultContainer legalVoteId={testId} />, store);

    expect(screen.getByText(testName)).toBeInTheDocument();
    expect(screen.getByText(testTopic)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'legal-vote-yes-label' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'legal-vote-no-label' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'legal-vote-abstain-label' })).toBeInTheDocument();

    expect(screen.queryByText('legal-vote-success')).not.toBeInTheDocument();
  });

  test('if user is not in the allowedParticipants array, should see info title and checkboxes are disabled so he can not vote', async () => {
    const { store } = createStore({
      initialState: {
        poll: {
          activeVote: testId,
          currentShownVote: testId,
          votes: {
            ids: [testId],
            entities: { [testId]: { ...votesData } },
          },
        },
        user: {
          uuid: participants[4].id,
          ...participants[4],
        },
      },
    });

    await render(<VoteResultContainer legalVoteId={testId} />, store);

    const checkboxYes = screen.getByRole('checkbox', { name: 'legal-vote-yes-label' });
    const checkboxNo = screen.getByRole('checkbox', { name: 'legal-vote-no-label' });
    const checkboxAbstain = screen.getByRole('checkbox', { name: 'legal-vote-abstain-label' });

    expect(screen.getByText('legal-vote-not-selected')).toBeInTheDocument();

    expect(checkboxYes).toBeInTheDocument();
    expect(checkboxNo).toBeInTheDocument();
    expect(checkboxAbstain).toBeInTheDocument();

    expect(checkboxYes).toBeDisabled();
    expect(checkboxNo).toBeDisabled();
    expect(checkboxAbstain).toBeDisabled();
  });
});
