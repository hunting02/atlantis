import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { DataListObject } from "@jobber/components/DataList/DataList.types";
import {
  DataListContext,
  defaultValues,
} from "@jobber/components/DataList/context/DataListContext";
import { DataListItemActions } from "@jobber/components/DataList/components/DataListItemActions";
import { DataListLayoutActionsContext } from "@jobber/components/DataList/components/DataListLayoutActions/DataListLayoutContext";
import { DataListItemClickable } from "./DataListItemClickable";

const mockItemActionComponent = jest.fn<JSX.Element | undefined, []>(() => (
  <DataListItemActions />
));

const expectedItem = { id: 1 };
const mockActiveItem = jest.fn<DataListObject | undefined, []>(
  () => expectedItem,
);

const handleClick = jest.fn();

afterEach(() => {
  mockItemActionComponent.mockClear();
  mockActiveItem.mockClear();
  handleClick.mockClear();
});

const content = "Content";

describe("DataListItemClickable", () => {
  it("should render a div when the list item action doesn't have any prop", () => {
    renderComponent();
    expect(screen.getByText(content)).toBeInstanceOf(HTMLDivElement);
  });

  it("should render a div when the list item action doesn't exist", () => {
    mockItemActionComponent.mockReturnValueOnce(undefined);
    renderComponent();
    expect(screen.getByText(content)).toBeInstanceOf(HTMLDivElement);
  });

  it("should render a div when the active item doesn't exist", () => {
    mockActiveItem.mockReturnValueOnce(undefined);
    renderComponent();
    expect(screen.getByText(content)).toBeInstanceOf(HTMLDivElement);
  });

  it("should render a button when there's only an `onClick` prop", () => {
    mockItemActionComponent.mockReturnValueOnce(
      <DataListItemActions onClick={handleClick} />,
    );

    renderComponent();

    const target = screen.getByText(content);
    expect(target).toBeInstanceOf(HTMLButtonElement);

    userEvent.click(target);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(expectedItem);
  });

  describe("URL prop", () => {
    it("should render an `a` tag", () => {
      mockItemActionComponent.mockReturnValueOnce(
        <DataListItemActions url="jobber.com" />,
      );

      renderComponent();

      const target = screen.getByText(content);
      expect(target).toBeInstanceOf(HTMLAnchorElement);
      expect(target).toHaveAttribute("href", "jobber.com");

      userEvent.click(target);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should render an `a` tag with a callback url", () => {
      mockItemActionComponent.mockReturnValueOnce(
        <DataListItemActions url={item => `jobber.com/${item.id}`} />,
      );

      renderComponent();

      const target = screen.getByText(content);
      expect(target).toBeInstanceOf(HTMLAnchorElement);
      expect(target).toHaveAttribute("href", "jobber.com/1");
    });

    it("should still fire onClick if it exists", () => {
      mockItemActionComponent.mockReturnValueOnce(
        <DataListItemActions url="jobber.com" onClick={handleClick} />,
      );

      renderComponent();
      const target = screen.getByText(content);
      expect(target).toBeInstanceOf(HTMLAnchorElement);

      userEvent.click(target);
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(expectedItem);
    });
  });

  describe("To prop", () => {
    it("should render an `a` tag", () => {
      mockItemActionComponent.mockReturnValueOnce(
        <DataListItemActions to="/getjobber.com" />,
      );

      renderComponent();

      const target = screen.getByText(content);
      expect(target).toBeInstanceOf(HTMLAnchorElement);
      expect(target).toHaveAttribute("href", "/getjobber.com");

      userEvent.click(target);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should render an `a` tag with a callback url", () => {
      mockItemActionComponent.mockReturnValueOnce(
        <DataListItemActions to={item => `/getjobber.com/${item.id}`} />,
      );

      renderComponent();

      const target = screen.getByText(content);
      expect(target).toBeInstanceOf(HTMLAnchorElement);
      expect(target).toHaveAttribute("href", "/getjobber.com/1");
    });

    it("should still fire onClick if it exists", () => {
      mockItemActionComponent.mockReturnValueOnce(
        <DataListItemActions to="/getjobber.com" onClick={handleClick} />,
      );

      renderComponent();
      const target = screen.getByText(content);
      expect(target).toBeInstanceOf(HTMLAnchorElement);

      userEvent.click(target);
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(expectedItem);
    });
  });
});

function renderComponent() {
  return render(
    <BrowserRouter>
      <DataListContext.Provider
        value={{
          ...defaultValues,
          itemActionComponent: mockItemActionComponent(),
        }}
      >
        <DataListLayoutActionsContext.Provider
          value={{ activeItem: mockActiveItem() }}
        >
          <DataListItemClickable>{content}</DataListItemClickable>
        </DataListLayoutActionsContext.Provider>
      </DataListContext.Provider>
    </BrowserRouter>,
  );
}
