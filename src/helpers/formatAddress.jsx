

export const formatStreet = (input) => {
  if (!input) {
    console.error("Invalid input:", input);
    return null;
  }
  return input
    .replace(/^\d+\s?/, "")
    .replace(/^(N|S|E|W)\s/, "")
    .replace(/\s(Dr|St|Ave|Rd|Blvd|Ln|Ct)$/g, "")
    .trim()
    .toUpperCase();
};
