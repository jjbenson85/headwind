import { Item } from "./main";

export function createInitialItem(className: string): Item {
  return {
    className,
    selector: "",
    property: "",
    value: "",
    breakpoint: "",
    rootVars: [],
  };
}
