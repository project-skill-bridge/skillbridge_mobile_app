import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignInScreen from "@/src/app/(auth)/sign-in";
import auth from "@react-native-firebase/auth";

// Mock Firebase Auth methods
jest.mock("@react-native-firebase/auth", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  })),
}));

// Mock `expo-av` to prevent loadSuccess error
jest.mock("expo-av", () => ({
  Audio: {
    setAudioModeAsync: jest.fn(),
    Sound: jest.fn().mockImplementation(() => ({
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          playAsync: jest.fn(),
          setVolumeAsync: jest.fn(),
          replayAsync: jest.fn(),
          unloadAsync: jest.fn(),
        },
      }),
    })),
    getPermissionsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
  },
}));

describe("SignInScreen", () => {
  it("renders the sign-in screen correctly", () => {
    const { getByPlaceholderText } = render(<SignInScreen />);
    expect(getByPlaceholderText("Enter your email")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
  });

  // it("allows a user to sign in successfully", async () => {
  //   const mockSignIn = auth().signInWithEmailAndPassword as jest.Mock;
  //   mockSignIn.mockResolvedValueOnce({});

  //   const { getByPlaceholderText, getByText } = render(<SignInScreen />);
  //   const emailInput = getByPlaceholderText("Enter your email");
  //   const passwordInput = getByPlaceholderText("Enter your password");
  //   const signInButton = getByText("Sign In");

  //   fireEvent.changeText(emailInput, "test@example.com");
  //   fireEvent.changeText(passwordInput, "password123");
  //   fireEvent.press(signInButton);

  //   await waitFor(() => {
  //     expect(mockSignIn).toHaveBeenCalledWith(
  //       "test@example.com",
  //       "password123"
  //     );
  //   });
  // });

  // it("shows an error message when sign-in fails", async () => {
  //   const mockSignIn = auth().signInWithEmailAndPassword as jest.Mock;
  //   mockSignIn.mockRejectedValueOnce(new Error("Invalid email or password"));

  //   const { getByPlaceholderText, getByText, findByText } = render(
  //     <SignInScreen />
  //   );
  //   fireEvent.changeText(
  //     getByPlaceholderText("Enter your email"),
  //     "wrong@example.com"
  //   );
  //   fireEvent.changeText(
  //     getByPlaceholderText("Enter your password"),
  //     "wrongpassword"
  //   );
  //   fireEvent.press(getByText("Sign In"));

  //   expect(await findByText("Invalid email or password")).toBeTruthy();
  // });

  // it("triggers forgot password action", async () => {
  //   const mockResetPassword = auth().sendPasswordResetEmail as jest.Mock;
  //   mockResetPassword.mockResolvedValueOnce(undefined);

  //   const { getByPlaceholderText, getByText } = render(<SignInScreen />);
  //   fireEvent.changeText(
  //     getByPlaceholderText("Enter your email"),
  //     "test@example.com"
  //   );
  //   fireEvent.press(getByText("Forgot Password"));

  //   await waitFor(() => {
  //     expect(mockResetPassword).toHaveBeenCalledWith("test@example.com");
  //   });
  // });

  // it("shows error if forgot password is triggered without email", async () => {
  //   const { getByText, findByText } = render(<SignInScreen />);
  //   fireEvent.press(getByText("Forgot Password"));

  //   expect(await findByText("Please enter your email")).toBeTruthy();
  // });
});
