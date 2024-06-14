import { PropertyProcessor } from "./main";

export const useRoundedSizes: PropertyProcessor = (items) => {
  const lookup: Record<string, string> = {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3",
    "6xl": "3.75",
    "7xl": "4.5",
    "8xl": "6",
    "9xl": "8",
  };
  return items.flatMap((item) => {
    if (item.property !== "rounded") return item;

    const value = lookup[item.value] ?? item.value;

    return {
      ...item,
      property: "border-radius",
      value,
    };
  });
};
