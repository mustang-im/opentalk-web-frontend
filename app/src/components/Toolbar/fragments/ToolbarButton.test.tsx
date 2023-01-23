// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MicOnIcon } from '@opentalk/common';

import { render, screen, cleanup, fireEvent } from '../../../utils/testUtils';
import ToolbarButton from './ToolbarButton';

describe('<ToolbarButton />', () => {
  afterEach(() => cleanup());
  const handleClick = jest.fn();

  const ToolbarButtonProps = {
    hasContext: true,
    contextDisabled: false,
    tooltipTitle: 'tooltipTitleTest',
    disabled: false,
    active: false,
    onClick: jest.fn(),
    openMenu: jest.fn(),
    children: <MicOnIcon data-testid="toolbarChildrenTest" />,
    isLobby: false,
  };

  test('render ToolbarButton component', () => {
    render(<ToolbarButton {...ToolbarButtonProps} ariaLabelText="ariaLabelTextTest" />);
    expect(screen.getByTestId('toolbarButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarToggleButton')).toBeInTheDocument();
    expect(screen.getByLabelText('ariaLabelTextTest')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarChildrenTest')).toBeInTheDocument();
    expect(screen.getByLabelText('tooltipTitleTest')).toBeInTheDocument();
  });

  test('render ToolbarButton without context & ariaLabelText', () => {
    render(<ToolbarButton {...ToolbarButtonProps} hasContext={false} />);
    expect(screen.getByTestId('toolbarButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarChildrenTest')).toBeInTheDocument();
    expect(screen.queryByTestId('toolbarToggleButton')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('ariaLabelTextTest')).not.toBeInTheDocument();
  });

  test('testing click on ToolbarButton', () => {
    render(<ToolbarButton {...ToolbarButtonProps} onClick={handleClick} />);
    const button = screen.getByTestId('toolbarButton');

    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('testing click on disabled ToolbarButton', () => {
    render(<ToolbarButton {...ToolbarButtonProps} openMenu={handleClick} disabled />);
    const button = screen.getByTestId('toolbarButton');

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('testing click on ToggleToolbarButton', () => {
    render(<ToolbarButton {...ToolbarButtonProps} openMenu={handleClick} />);
    const toggleButton = screen.getByTestId('toolbarToggleButton');

    expect(toggleButton).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
