import { Item } from "./main";

export function createStyleTagText(nodes: Item[]) {
  const allRootVars = [
    `--theme-saturation: 80%;`,

    ...new Set(nodes.flatMap((e) => e.rootVars)),
  ];
  const breakpoints = [...new Set(nodes.map((e) => e.breakpoint))];
  const breakpointValues = breakpoints.map((breakpoint) => {
    const bpNodes = nodes.filter((e) => e.breakpoint === breakpoint);
    const selectors = bpNodes.map((e) => e.selector);

    const strs = selectors.map((selector) => {
      const selectorNodes = bpNodes.filter((e) => e.selector === selector);
      let str = `${selector} {`;
      for (const node of selectorNodes) {
        const property = node.property;
        const value = node.value.replaceAll("_", " ");
        str += `\n\t${property}: ${value};`;
      }
      str += "\n}";

      return str;
    });

    const uniqueStrs = [...new Set(strs)];

    let bpStr = `:root { \n${allRootVars.map((e) => `\t${e}`).join("\n")}\n}\n`;
    if (breakpoint) {
      const breakpointLookup: Record<string, number> = {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      };
      const pxSize = breakpointLookup[breakpoint];
      bpStr = `@media (min-width: ${pxSize}px) {\n`;
    }

    bpStr += uniqueStrs.join("\n");

    if (breakpoint) {
      bpStr += "\n}";
    }
    return bpStr;
  });

  return breakpointValues.join("\n");
}
