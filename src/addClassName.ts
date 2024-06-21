import { Item } from "./main";

export function addClassName(className: string): Item {
  return {
    className,
    selector: "",
    property: "",
    value: "",
    breakpoint: "",
    rootVars: [],
    psuedoSelectors: [],
  };
}
