import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import classnames from "classnames";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import { useOnKeyDown } from "@jobber/hooks/useOnKeyDown";
import { useRefocusOnActivator } from "@jobber/hooks/useRefocusOnActivator";
import { useFocusTrap } from "@jobber/hooks/useFocusTrap";
import styles from "./ComboboxContent.css";
import { Icon } from "../../../Icon";
import { Text } from "../../../Text";
import { ComboboxContext } from "../../ComboboxProvider";
import { ComboboxOption } from "../../Combobox.types";

interface ComboboxContentProps {
  /**
   * List of selectable options to display.
   */
  readonly options: ComboboxOption[];

  /**
   * Callback function invoked upon the selection of an option. Provides the selected option as an argument.
   */
  readonly onSelect: (selection: ComboboxOption) => void;

  /**
   * Optional action button(s) to display at the bottom of the list.
   */
  readonly children?: ReactElement | ReactElement[];

  /**
   * Placeholder text to display in the search input. Defaults to "Search".
   */
  readonly searchPlaceholder?: string;

  /**
   * pre selected option
   * @default ""
   * @type string
   */
  readonly selected: ComboboxOption | null;

  /**
   * The encapsulating noun for the content of the combobox. Used
   * in the empty state, and search placeholder. Should be pluralized.
   */
  readonly subjectNoun?: string;
}

export function ComboboxContent(props: ComboboxContentProps): JSX.Element {
  const optionsExist = props.options.length > 0;
  const {
    searchValue,
    setSearchValue,
    selectedElement,
    setSelectedElement,
    open,
    setOpen,
    popperRef,
    popperStyles,
    attributes,
    filteredOptions,
    optionsListRef,
  } = useComboboxContent(props.options);

  useComboboxAccessibility(
    open,
    handleSelection,
    popperRef,
    filteredOptions,
    optionsListRef,
    selectedElement,
  );

  const template = (
    <div
      ref={popperRef}
      id="ATL-Combobox-Content"
      data-testid="ATL-Combobox-Content"
      tabIndex={0}
      className={classnames(styles.content, !open && styles.hidden)}
      style={popperStyles.popper}
      {...attributes.popper}
    >
      <Search
        open={open}
        placeholder={props.subjectNoun}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <ul className={styles.optionsList} role="listbox" ref={optionsListRef}>
        {optionsExist &&
          filteredOptions.map(option => {
            const isSelected =
              option.id.toString() === props.selected?.id.toString();

            return (
              <li
                ref={listItem => {
                  if (isSelected) setSelectedElement(listItem);
                }}
                key={option.id}
                tabIndex={-1}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelection(option)}
                className={classnames(styles.option, {
                  [styles.selectedOption]: isSelected,
                })}
              >
                {option.label}
                {isSelected && <Icon name="checkmark" color="blue" />}
              </li>
            );
          })}

        {optionsExist && filteredOptions.length === 0 && (
          <div className={styles.filterMessage}>
            <Text variation="subdued">No results for {`“${searchValue}”`}</Text>
          </div>
        )}

        {!optionsExist && (
          <div className={styles.emptyStateMessage}>
            <Text variation="subdued">
              {getZeroIndexStateText(props.subjectNoun)}
            </Text>
          </div>
        )}
      </ul>

      {props.children && (
        <div className={styles.actions} role="group">
          {React.Children.toArray(props.children).map(
            (child, index, childrenArray) => (
              <div
                key={index}
                className={
                  index === childrenArray.length - 1 ? styles.actionPadding : ""
                }
              >
                {child}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );

  return ReactDOM.createPortal(template, document.body);

  function handleSelection(selection: ComboboxOption) {
    props.onSelect(selection);
    setSearchValue("");
    setOpen(false);
  }
}

function Search(props: {
  placeholder?: string;
  searchValue: string;
  open: boolean;
  setSearchValue: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.open) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 0);
    }
  }, [props.open]);

  return (
    <div className={styles.search}>
      <input
        type="search"
        ref={searchRef}
        className={styles.searchInput}
        placeholder={
          props.placeholder ? `Search ${props.placeholder}` : "Search"
        }
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleSearch(event)
        }
        value={props.searchValue}
      />

      {props.searchValue && (
        <button
          className={styles.clearSearch}
          onClick={clearSearch}
          data-testid="ATL-Combobox-Content-Search-Clear"
          aria-label="Clear search"
        >
          <Icon name="remove" size="small" />
        </button>
      )}
    </div>
  );

  function clearSearch() {
    props.setSearchValue("");
    searchRef.current?.focus();
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    props.setSearchValue(event.target.value);
  }
}

