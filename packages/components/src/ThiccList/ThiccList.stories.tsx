import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentMeta } from "@storybook/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ThiccList as List } from "./ThiccList";

export default {
  title: "ThiccList",
  parameters: {
    viewMode: "story",
  },
  component: List,
} as ComponentMeta<typeof List>;

export const ThiccList = {
  render: () => <List />,
};
