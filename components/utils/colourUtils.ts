function stringToColor(inputString: string) {
    // Convert the string to a hash code
    let hashCode = 0;
    for (let i = 0; i < inputString.length; i++) {
      hashCode = inputString.charCodeAt(i) + ((hashCode << 5) - hashCode);
    }

    // Generate a color using the hash code
    const color = "#" + ((hashCode & 0x00FFFFFF).toString(16)).toUpperCase();

    return color;
  }

export default stringToColor
