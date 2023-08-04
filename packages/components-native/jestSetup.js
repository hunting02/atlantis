jest.mock("./dist/src/hooks", () => {
  // console.warn("mocking hooks");
  const test = jest.requireActual("./dist/src/hooks");
  return { ...test, useIsScreenReaderEnabled: () => false };
});

jest.mock("./dist/src/Button/components/InternalButtonLoading", () => {
  // console.warn("mocking InternalButtonLoading");
  const ImageBackground = jest.requireActual("react-native");

  return {
    InternalButtonLoading: props => (
      <ImageBackground.ImageBackground {...props} testID="loadingImage" />
    ),
  };
});
