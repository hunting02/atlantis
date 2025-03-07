import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Disclosure } from "@jobber/components-native";

export default {
  title: "Components/Layouts and Structure/Disclosure/Mobile",
  component: Disclosure,
  parameters: {
    viewMode: "story",
    previewTabs: { code: { hidden: false } },
    viewport: { defaultViewport: "mobile1" },
    showNativeOnWebDisclaimer: true,
  },
} as ComponentMeta<typeof Disclosure>;

const BasicTemplate: ComponentStory<typeof Disclosure> = args => {
  const [open, setOpen] = useState(false);
  return <Disclosure {...args} open={open} onToggle={() => setOpen(!open)} />;
};

export const Basic = BasicTemplate.bind({});
Basic.args = {
  header: "Advanced Instructions",
  content: "For every 2 team members you add, your profits will triple.",
  isEmpty: false,
};
