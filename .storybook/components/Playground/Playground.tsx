import React from "react";
import { Story, useStorybookApi, useStorybookState } from "@storybook/api";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { Args } from "@storybook/addons";
import "./Playground.css";

export function Playground() {
  const sbState = useStorybookState();
  const sbAPI = useStorybookApi();
  const activeStory = sbAPI.getCurrentStoryData() as Story;

  if (!activeStory) return <></>;

  console.log("sbState", sbState);
  console.log("activeStory", activeStory);

  const importsString = activeStory.parameters?.playground?.imports;
  const canPreview = Boolean(importsString);

  return (
    <SandpackProvider
      template="react-ts"
      customSetup={{
        dependencies: {
          "@jobber/components": "*",
        },
      }}
      options={{
        visibleFiles: ["/Example.tsx"],
        activeFile: "/Example.tsx",
      }}
      theme="dark"
      files={{
        "/App.tsx": getAppJsCode(),
        "/Example.tsx": getExampleJsCode(),
      }}
    >
      {canPreview && <SandpackPreview />}
      <SandpackCodeEditor
        showLineNumbers={true}
        showInlineErrors={true}
        readOnly={!canPreview}
      />
    </SandpackProvider>
  );

  function getExampleJsCode(): string {
    const exampleComponent = `export function Example() {
  return ${getSourceCode(activeStory)}
}`;
    return [importsString, exampleComponent].filter(Boolean).join("\n\n");
  }
}

function getSourceCode(story: Story) {
  const parameters = story?.parameters;

  if (parameters && "storySource" in parameters) {
    const rawSourceCode = parameters.storySource.source;
    const sourceCodeArr = RegExp("<((.*|\\n)*)>", "m").exec(rawSourceCode);
    const { attributes, args } = getAttributeProps(story);

    return sourceCodeArr?.[0]
      .replace(" {...args}", attributes)
      .replace("{args.children}", args?.children);
  }
}

function getAttributeProps(story: Story) {
  let args: Args | undefined;
  let attributes = "";

  if ("args" in story && story.args) {
    args = story.args;
    const argsKeys = Object.keys(args);

    attributes = argsKeys.reduce((currentArgs, arg) => {
      if (arg === "children") return currentArgs;
      const rawArgValue = args?.[arg];
      const argValue =
        typeof rawArgValue === "string"
          ? `"${rawArgValue}"`
          : `{${rawArgValue}}`;
      return [currentArgs, ` ${arg}=${argValue}`].join("");
    }, "");
  }

  return { attributes, args };
}

function getAppJsCode(): string {
  return `import "@jobber/design/foundation.css";
import { Example } from "./Example";

export default function App() {
  return <Example />
}`;
}
