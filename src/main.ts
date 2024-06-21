import { addClassName } from "./addClassName";
import { addPsuedoSelectors } from "./addPsuedoSelectors";
import { addSelector } from "./addSelector";
import { createStyleTagText } from "./createStyleTagText";
import { processProperties } from "./processProperties";
import { useExtendedColors } from "./useExtendedColors";
import { useHorizontalAndVerticalShorthand } from "./useHorizontalAndVerticalShorthand";
import { useImportant } from "./useImportant";
import { useNonUnitNumbers } from "./useNonUnitNumbers";
import { useRoundedSizes } from "./useRoundedSizes";
import { useSimpleShorthand } from "./useSimpleShorthand";
import { useTextSizes } from "./useTextSizes";
import { useUnits } from "./useUnits";

export type Item = {
  className: string;
  property: string;
  value: string;
  breakpoint: string;
  rootVars: string[];
  psuedoSelectors: string[];
  selector: string;
};
export type PropertyProcessor = (items: Item[]) => Item[];

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
  console.time("headwind");
  const style = document.createElement("style");

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

  const els = document.querySelectorAll("*");
  const classes = getAllClasses(els);

  let allNodes: Item[] = [];
  for (const className of classes) {
    const node = addClassName(className);
    const node2 = addSelector(node);
    const node3 = addPsuedoSelectors(node2);
    const nodes = processProperties(propertyProcessors)(node3);
    allNodes.push(...nodes);
  }

  style.textContent = createStyleTagText(allNodes);
  document.head.appendChild(style);
  console.timeEnd("headwind");
}

function getAllClasses(els: NodeListOf<Element>) {
  const bucket = new Set<string>();
  for (const el of els) {
    for (const className of el.classList) {
      bucket.add(className);
    }
  }
  return bucket;
}



