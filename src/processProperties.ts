import { PropertyProcessor } from "./main";

function extractValueFromSquareBrackets(str: string) {
  const regex = /\[(.*?)]/g;
  const match = str.matchAll(regex);
  return match;
}
export function processProperties(propertyProcessors: PropertyProcessor[]) {
  return function <T extends { className: string }>(classNode: T) {
    const property = classNode.className.split("[")[0];
    const foundValues = extractValueFromSquareBrackets(classNode.className);
    const items = [...foundValues].map(([_, item]) => {
      const [value, breakpoint] = item.split("@");
      return {
        className: classNode.className,
        value,
        property,
        breakpoint,
        rootVars: [] as string[],
      };
    });

    const properties = propertyProcessors.reduce((acc, processor) => {
      return processor(acc);
    }, items);

    return properties.map((item) => ({ ...classNode, ...item }));
  };
}
