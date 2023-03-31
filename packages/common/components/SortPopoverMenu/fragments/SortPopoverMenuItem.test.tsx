// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SortPopoverMenuItem from "./SortPopoverMenuItem";

/**
 * Mocking react-i18next module as we don't care about actual
 * text in the snapshots, we only want to be sure that used key
 * is not going to change.
 */
jest.mock("react-i18next");

describe("<SortPopoverMenuItem />", () => {
  it("should render with required properties.", () => {
    expect(
      render(
        <SortPopoverMenuItem
          i18nKey="test-key"
          value="test-value"
          onSelect={jest.fn()}
        />
      )
    ).toMatchSnapshot();
  });

  it("should execute onSelect callback with value when clicked.", () => {
    const callback = jest.fn();
    render(
      <SortPopoverMenuItem
        i18nKey="test-key"
        value="test-value"
        onSelect={callback}
      />
    );
    const li = screen.getByRole('menuitem');
    fireEvent.click(li);
    expect(callback).toBeCalledWith('test-value');
  });
});
