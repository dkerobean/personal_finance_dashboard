export function hexToRGB(hex) {
  // Remove the '#' if it's there
  hex = hex.replace(/^#/, '');

  // Parse the hex string to RGB values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Return the RGB color as a string
  return `${r}, ${g}, ${b}`;
}
