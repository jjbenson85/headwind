import { Item } from "./main";

export function addPsuedoSelectors(node: Item) {
  node.psuedoSelectors = node.className.split(":").slice(1);
  return node;
}
