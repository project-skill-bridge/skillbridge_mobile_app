import { Redirect } from "expo-router";

const index = () => {
  if (false) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
};

export default index;
