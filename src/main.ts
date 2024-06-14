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
