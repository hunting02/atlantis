import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import {
  COMBOBOX_REQUIRED_CHILDREN_ERROR_MESSAGE,
  COMBOBOX_TRIGGER_COUNT_ERROR_MESSAGE,
  Combobox,
} from "./Combobox";
import { ComboboxOption } from "./Combobox.types";

afterEach(cleanup);

describe("Combobox validation", () => {
  it("renders without error if the correct count and composition of elements are present", () => {
    expect(() => {
      render(
        <Combobox>
          <Combobox.TriggerButton label="Button" />
          <Combobox.Content
            options={[]}
            onSelect={jest.fn()}
            selected={null}
          ></Combobox.Content>
        </Combobox>,
      );
    }).not.toThrow();
  });

  it("throws an error if there is no Trigger element", () => {
    expect.assertions(1);
    let error;
    try {
      render(
        <Combobox>
          <Combobox.Content
            options={[]}
            onSelect={jest.fn()}
            selected={null}
          ></Combobox.Content>
        </Combobox>,
      );
    } catch (e) {
      error = e as Error;
    } finally {
      expect(error?.message).toBe(COMBOBOX_REQUIRED_CHILDREN_ERROR_MESSAGE);
    }
  });

  it("throws an error if there are multiple of the same Trigger element", () => {
    expect.assertions(1);
    let error;
    try {
      render(
        <Combobox>
          <Combobox.TriggerButton label="Button" />
          <Combobox.TriggerButton label="Button Again" />
          <Combobox.Content
            options={[]}
            onSelect={jest.fn()}
            selected={null}
          ></Combobox.Content>
        </Combobox>,
      );
    } catch (e) {
      error = e as Error;
    } finally {
      expect(error?.message).toBe(COMBOBOX_TRIGGER_COUNT_ERROR_MESSAGE);
    }
  });

  it("throws an error if there are multiple of various Trigger elements", () => {
    expect.assertions(1);
    let error;
    try {
      render(
        <Combobox>
          <Combobox.TriggerButton label="Button" />
          <Combobox.TriggerChip label="Chippy Chip" />
          <Combobox.Content
            options={[]}
            onSelect={jest.fn()}
            selected={null}
          ></Combobox.Content>
        </Combobox>,
      );
    } catch (e) {
      error = e as Error;
    } finally {
      expect(error?.message).toBe(COMBOBOX_TRIGGER_COUNT_ERROR_MESSAGE);
    }
  });

  it("throws an error if there is no Content element", () => {
    expect.assertions(1);
    let error;
    try {
      render(
        <Combobox>
          <Combobox.TriggerButton label="Button" />
        </Combobox>,
      );
    } catch (e) {
      error = e as Error;
    } finally {
      expect(error?.message).toBe(COMBOBOX_REQUIRED_CHILDREN_ERROR_MESSAGE);
    }
  });

  it("throws an error if there is neither a Content nor Trigger element", () => {
    expect.assertions(1);
    let error;
    try {
      render(
        <Combobox>
          <></>
        </Combobox>,
      );
    } catch (e) {
      error = e as Error;
    } finally {
      expect(error?.message).toBe(COMBOBOX_REQUIRED_CHILDREN_ERROR_MESSAGE);
    }
  });

  it("throws an error if there are multiple Trigger elements and no Content", () => {
    expect.assertions(1);
    let error;
    try {
      render(
        <Combobox>
          <Combobox.TriggerButton label="Button" />
          <Combobox.TriggerChip label="Chippy Chip" />
        </Combobox>,
      );
    } catch (e) {
      error = e as Error;
    } finally {
      expect(error?.message).toBe(COMBOBOX_TRIGGER_COUNT_ERROR_MESSAGE);
    }
  });
});

describe("ComboboxContent", () => {
  it("should not have the content visible by default", () => {
    const { getByTestId } = render(
      <Combobox>
        <Combobox.TriggerButton label="Button" />
        <Combobox.Content
          options={[]}
          onSelect={jest.fn()}
          selected={null}
        ></Combobox.Content>
      </Combobox>,
    );
    expect(getByTestId("ATL-Combobox-Content")).toHaveClass("hidden");
  });

  it("should close the content after opening and making a (single) selection", () => {
    const { getByTestId, getByText } = render(
      <Combobox>
        <Combobox.TriggerButton label="Click Me" />
        <Combobox.Content
          options={[
            { id: "1", label: "Bilbo Baggins" },
            { id: "2", label: "Frodo Baggins" },
          ]}
          onSelect={jest.fn()}
          selected={null}
        ></Combobox.Content>
      </Combobox>,
    );

    const button = getByText("Click Me");
    fireEvent.click(button);

    expect(getByTestId("ATL-Combobox-Content")).not.toHaveClass("hidden");

    const option = getByText("Bilbo Baggins");
    fireEvent.click(option);

    expect(getByTestId("ATL-Combobox-Content")).toHaveClass("hidden");
  });

  it("should close the content after opening and pressing ESC", () => {
    const { getByTestId, getByText } = render(
      <Combobox>
        <Combobox.TriggerButton label="Click Me" />
        <Combobox.Content
          options={[
            { id: "1", label: "Bilbo Baggins" },
            { id: "2", label: "Frodo Baggins" },
          ]}
          onSelect={jest.fn()}
          selected={null}
        ></Combobox.Content>
      </Combobox>,
    );

    const button = getByText("Click Me");
    fireEvent.click(button);

    expect(getByTestId("ATL-Combobox-Content")).not.toHaveClass("hidden");

    fireEvent.keyDown(button, { key: "Escape" });

    expect(getByTestId("ATL-Combobox-Content")).toHaveClass("hidden");
  });

  it("should close the content after opening and clicking outside the content", () => {
    const { getByTestId, getByText } = render(
      <Combobox>
        <Combobox.TriggerButton label="Click Me" />
        <Combobox.Content
          options={[
            { id: "1", label: "Bilbo Baggins" },
            { id: "2", label: "Frodo Baggins" },
          ]}
          onSelect={jest.fn()}
          selected={null}
        ></Combobox.Content>
      </Combobox>,
    );

    const button = getByText("Click Me");
    fireEvent.click(button);

    expect(getByTestId("ATL-Combobox-Content")).not.toHaveClass("hidden");

    const overlay = getByTestId("ATL-Combobox-Overlay");
    fireEvent.click(overlay);

    expect(getByTestId("ATL-Combobox-Content")).toHaveClass("hidden");
  });
});

