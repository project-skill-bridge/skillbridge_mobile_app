import React from "react";

import { Icons } from "@/src/constants/Icons";
import { hp, wp } from "@/src/utils/common";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import { ModalProps } from "@/src/types/type";

const Modal = ({
  isVisible,
  message,
  setCloseModel: setOpenModel,
  type,
}: ModalProps) => {
  return (
    <ReactNativeModal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      onBackButtonPress={setOpenModel}
      onBackdropPress={setOpenModel}
    >
      <View style={styles.modelContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.modelTitle}>
            {type === "success" ? "Success" : "Error"}
          </Text>
          <Text>
            {" "}
            {type === "success" ? (
              <Icons.Check color="green" size={24} />
            ) : (
              <Icons.X color="red" size={25} />
            )}
          </Text>
        </View>
        <Text style={styles.message}>{message}</Text>
        <Pressable onPress={setOpenModel} style={styles.button}>
          <Text style={{ color: "blue" }}>Close</Text>
        </Pressable>
      </View>
    </ReactNativeModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modelContainer: {
    backgroundColor: "#FFF",
    padding: wp(5),
    borderRadius: 10,
    minHeight: hp(20),
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modelTitle: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: hp(1.8),
    textAlign: "center",
  },
  button: {
    marginTop: hp(2),
    padding: wp(2),
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
