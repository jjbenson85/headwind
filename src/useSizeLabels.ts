import { PropertyProcessor } from "./main";

export const useSizeLabels: PropertyProcessor = (items) => {
  const sizeArr = ["xs", "sm", "md", "lg", "xl"];
  return items.flatMap((item) => {
    let value = item.value;

    const idx = sizeArr.indexOf(value);
    let num;

    if (idx !== -1) {
      num = idx + 1;
    } else if (value.endsWith("xl")) {
      num = 4 + Number(value.slice(0, -2));
    }

    if (num) {
      item.rootVars.push(`--unit-${num}: ${num * 0.25}rem;;`);
      value = `var(--unit-${num})`;
    }

    return {
      ...item,
      value,
    };
  });
};
