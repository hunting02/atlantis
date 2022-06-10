import React from "react";
import renderer, { act } from "react-test-renderer";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { FormatFile } from ".";

afterEach(cleanup);

it("renders a FormatFile", () => {
  const testFile = {
    key: "123",
    name: "Funky Corn",
    type: "audio/ogg",
    size: 1024,
    progress: 1,
    src: () => Promise.resolve("https://audio/somesound.ogg"),
  };
  const tree = renderer.create(<FormatFile file={testFile} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders an image when provided as src", async done => {
  const url = "not_actually_a_url";
  const testFile = {
    key: "234",
    name: "Onion",
    type: "image/png",
    size: 102432,
    progress: 0.1,
    src: () => Promise.resolve(url),
  };

  const { queryByTestId } = render(<FormatFile file={testFile} />);

  await waitFor(() => {
    expect(queryByTestId("internalThumbnailImage")).not.toBeUndefined();
  });

  const internalThumbnailImage = queryByTestId("internalThumbnailImage");

  waitFor(() => {
    expect(internalThumbnailImage).toBeInstanceOf(HTMLImageElement);
    done();
  });
});

it("it should call the delete handler", async () => {
  const testFile = {
    key: "234",
    name: "TPS Reports",
    type: "application/pdf",
    size: 1022,
    progress: 1,
    src: () => Promise.resolve("https://nature/interesting-article.png"),
  };
  const deleteHandler = jest.fn();
  const { getByLabelText, getByText } = render(
    <body>
      <FormatFile onDelete={deleteHandler} file={testFile} />
    </body>,
  );

  act(() => {
    fireEvent.click(getByLabelText("Delete Thumbnail"));
  });

  await waitFor(() => {
    expect(
      getByText("Are you sure you want to delete this file?"),
    ).toBeInstanceOf(HTMLParagraphElement);
  });

  act(() => {
    fireEvent.click(getByText("Delete"));
  });

  expect(deleteHandler).toHaveBeenCalled();
});

describe("when the format file is a thumbnail", () => {
  describe("when the thumbnail is default sized", () => {
    it("renders a FormatFile as a default sized thumbnail", () => {
      const testFile = {
        key: "368",
        name: "Pink Dolphin",
        type: "image/png",
        src: () => Promise.resolve("https://source.unsplash.com/250x250"),
        size: 1024,
        progress: 1,
      };
      const tree = renderer
        .create(<FormatFile display="compact" file={testFile} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("when the thumbnail is large sized", () => {
    it("renders a FormatFile as a larget sized thumbnail", () => {
      const testFile = {
        key: "368",
        name: "Pink Dolphin",
        type: "image/png",
        src: () => Promise.resolve("https://source.unsplash.com/250x250"),
        size: 1024,
        progress: 1,
      };
      const tree = renderer
        .create(
          <FormatFile display="compact" displaySize="large" file={testFile} />,
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
