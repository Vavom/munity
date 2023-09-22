import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const GradientButton: React.FC<React.ComponentProps<typeof Button>> = ({
  ...props
}) => {
  return (
    <LinearGradient
      colors={["#000A62", "#9C00B6"]} // Define your gradient colors
      start={{ x: 0, y: 0 }} // Start from the left
      end={{ x: 1, y: 0 }} // End at the right
      style={styles.buttonStyle}
    >
      <Button {...props} />
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    alignSelf: "center",
    margin: 10,
    width: "auto",
    borderRadius: 20,
  },
});

export default GradientButton;
