// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen } from '../../../utils/testUtils';
import VoteResultCountRow from './VoteResultCountRow';

describe('VoteResultCountRow', () => {
  it('can render', async () => {
    await render(<VoteResultCountRow total={10} />, undefined, {
      wrapper: ({ children }) => (
        <table>
          <tbody>{children}</tbody>
        </table>
      ),
    });
    expect(screen.getByText(10)).toBeInTheDocument();
  });
});
