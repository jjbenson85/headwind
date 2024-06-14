import { PropertyProcessor } from "./main";

export const useHorizontalAndVerticalShorthand: PropertyProcessor = (items) => {
  const firstLookup: Record<string, string> = {
    m: "margin",
    p: "padding",
    b: "border",
  };
  const secondLookup: Record<string, string[]> = {
    t: ["top"],
    b: ["bottom"],
    l: ["left"],
    r: ["right"],
    x: ["left", "right"],
    y: ["top", "bottom"],
  };
  return items.flatMap((item) => {
    if (item.property.length > 3) return item;
    const [first, second] = item.property.replace("-", "");
    const firstVal = firstLookup[first];
    const secondValArr = secondLookup[second] ?? [undefined];

    if (!firstVal) return item;

    return secondValArr.map((secondVal) => ({
      ...item,
      property: [firstVal, secondVal].filter(Boolean).join("-"),
    }));
  });
};
