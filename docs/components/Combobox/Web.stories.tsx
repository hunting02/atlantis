import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Combobox } from "@jobber/components/Combobox";

export default {
  title: "Components/Category/Combobox/Web",
  component: Combobox,
  parameters: {
    viewMode: "story",
    previewTabs: { code: { hidden: false } },
  },
} as ComponentMeta<typeof Combobox>;

const ComboboxButton: ComponentStory<typeof Combobox> = args => {
  return (
    <div>
      <Combobox
        {...args}
        onSelection={selection => {
          console.log(selection);
        }}
      >
        <Combobox.TriggerButton triggerLabel="Select a teammate" />
        <Combobox.Content
          options={[
            "Bilbo Baggins",
            "Frodo Baggins",
            "Pippin Took",
            "Merry Brandybuck",
            "Sam Gamgee",
            "Bilbo Baggins",
            "Frodo Baggins",
            "Pippin Took",
            "Merry Brandybuck",
            "Sam Gamgee",
            "Bilbo Baggins",
            "Frodo Baggins",
            "Pippin Took",
            "Merry Brandybuck",
            "Sam Gamgee",
          ]}
        >
          <Combobox.Action
            label="Add a teammate"
            onClick={() => {
              console.log("Action");
            }}
          />
          <Combobox.Action
            label="Manage teammates"
            onClick={() => {
              console.log("Action");
            }}
          />
        </Combobox.Content>
      </Combobox>
    </div>
  );
};

const ComboboxChip: ComponentStory<typeof Combobox> = args => {
  return (
    <div>
      <Combobox>
        <Combobox.TriggerChip triggerLabel="Select a tag" />
        <Combobox.Content
          options={[
            "Bilbo Baggins",
            "Frodo Baggins",
            "Pippin Took",
            "Merry Brandybuck",
            "Sam Gamgee",
          ]}
        >
          <Combobox.Action
            label="Add a teammate"
            onClick={() => {
              console.log("Action");
            }}
          />
          <Combobox.Action
            label="Manage teammates"
            onClick={() => {
              console.log("Action");
            }}
          />
        </Combobox.Content>
      </Combobox>
    </div>
  );
};

export const Button = ComboboxButton.bind({});
Button.args = {};

export const Chip = ComboboxChip.bind({});
Chip.args = {};
