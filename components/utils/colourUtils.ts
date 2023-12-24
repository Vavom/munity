function stringToColor(inputString: string): string {
  // Convert the string to a hash code
  let hashCode = 0;
  for (let i = 0; i < inputString.length; i++) {
    hashCode = (hashCode << 5) + hashCode + inputString.charCodeAt(i); // Use a more sensitive hash function
  }

  // Enhance color variations for small string changes
  const variationFactor = 10; // Adjust for desired sensitivity
  hashCode = (hashCode * variationFactor) & 0x00ffffff;

  // Generate the color using the modified hash code
  const color = "#" + hashCode.toString(16).padStart(6, "0").toUpperCase();

  return color;
}

export default stringToColor;
