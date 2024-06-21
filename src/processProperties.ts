import { Item, PropertyProcessor } from "./main";

function extractValueFromSquareBrackets(str: string) {
  const regex = /\[(.*?)]/g;
  const match = str.matchAll(regex);
  return match;
}
export function processProperties(propertyProcessors: PropertyProcessor[]) {
  return function (classNode: Item) {
    const property = classNode.className.split("[")[0];
    const foundValues = extractValueFromSquareBrackets(classNode.className);
    const items = [...foundValues].map(([_, item]): Item => {
      const [value, breakpoint] = item.split("@");
      return {
        ...classNode,
        value,
        property,
        breakpoint,
      };
    });

    return propertyProcessors.reduce((acc, processor) => processor(acc), items);
  };
}
