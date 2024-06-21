import { Item } from "./main";

export function addSelector(node: Item): Item {
  node.selector = node.className.replace(/[:\.@!%\[\]\/]/g, (m) => "\\" + m);
  return node;
}
