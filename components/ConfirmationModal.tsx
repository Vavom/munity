import { Modal, Portal } from "react-native-paper";
import { Text } from "react-native-paper";
import { BlurView } from "expo-blur";
import { useAppTheme } from "../themes";
import React from "react";
import GradientButton from "./GradientButton";

export enum ConfirmationType {
  CONFIRM_EMAIL,
  POST_CREATION,
}

type Props = {
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
  confirmationType: ConfirmationType;
};

const ConfirmationModal = ({
  confirmationType,
  isVisible,
  setVisible,
}: Props) => {
  const theme = useAppTheme();
  const confirmEmailContent = (
    <Text>Please confirm your email, check your email app.</Text>
  );

  const confirmCreatedPostContent = (
    <Text>Please confirm your email, check your email app.</Text>
  );

  const getModalContent = () => {
    switch (confirmationType) {
      case ConfirmationType.CONFIRM_EMAIL:
        return confirmEmailContent;
      case ConfirmationType.POST_CREATION:
        return confirmCreatedPostContent;
      default:
        throw new Error("It broke");
    }
  };

  const getModalAction = () => {
    switch (confirmationType) {
      case ConfirmationType.CONFIRM_EMAIL:
        return () => {};
      case ConfirmationType.POST_CREATION:
        return () => {};
      default:
        throw new Error("It broke");
    }
  };

  return (
    <Portal>
      {isVisible ? (
        <BlurView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          tint="dark"
          intensity={10}
          blurReductionFactor={8}
        />
      ) : null}
      <Modal
        visible={isVisible}
        onDismiss={() => setVisible(false)}
        theme={{
          colors: {
            backdrop: "transparent",
          },
        }}
        contentContainerStyle={{
          padding: 20,
          width: "50%",
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          backgroundColor: theme.colors.secondaryContainer,
        }}
      >
        {getModalContent()}
        <GradientButton
          buttonColor="transparent"
          contentStyle={{ width: "auto" }}
          mode="contained"
          onPress={getModalAction}
        >
          {"Confirm"}
        </GradientButton>
      </Modal>
    </Portal>
  );
};

export default ConfirmationModal;
