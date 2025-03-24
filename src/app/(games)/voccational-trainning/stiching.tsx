import { View } from "react-native";
import React from "react";
import AnimatedContent from "./animated-content";
import { Images } from "@/src/constants/Images";


/**
 * Stitching component that provides a step-by-step sewing guide
 * Displays sequential instructions with images and voice narration
 *
 * @returns {JSX.Element} Animated step-by-step stitching guide
 */
const Stitching = () => {
  
  /**
   * Step-by-step stitching guide data
   * Each step includes text descriptions, images, and voice content
   */
  const steps = [
    {
      text: "Gather your materials",
      description: "Collect fabric, thread, a needle, and scissors.",
      image: Images.Stichingguide1,
      voiceNote:
        "Gather your materials.Collect fabric, thread, a needle, and scissors.",
      bannarText: "Gather your materials",
    },
    {
      text: "Thread the needle",
      description: "Pass the thread through and knot the end.",
      image: Images.Stichingguide2,
      voiceNote: "Thread the needle.Pass the thread through and knot the end.",
      bannarText: "Thread the needle",
    },
    {
      text: "Draw a stitching line",
      description: "Use a pencil or chalk to draw a line as a guide.",
      image: Images.Stichingguide3,
      voiceNote:
        "Draw a stitching line.Use a pencil or chalk to draw a line as a guide.",
      bannarText: "Draw a stitching line",
    },
    {
      text: "Start stitching on drawn line",
      description: "Push the needle through fabric and follow the line.",
      image: Images.Stichingguide4,
      voiceNote:
        "Start stitching on drawn line.Push the needle through fabric and follow the line.",
      bannarText: "Start stitching on drawn line",
    },
    {
      text: "Once done, tie off the thread.",
      description: "Make a small knot at the end to secure stitches.",
      image: Images.Stichingguide5,
      voiceNote:
        "Once done, tie off the thread.Make a small knot at the end to secure stitches.",
      bannarText: "Once done, tie off the thread.",
    },
    {
      text: "Cut the thread",
      description: "Use scissors to trim any extra thread carefully.",
      image: Images.Stichingguide6,
      voiceNote:
        "Cut the thread.Use scissors to trim any extra thread carefully.",
      bannarText: "Cut the thread ",
    },
    {
      text: "Done! Great job!",
      description: "You did it ! Keep practicing to improve your skills!",
      image: Images.Stichingguide7,
      voiceNote: "Done! Great job!.Keep practicing to improve your skills!",
      bannarText: "Done! Great job!",
    },
  ];

  /**
   * Renders the AnimatedContent component with stitching steps data
   */
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AnimatedContent steps={steps} />
    </View>
export default Stitching;
