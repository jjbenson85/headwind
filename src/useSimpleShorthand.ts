import { PropertyProcessor } from "./main";

export const useSimpleShorthand: PropertyProcessor = (items) => {
  const lookup: Record<string, string> = {
    bg: "background-color",
    ac: "align-content",
    d: "display",
    // ai: "align-items",
    // as: "align-self",
    // fb: "flex-basis",
    // fd: "flex-direction",
    // fg: "flex-grow",
    // fs: "flex-shrink",
    // fw: "flex-wrap",
    // jc: "justify-content",
    // ji: "justify-items",
    // js: "justify-self",
    h: "height",
    "min-h": "min-height",
    "max-h": "max-height",
    w: "width",
    "min-w": "min-width",
    "max-w": "max-width",
    rounded: "border-radius",
  };
  return items.map((item) => {
    const key = Object.keys(lookup).find((e) => item.property.startsWith(e));
    if (!key) return item;
    const rest = item.property.replace(key, "").split("-").filter(Boolean);
    const property = [lookup[key], ...rest].join("-");
    return {
      ...item,
      property,
    };
  });
};
