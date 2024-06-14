import { useHorizontalAndVerticalShorthand } from "./useHorizontalAndVerticalShorthand";
import { useImportant } from "./useImportant";
import { useNonUnitNumbers } from "./useNonUnitNumbers";
import { useRoundedSizes } from "./useRoundedSizes";
import { useSimpleShorthand } from "./useSimpleShorthand";
import { useTextSizes } from "./useTextSizes";
import { useUnits } from "./useUnits";






const useExtendedColors: PropertyProcessor = (items) => {
  const colors = [
    "red",
    "orange",
    "yellow",
    "lime",
    "green",
    "teal",
    "cyan",
    "azure",
    "blue",
    "purple",
    "gray",
    "grey",
    "black",
    "white",
  ] as const;

  function createRootVar(
    color: string,
    lightness: string,
    saturation: string,
    transparency: string
  ) {
    let idx = colors.indexOf(color as any);
    const lightnessNum = 100 - parseInt(lightness) / 10;
    const transparencyNum = parseInt(transparency) / 100;

    const h = 30 * idx;
    const s = saturation;
    const l = lightnessNum;
    const a = transparencyNum;
    return `--hsla-${color}-${lightness}-${transparency}: hsla(${h}, ${s}, ${l}%, ${a});`;
  }

  return items.flatMap((item) => {
    const parts = item.value.split("_");
    const mappedParts = parts.map((part) => {
      const color = colors.find((color) => part.includes(color));
      if (!color) {
        return part;
      }
      const [preValue, lightnessTransparency] = part.split(color);
      let transparency = part.split("/")[1] ?? "100";
      let lightness = lightnessTransparency?.slice(1).split("/")[0];
      if (lightness === "") lightness = "500";
      let saturation = "var(--theme-saturation)";
      switch (color) {
        case "gray":
        case "grey":
          saturation = "0%";
          break;
        case "black":
          saturation = "0%";
          lightness = "1000";
          break;
        case "white":
          saturation = "100%";
          lightness = "0";
          break;
      }

      const rootVarStr = createRootVar(
        color,
        lightness,
        saturation,
        transparency
      );

      item.rootVars.push(rootVarStr);
      return `${preValue}var(--hsla-${color}-${lightness}-${transparency})`;
    });
    return {
      ...item,
      value: mappedParts.join("_"),
    };
  });
};

/**
 * Call this function to run the headwind utility
 * It will process the HTML and create a style tag with the utility classes
 *
 * It takes an optional config object with a propertyProcessors array
 *
 * @param config
 */
export function headwind(config: { propertyProcessors: PropertyProcessor[] }) {
  // document.addEventListener("DOMContentLoaded", () => main(config));

  const observer = new MutationObserver(() => {
    console.log("callback that runs when observer is triggered");
    main(config);
  });

  const body = document.querySelector("body");
  if (!body) return;
  observer.observe(body, {
    subtree: true,
    childList: true,
  });
}
function main(config?: { propertyProcessors: PropertyProcessor[] }): void {
  const propertyProcessors: PropertyProcessor[] = [
    ...(config?.propertyProcessors ?? []),
    useImportant,
    useSimpleShorthand,
    useHorizontalAndVerticalShorthand,
    useNonUnitNumbers,
    useUnits,
    useTextSizes,
    useRoundedSizes,
    useExtendedColors,
  ];

  const classes = processHTML();

  const t = classes
    .map(addClassName)
    .map(addSelector)
    .map(addPsuedoSelectors)
    .flatMap(processProperties(propertyProcessors));

  const style = document.createElement("style");
  style.textContent = createStyleTagText(t);
  document.head.appendChild(style);
}

function createStyleTagText(
  nodes: {
    selector: string;
    psuedoSelectors: string[];
    property: string;
    value: string;
    breakpoint: string;
    rootVars: string[];
  }[]
) {
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
      const psuedoSelectors = selectorNodes.flatMap((e) => e.psuedoSelectors);
      const psuedoSelectorString = psuedoSelectors.length
        ? `:is(${psuedoSelectors.map((e) => `:${e}`).join(", ")})`
        : "";
      let str = `.${selector}${psuedoSelectorString} {`;
      for (const node of selectorNodes) {
        str += `\n\t${node.property}: ${node.value.replaceAll("_", " ")};`;
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

  //   return nodes
  //     .map((classNode) => {
  //       let psuedoString = "";
  //       if (classNode.psuedoSelectors.length) {
  //         psuedoString = ":is(";
  //         psuedoString += classNode.psuedoSelectors
  //           .map((e) => `:${e}`)
  //           .join(", ");
  //         psuedoString += ")";
  //       }

  //       let allStr = `.${classNode.selector}${psuedoString ?? ""} {`;
  //       const properties = classNode.properties;
  //       for (const property of properties) {
  //         allStr += `\n\t${property.property}: ${property.value};`;
  //       }
  //       allStr += "\n}";
  //       return allStr;
  //     })
  //     .join("\n");
}

function extractValueFromSquareBrackets(str: string) {
  const regex = /\[(.*?)]/g;
  const match = str.matchAll(regex);
  return match;
}
function processProperties(propertyProcessors: PropertyProcessor[]) {
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

function addPsuedoSelectors<T extends { className: string }>(node: T) {
  return {
    ...node,
    psuedoSelectors: node.className.split(":").slice(1),
  };
}

function addSelector<T extends { className: string }>(classNode: T) {
  const selector = classNode.className
    .replaceAll(":", "\\:")
    .replaceAll(".", "\\.")
    .replaceAll("@", "\\@")
    .replaceAll("!", "\\!")
    .replaceAll("%", "\\%")
    .replaceAll("[", "\\[")
    .replaceAll("]", "\\]")
    .replaceAll("/", "\\/");

  return { ...classNode, selector };
}
function addClassName(className: string) {
  return { className };
}

function processHTML() {
  const els = document.querySelectorAll("*");
  return [...new Set([...els].flatMap((el) => [...el.classList]))];
}

type Item = {
  className: string;
  property: string;
  value: string;
  breakpoint: string;
  rootVars: string[];
};
export type PropertyProcessor = (items: Item[]) => Item[];
