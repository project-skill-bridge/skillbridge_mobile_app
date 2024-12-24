import { images } from "./Images";

export const onboardingData = [
  {
    id: 1,
    title: "Empowering Independence, One Skill at a Time",
    description:
      "Join us in creating a brighter future with fun, interactive learning.",
    image: images.onboarding1,
  },
  {
    id: 2,
    title: "Why Skill Bridge?",
    description:
      "Hands-on skill learning with gamified exercises. Real-time progress tracking and feedback.",
    image: images.onboarding2,
  },
  {
    id: 3,
    title: "Let’s Bridge the Gap Together!",
    description:
      "Let’s make learning fun and exciting! Start your journey toward unlocking endless possibilities.",
    image: images.onboarding3,
  },
] as const;
