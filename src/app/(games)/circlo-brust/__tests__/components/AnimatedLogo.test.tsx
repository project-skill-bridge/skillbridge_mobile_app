/**
 * =========================================================================
 * AnimatedLogo Component Tests
 * =========================================================================
 *
 * These tests verify that the CircloBrust animated logo component renders
 * correctly and properly initializes its animations.
 *
 * Tests cover:
 * - Basic component rendering
 * - Animation initialization
 * - Visual appearance via snapshots
 * - Text content verification
 *
 * =========================================================================
 */

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import AnimatedLogo from "../../UI/animated-logo/animated-logo";

// Mock Animated API
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Mock for Animated.timing
const mockStart = jest.fn();
const mockAnimatedTiming = jest.fn(() => ({
  start: mockStart,
}));

// Mock for Animated.sequence
const mockSequence = jest.fn(() => ({
  start: mockStart,
}));

// Mock for Animated.parallel
const mockParallel = jest.fn(() => ({
  start: mockStart,
}));

// Mock for Animated.loop
const mockLoop = jest.fn(() => ({
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
      sequence: mockSequence,
      parallel: mockParallel,
      loop: mockLoop,
      Value: jest.fn((initialValue) => ({
        setValue: jest.fn(),
        interpolate: jest.fn(() => ({
          __getValue: jest.fn(() => initialValue),
        })),
        __getValue: jest.fn(() => initialValue),
      })),
      ValueXY: jest.fn((initialValue) => ({
        x: {
          __getValue: jest.fn(() => initialValue.x),
        },
        y: {
          __getValue: jest.fn(() => initialValue.y),
        },
        setValue: jest.fn(),
      })),
      View: RN.View,
      createAnimatedComponent: jest.fn((component) => component),
    },
  };
});

// Mock SVG components
jest.mock("react-native-svg", () => {
  const RN = jest.requireActual("react-native");

  return {
    Svg: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: any;
    }) => (
      <RN.View testID="svg-mock" {...props}>
        {children}
      </RN.View>
    ),
    Path: ({ ...props }) => <RN.View testID="svg-path" {...props} />,
    G: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: any;
    }) => (
      <RN.View testID="svg-g" {...props}>
        {children}
      </RN.View>
    ),
  };
});

describe("AnimatedLogo Component", () => {
  // Clear mock function calls before each test
  beforeEach(() => {
    mockAnimatedTiming.mockClear();
    mockSequence.mockClear();
    mockParallel.mockClear();
    mockLoop.mockClear();
    mockStart.mockClear();
  });

  test("renders correctly with logo text", () => {
    const { getByText } = render(<AnimatedLogo />);

    // Verify both text parts are rendered
    expect(getByText("CIRCLO")).toBeTruthy();
    expect(getByText("BRUST")).toBeTruthy();
  });

  test("initializes animations on mount", async () => {
    render(<AnimatedLogo />);

    // Wait for useEffect to run
    await waitFor(() => {
      // Check that animations were set up
      // We expect at least 4 animation loops for:
      // 1. Circle pulse
      // 2. Hand animation
      // 3. Hand rotation
      // 4. Banner shine
      expect(mockLoop).toHaveBeenCalledTimes(4);

      // Verify animation start was called for each loop
      expect(mockStart).toHaveBeenCalledTimes(4);
    });
  });

  test("renders the hand SVG component", () => {
    const { getAllByTestId } = render(<AnimatedLogo />);

    // Verify SVG elements are in the component
    const svgGroups = getAllByTestId("svg-g");
    const svgPaths = getAllByTestId("svg-path");

    // The hand consists of at least one group and multiple paths
    expect(svgGroups.length).toBeGreaterThan(0);
    expect(svgPaths.length).toBeGreaterThan(2); // At least 3 paths for fingers and palm
  });

  test("renders banner with corner decorations", () => {
    const { getByTestId } = render(<AnimatedLogo />);

    // We should have the main logo container
    const logoBox = getByTestId("logo-box");
    expect(logoBox).toBeTruthy();

    // It should contain corner decorations (we can check by style properties)
    // This test will depend on how we can identify corners in the rendered output
  });

  test("applies proper styling to text elements", () => {
    const { getByText } = render(<AnimatedLogo />);

    // Get the text elements
    const circloText = getByText("CIRCLO");
    const brustText = getByText("BRUST");

    // Check that they have the expected styles
    // 'BRUST' should have the bold style applied
    expect(circloText.props.style.fontFamily).not.toBe(
      brustText.props.style.fontFamily
    );

    // BRUST should have a different color (gold)
    expect(circloText.props.style.color).not.toBe(brustText.props.style.color);
  });

  test("matches snapshot", () => {
    const { toJSON } = render(<AnimatedLogo />);
    expect(toJSON()).toMatchSnapshot();
  });
});
