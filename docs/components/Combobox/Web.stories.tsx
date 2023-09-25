import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Combobox, ComboboxOption } from "@jobber/components/Combobox";
import { Button as ClearButton } from "@jobber/components/Button";

export default {
  title: "Components/Combobox/Combobox/Web",
  component: Combobox,
  parameters: {
    viewMode: "story",
    previewTabs: { code: { hidden: false } },
  },
} as ComponentMeta<typeof Combobox>;

const ComboboxButton: ComponentStory<typeof Combobox> = args => {
  const [selected, setSelected] = useState<ComboboxOption | null>(null);
  return (
    <Combobox {...args}>
      <Combobox.TriggerButton
        label="Select a teammate"
        variation="subtle"
        type="primary"
        icon="arrowDown"
        iconOnRight={true}
      />
      <Combobox.Content
        options={[
          { id: "1", label: "Bilbo Baggins" },
          { id: "2", label: "Frodo Baggins" },
          { id: "3", label: "Pippin Took" },
          { id: "4", label: "Merry Brandybuck" },
          { id: "5", label: "Sam Gamgee" },
          { id: "6", label: "Bilbo Baggins2" },
          { id: "7", label: "Frodo Baggins2" },
          { id: "8", label: "Pippin Took2" },
          { id: "9", label: "Merry Brandybuck2" },
          { id: "10", label: "Sam Gamgee2" },
          { id: "11", label: "Bilbo Baggins3" },
          { id: "12", label: "Frodo Baggins3" },
          { id: "13", label: "Pippin Took3" },
          { id: "14", label: "Merry Brandybuck3" },
          { id: "15", label: "Sam Gamgee3" },
        ]}
        onSelect={selection => {
          setSelected(selection);
        }}
        selected={selected}
      >
        <Combobox.Action
          label="Add Teammate"
          onClick={() => {
            alert("Added a new teammate ✅");
          }}
        />
        <Combobox.Action
          label="Manage Teammates"
          onClick={() => {
            alert("Managed teammates 👍");
          }}
        />
      </Combobox.Content>
    </Combobox>
  );
};

const ComboboxChip: ComponentStory<typeof Combobox> = args => {
  const [selected, setSelected] = useState<ComboboxOption | null>(null);
  return (
    <Combobox {...args}>
      <Combobox.TriggerChip label="Tags" />
      <Combobox.Content
        options={[
          { id: "1", label: "Bilbo Baggins" },
          { id: "2", label: "Frodo Baggins" },
          { id: "3", label: "Pippin Took" },
          { id: "4", label: "Merry Brandybuck" },
          { id: "5", label: "Sam Gamgee" },
        ]}
        onSelect={selection => {
          setSelected(selection);
        }}
        selected={selected}
      >
        <Combobox.Action
          label="Add Teammate"
          onClick={() => {
            alert("Added a new teammate ✅");
          }}
        />
        <Combobox.Action
          label="Manage Teammates"
          onClick={() => {
            alert("Managed teammates 👍");
          }}
        />
      </Combobox.Content>
    </Combobox>
  );
};

const ComboboxClearSelection: ComponentStory<typeof Combobox> = args => {
  const [selected, setSelected] = useState<ComboboxOption | null>({
    id: "1",
    label: "Bilbo Baggins",
  });

  return (
    <>
      <ClearButton
        label="Clear Selection"
        type="primary"
        onClick={() => setSelected(null)}
      />
      <Combobox {...args}>
        <Combobox.TriggerButton
          label="Select a teammate"
          variation="subtle"
          type="primary"
          icon="arrowDown"
          iconOnRight={true}
        />
        <Combobox.Content
          options={[
            { id: "1", label: "Bilbo Baggins" },
            { id: "2", label: "Frodo Baggins" },
            { id: "3", label: "Pippin Took" },
            { id: "4", label: "Merry Brandybuck" },
            { id: "5", label: "Sam Gamgee" },
            { id: "6", label: "Bilbo Baggins2" },
            { id: "7", label: "Frodo Baggins2" },
            { id: "8", label: "Pippin Took2" },
            { id: "9", label: "Merry Brandybuck2" },
            { id: "10", label: "Sam Gamgee2" },
            { id: "11", label: "Bilbo Baggins3" },
            { id: "12", label: "Frodo Baggins3" },
            { id: "13", label: "Pippin Took3" },
            { id: "14", label: "Merry Brandybuck3" },
            { id: "15", label: "Sam Gamgee3" },
          ]}
          onSelect={selection => {
            setSelected(selection);
          }}
          selected={selected}
        >
          <Combobox.Action
            label="Add Teammate"
            onClick={() => {
              alert("Added a new teammate ✅");
            }}
          />
          <Combobox.Action
            label="Manage Teammates"
            onClick={() => {
              alert("Managed teammates 👍");
            }}
          />
        </Combobox.Content>
      </Combobox>
    </>
  );
};

export const Button = ComboboxButton.bind({});
Button.args = {};

export const Chip = ComboboxChip.bind({});
Chip.args = {};

export const ClearSelection = ComboboxClearSelection.bind({});
ClearSelection.args = {};
