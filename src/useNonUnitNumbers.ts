import { PropertyProcessor } from "./main";

// TODO: Don't need to use vars for this
export const useNonUnitNumbers: PropertyProcessor = (items) => {
  const lookup: string[] = ["flex"];
  return items.map((item) => {
    const key = lookup.find((e) => item.property === e);
    if (!key) return item;

    const vals = item.value.split("_");
    const some = vals.some((val) => !isNaN(Number(val)));
    if (!some) return item;

    vals.forEach((val) => {
      if (isNaN(Number(val))) return val;
      item.rootVars.push(`--number-${val}: ${Number(val)};`);
    });
    const value = vals
      .map((val) => {
        if (isNaN(Number(val))) return val;
        return `var(--number-${val})`;
      })
      .join("_");

    return {
      ...item,
      value,
    };
  });
};