function getZeroIndexStateText(subjectNoun?: string) {
  if (subjectNoun) {
    return `You don't have any ${subjectNoun} yet`;
  }

  return "No options yet";
}

function useComboboxAccessibility(
  open: boolean,
  selectionCallback: (selection: ComboboxOption) => void,
  containerRef: React.RefObject<HTMLDivElement>,
  filteredOptions: ComboboxOption[],
  optionsListRef: React.RefObject<HTMLUListElement>,
  selectedElement: HTMLElement | null,
): void {
  const hasOptionsVisible = open && filteredOptions.length > 0;
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => setFocusedIndex(null), [open, filteredOptions.length]);

  useEffect(() => {
    if (open && selectedElement) {
      selectedElement?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [open, selectedElement]);

  useEffect(() => {
    if (open) {
      containerRef.current?.addEventListener("keydown", handleContentKeydown);
    }

    return () => {
      containerRef.current?.removeEventListener(
        "keydown",
        handleContentKeydown,
      );
    };
  }, [open, optionsListRef, focusedIndex, filteredOptions]);

  function handleContentKeydown(event: KeyboardEvent) {
    if (!hasOptionsVisible) return;

    if (event.key === "Enter" || event.key === " ") {
      const activeElementInList = optionsListRef.current?.contains(
        document.activeElement,
      );

      if (!activeElementInList) return;

      handleKeyboardSelection(event);
    }
    if (event.key === "ArrowDown") {
      handleKeyboardNavigation(event, 1);
    }
    if (event.key === "ArrowUp") {
      handleKeyboardNavigation(event, -1);
    }
  }

  function handleKeyboardNavigation(event: KeyboardEvent, indexChange: number) {
    const newIndex = focusedIndex === null ? 0 : focusedIndex + indexChange;

    if (newIndex < 0 || newIndex >= filteredOptions.length) return;

    const optionElement = optionsListRef.current?.children[
      newIndex
    ] as HTMLElement;

    optionElement?.focus();
    setFocusedIndex(newIndex);
    event.preventDefault();
    event.stopPropagation();
  }

  function handleKeyboardSelection(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (focusedIndex !== null) {
      selectionCallback(filteredOptions[focusedIndex]);
    }
  }
}

function useComboboxContent(options: ComboboxOption[]): {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  selectedElement: HTMLElement | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  open: boolean;
  setOpen: (open: boolean) => void;
  popperRef: React.RefObject<HTMLDivElement>;
  popperStyles: { [key: string]: React.CSSProperties };
  attributes: { [key: string]: { [key: string]: string } | undefined };
  filteredOptions: ComboboxOption[];
  optionsListRef: React.RefObject<HTMLUListElement>;
} {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null,
  );
  const { open, setOpen, wrapperRef } = React.useContext(ComboboxContext);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()),
  );

  useOnKeyDown(() => {
    if (open) {
      setOpen(false);
    }
  }, "Escape");

  useRefocusOnActivator(open);

  const optionsListRef = useRef<HTMLUListElement>(null);
  const popperRef = useFocusTrap<HTMLDivElement>(open);
  const { styles: popperStyles, attributes } = usePopper(
    wrapperRef.current,
    popperRef.current,
    {
      modifiers: [
        {
          name: "flip",
          options: {
            fallbackPlacements: ["top-start"],
          },
        },
      ],
      placement: "bottom-start",
    },
  );

  return {
    searchValue,
    setSearchValue,
    selectedElement,
    setSelectedElement,
    open,
    setOpen,
    popperRef,
    popperStyles,
    attributes,
    filteredOptions,
    optionsListRef,
  };
}
