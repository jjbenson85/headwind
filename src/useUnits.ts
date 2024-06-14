import { PropertyProcessor } from "./main";

export const useUnits: PropertyProcessor = (items) =>
  items.map((item) => {
    const vals = item.value.split("_");
    const some = vals.some((val) => !isNaN(Number(val)));
    if (!some) return item;

    vals.forEach((val) => {
      if (isNaN(Number(val))) return val;
      item.rootVars.push(`--unit-${val}: ${Number(val) * 0.25}rem;`);
    });

    const value = vals
      .map((val) => {
        if (isNaN(Number(val))) return val;
        return `var(--unit-${val})`;
      })
      .join("_");
    return {
      ...item,
      value,
    };
  });
