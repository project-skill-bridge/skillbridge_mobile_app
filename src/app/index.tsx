import { Redirect } from "expo-router";

const index = () => {
  if (true) {
    <Redirect href="/(root)/(tabs)/home" />;
  }

  return (
    <Redirect href="/(auth)/welcome" />;
  );
};

export default index;
