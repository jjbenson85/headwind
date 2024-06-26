import { PropertyProcessor } from "./main";

export const useTextSizes: PropertyProcessor = (items) => {
  const lookup: Record<string, string[]> = {
    xs: ["0.75rem", "1rem"],
    sm: ["0.875rem", "1.25rem"],
    md: ["1rem", "1.5rem"],
    lg: ["1.125rem", "1.75rem"],
    xl: ["1.25rem", "1.75rem"],
    "2xl": ["1.5rem", "2rem"],
    "3xl": ["1.875rem", "2.25rem"],
    "4xl": ["2.25rem", "2.5rem"],
    "5xl": ["3rem", "1"],
    "6xl": ["3.75rem", "1"],
    "7xl": ["4.5rem", "1"],
    "8xl": ["6rem", "1"],
    "9xl": ["8rem", "1"],
  };
  return items.flatMap((item) => {
    if (item.property !== "text") return item;

    const arr = lookup[item.value] ?? item.value;

    return [
      {
        ...item,
        property: "font-size",
        value: arr[0],
      },
      {
        ...item,
        property: "line-height",
        value: arr[1],
      },
    ];
  });
};
