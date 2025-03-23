/**
 * Component styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  voiceContainer: {
    width: "100%",
    padding: 16,
  },
  imageContainer: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  button: {
    marginTop: 40,
    backgroundColor: "#6200EA",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  stepDes: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default AnimatedContent;
