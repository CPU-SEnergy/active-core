export const formatParamsText = (type: string | string[]) => {
  if (Array.isArray(type)) {
    return type
      .map((t) =>
        t
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char: string) => char.toUpperCase())
      )
      .join(", ");
  }
  return type
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
};
