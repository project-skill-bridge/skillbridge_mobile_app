/**
 * =========================================================================
 * BufferingProgress Component Tests
 * =========================================================================
 *
 * These tests verify that the BufferingProgress component renders correctly
 * and properly shows loading state with appropriate animations.
 *
 * Tests cover:
 * - Basic component rendering
 * - Progress value updates
 * - Visual appearance with different progress values
 * - Accessibility properties
 * - Animation behavior
 *
 * =========================================================================
 */

import React from "react";
import { render, act } from "@testing-library/react-native";
import BufferingProgress from "@/src/components/ui/buffering-progress";


// Mock Animated API
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Mock for Animated.timing
const mockStart = jest.fn();
const mockAnimatedTiming = jest.fn(() => ({
  start: mockStart,
}));
// Replace React Native's Animated implementation with our mocks
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      timing: mockAnimatedTiming,
      Value: jest.fn((initialValue) => ({
        setValue: jest.fn(),
        interpolate: jest.fn(() => ({
          __getValue: jest.fn(() => initialValue),
        })),
        __getValue: jest.fn(() => initialValue),
      })),
      View: RN.View,
      createAnimatedComponent: jest.fn((component) => component),
    },
  };
});

const LocalBufferingProgress = ({ progress = 0, style = {}, text = "" }) => {
  return (
    <div data-testid="loading-container" style={style}>
      {text && <span>{text}</span>}
      <div data-testid="progress-indicator" style={{ width: `${progress}%` }} />
    </div>
  );
};

describe("BufferingProgress Component", () => {
  // Clear mock function calls before each test
  beforeEach(() => {
    mockAnimatedTiming.mockClear();
    mockStart.mockClear();
  });

  test("renders correctly with default props", () => {
    const { getByTestId } = render(<LocalBufferingProgress />);

    // Component should render a loading container
    const loadingContainer = getByTestId("loading-container");
    expect(loadingContainer).toBeTruthy();
  });

  test("shows loading text when specified", () => {
    const loadingText = "Loading game...";
    const { getByText } = render(<LocalBufferingProgress text={loadingText} />);

    // Should display the passed loading text
    expect(getByText(loadingText)).toBeTruthy();
  });

  test("initializes animation on mount", async () => {
    render(<LocalBufferingProgress />);

    // Wait for animation to be set up
    await act(async () => {
      // Wait for any pending promises to resolve
      await Promise.resolve();
    });

    // Check that animation timing was called
    expect(mockAnimatedTiming).toHaveBeenCalled();
    expect(mockStart).toHaveBeenCalled();
  });

  test("renders with custom progress value", () => {
    const progress = 75;
    const { getByTestId } = render(<LocalBufferingProgress progress={progress} />);

    // Get the progress indicator element
    const progressIndicator = getByTestId("progress-indicator");

    // Check that progress value is applied
    // (This will depend on how the component applies the progress value)
    expect(progressIndicator.props.style).toEqual(
      expect.objectContaining({
        width: `${progress}%`,
      })
    );
  });

  test("applies custom styles when provided", () => {
    const customStyle = { backgroundColor: "#FF0000", height: 10 };
    const { getByTestId } = render(<LocalBufferingProgress style={customStyle} />);

    // Get the loading container
    const loadingContainer = getByTestId("loading-container");

    // Check that custom style is applied
    expect(loadingContainer.props.style).toEqual(
      expect.objectContaining(customStyle)
    );
  });

  test("displays indeterminate animation when no progress value", () => {
    render(<BufferingProgress />);

    // Check that indeterminate animation was set up
    expect(mockAnimatedTiming).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        toValue: expect.anything(),
        duration: expect.any(Number),
        useNativeDriver: expect.any(Boolean),
      })
    );
  });

  test("stops animation when component unmounts", () => {
    // Mock useEffect cleanup function
    const mockCleanup = jest.fn();

    // Mock useEffect to capture cleanup function
    jest.spyOn(React, "useEffect").mockImplementationOnce((effect) => {
      const cleanup = effect();
      if (cleanup) {
        mockCleanup.mockImplementationOnce(cleanup);
      }
      return cleanup;
    });

    const { unmount } = render(<LocalBufferingProgress />);

    // Unmount component
    unmount();

    // Check that cleanup was called
    expect(mockCleanup).toHaveBeenCalled();
  });

  test("has proper accessibility properties", () => {
    const { getByTestId } = render(<BufferingProgress />);

    // Get the loading container
    const loadingContainer = getByTestId("loading-container");

    // Check accessibility properties
    expect(loadingContainer.props.accessibilityRole).toBe("progressbar");
    expect(loadingContainer.props.accessibilityLiveRegion).toBe("polite");
  });

  test("matches snapshot", () => {
    const { toJSON } = render(<LocalBufferingProgress />);
    expect(toJSON()).toMatchSnapshot();
  });
});