describe("Combobox Search", () => {
  it("should focus search input after opening", async () => {
    const { getByPlaceholderText, getByText } = render(
      <Combobox>
        <Combobox.TriggerButton label="Click Me" />
        <Combobox.Content
          options={[
            { id: "1", label: "Bilbo Baggins" },
            { id: "2", label: "Frodo Baggins" },
          ]}
          onSelect={jest.fn()}
          selected={null}
        ></Combobox.Content>
      </Combobox>,
    );

    const button = getByText("Click Me");
    fireEvent.click(button);

    const searchInput = getByPlaceholderText("Search");

    await waitFor(() => {
      expect(searchInput).toHaveFocus();
    });
  });
});

describe("Combobox selected value", () => {
  it("has no selected option when a null selected value is passed", () => {
    const { getByText } = render(<ClearSelectionCombobox />);

    const option = getByText("Bilbo Baggins");
    const clearButton = getByText("Clear Selection");

    expect(option).toHaveClass("selectedOption");

    fireEvent.click(clearButton);
    fireEvent.click(getByText("Button"));
    expect(option).not.toHaveClass("selectedOption");
  });
  it("has a selected option when a selected id is passed as a number and option id is a string", () => {
    const { getByText } = render(
      <Combobox>
        <Combobox.TriggerButton label="Button" />
        <Combobox.Content
          options={[
            { id: "1", label: "Bilbo Baggins" },
            { id: "2", label: "Frodo Baggins" },
          ]}
          onSelect={jest.fn()}
          selected={{ id: 1, label: "Bilbo Baggins" }}
        ></Combobox.Content>
      </Combobox>,
    );
    const option = getByText("Bilbo Baggins");
    expect(option).toHaveClass("selectedOption");
  });

  it("has a selected option when a selected value is passed as the same type as the option id", () => {
    const { getByText } = render(
      <Combobox>
        <Combobox.TriggerButton label="Button" />
        <Combobox.Content
          options={[
            { id: 1, label: "Bilbo Baggins" },
            { id: 2, label: "Frodo Baggins" },
          ]}
          onSelect={jest.fn()}
          selected={{ id: 1, label: "Bilbo Baggins" }}
        ></Combobox.Content>
      </Combobox>,
    );
    const option = getByText("Bilbo Baggins");
    expect(option).toHaveClass("selectedOption");
  });
});

describe("Combobox Zero Index State", () => {
  describe("when no options exist and subjectNoun is provided", () => {
    it("should render the correct zero index state text", () => {
      const subjectNoun = "teammates";
      const { getByText } = render(
        <Combobox>
          <Combobox.TriggerButton label="Select a teammate" />
          <Combobox.Content
            options={[]}
            onSelect={jest.fn()}
            subjectNoun={subjectNoun}
            selected={null}
          />
        </Combobox>,
      );

      expect(getByText("You don't have any teammates yet")).toBeInTheDocument();
    });
  });

  describe("when no options exist and subjectNoun is not provided", () => {
    it("should render the default zero index state text", () => {
      const { getByText } = render(
        <Combobox>
          <Combobox.TriggerButton label="Select a tax rate" />
          <Combobox.Content options={[]} onSelect={jest.fn()} selected={null} />
        </Combobox>,
      );

      expect(getByText("No options yet")).toBeInTheDocument();
    });
  });

  describe("when options do exist", () => {
    it("should not render default zero index state text", () => {
      const { queryByText } = render(
        <Combobox>
          <Combobox.TriggerButton label="Select a tax rate" />
          <Combobox.Content
            options={[{ id: "1", label: "10%" }]}
            onSelect={jest.fn()}
            selected={null}
          />
        </Combobox>,
      );

      expect(queryByText("No options yet")).not.toBeInTheDocument();
    });
  });
});

function ClearSelectionCombobox() {
  const [selected, setSelected] = React.useState<ComboboxOption | null>({
    id: 1,
    label: "Bilbo Baggins",
  });

  return (
    <>
      <button onClick={() => setSelected(null)}>Clear Selection</button>
      <Combobox>
        <Combobox.TriggerButton label="Button" />
        <Combobox.Content
          options={[
            { id: "1", label: "Bilbo Baggins" },
            { id: "2", label: "Frodo Baggins" },
          ]}
          onSelect={jest.fn()}
          selected={selected}
        >
          <></>
        </Combobox.Content>
      </Combobox>
    </>
  );
}
