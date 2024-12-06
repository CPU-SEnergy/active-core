export const formatEnumText = (type: string) => {
  return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};
