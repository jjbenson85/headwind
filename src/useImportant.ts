import { PropertyProcessor } from "./main";

export const useImportant: PropertyProcessor = (items) => {
  return items.map((item) => {
    if (item.className.endsWith("!") || item.value.endsWith("!")) {
      item.value = item.value + "_!important";
    }
    return item;
  });
};
