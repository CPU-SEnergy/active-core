export const formatEnumText = (type: string | undefined, defaultValue = "All Products") => {
  if (type === undefined || type === null || type === "") {
    return defaultValue;
  }
  return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};