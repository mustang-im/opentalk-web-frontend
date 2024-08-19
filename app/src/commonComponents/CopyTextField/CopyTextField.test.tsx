// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen } from '../../utils/testUtils';
import CopyTextField, { LinkFieldProps } from './CopyTextField';

const DEFAULT_PROPS: LinkFieldProps = {
  label: 'copy-text-field-label',
  notificationText: '',
};

describe('CopyTextField', () => {
  it('can render', async () => {
    await render(<CopyTextField {...DEFAULT_PROPS} />);
    expect(screen.getByLabelText(DEFAULT_PROPS.label)).toBeInTheDocument();
  });

  it('renders spinner when loading', async () => {
    await render(<CopyTextField {...DEFAULT_PROPS} isLoading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
