// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen } from '../../utils/testUtils';
import { mockStore } from '../../utils/testUtils';
import TalkingStickTabPanel from './TalkingStickTabPanel';

const NUMBER_OF_PARTICIPANTS = 2;
describe('<TalkingStickTabPanel />', () => {
  describe('automod inactive', () => {
    const { store } = mockStore(NUMBER_OF_PARTICIPANTS, { video: true, screen: true });

    it('should render a start button when automod', async () => {
      await render(<TalkingStickTabPanel />, store);

      const startButton = screen.queryByRole('button', { name: /global-start-now/ });

      expect(startButton).toBeInTheDocument();
    });
    it('should not render a skip speaker and stop button', async () => {
      await render(<TalkingStickTabPanel />, store);

      const skipSpeakerButton = screen.queryByRole('button', { name: /talking-stick-skip-speaker/ });
      const stopButton = screen.queryByRole('button', { name: /global-stop/ });

      expect(skipSpeakerButton).not.toBeInTheDocument();
      expect(stopButton).not.toBeInTheDocument();
    });
  });
  describe('automod active', () => {
    const { store } = mockStore(NUMBER_OF_PARTICIPANTS, {
      video: true,
      screen: true,
      automodActive: true,
    });

    it('should not render a start button', async () => {
      await render(<TalkingStickTabPanel />, store);

      const startButton = screen.queryByRole('button', { name: /global-start-now/ });

      expect(startButton).not.toBeInTheDocument();
    });
    it('should  render a skip speaker and stop button', async () => {
      await render(<TalkingStickTabPanel />, store);

      const skipSpeakerButton = screen.queryByRole('button', { name: /talking-stick-skip-speaker/ });
      const stopButton = screen.queryByRole('button', { name: /global-stop/ });

      expect(skipSpeakerButton).toBeInTheDocument();
      expect(stopButton).toBeInTheDocument();
    });
  });
});
