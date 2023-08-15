import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { DataList } from "@jobber/components/DataList";

export default {
  title: "Components/Category/DataList/Web",
  component: DataList,
  parameters: {
    viewMode: "story",
    previewTabs: { code: { hidden: false } },
  },
} as ComponentMeta<typeof DataList>;

const BasicTemplate: ComponentStory<typeof DataList> = args => (
  <DataList {...args} />
);

export const Basic = BasicTemplate.bind({});
Basic.args = {};
