// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CommonTextField } from '../../commonComponents';
import { render, screen, configureStore } from '../../utils/testUtils';
import SelfTest from './SelfTest';

describe('SelfTest', () => {
  const { store } = configureStore();

  test('render SelfTest component without crashing', async () => {
    await render(
      <SelfTest>
        <CommonTextField label="label" color="secondary" placeholder="global-name-placeholder" />
      </SelfTest>,
      store
    );

    expect(screen.getByText('selftest-body')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('global-name-placeholder')).toBeInTheDocument();

    expect(screen.getByLabelText('speed-meter-button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'speed-meter-button' })).toBeInTheDocument();

    expect(screen.getByTestId('toolbarAudioButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarVideoButton')).toBeInTheDocument();
    expect(screen.queryByTestId('toolbarBlurScreenButton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('toolbarHandraiseButton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('toolbarMenuButton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('toolbarEndCallButton')).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'conference-quick-start-open' })).toBeInTheDocument();
  });
  test('render SelfTest header as h2', async () => {
    await render(
      <SelfTest>
        <CommonTextField label="label" color="secondary" placeholder="global-name-placeholder" />
      </SelfTest>,
      store
    );
    const headerElement = screen.getByText('selftest-header');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement.tagName).toBe('H2');
  });
  test('render room title as h1', async () => {
    const title = 'room title';
    await render(
      <SelfTest title={title}>
        <CommonTextField label="label" color="secondary" placeholder="global-name-placeholder" />
      </SelfTest>,
      store
    );
    const titleElement = screen.getByText('joinform-room-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe('H1');
  });
});
