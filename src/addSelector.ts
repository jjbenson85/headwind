import { Item } from "./main";

function parsePsuedoSelectors(str: string) {
  if (!str) return "";
  const psuedoStr = str
    .split(":")
    .map((e) => `:${e}`)
    .join(", ");

  return `:is(${psuedoStr})`;
}

export function addSelector(node: Item): Item {
  // test_group:hover:focus
  const ancestorSelectorArr =
    // test_group:hover:focus_something[10]
    node.className
      // ['test_group:hover:focus_something', '10]']
      .split("[")
      // test_group:hover:focus_something
      .at(0)
      // ['test', 'group:hover:focus', 'something']
      ?.split("_")
      // ['test', 'group:hover:focus']
      .slice(0, -1);

  const ancestorSelectors = ancestorSelectorArr
    ?.map((e) => {
      const [selector, ...psudedoArr] = e.split(":");
      return `${selector}${parsePsuedoSelectors(psudedoArr.join(":"))}`;
    })
    .join(" ");

  const selectorString = node.className.replace(
    /[:\.@!%\[\]\/]/g,
    (m) => "\\" + m
  );

  const manSelector = node.className.split("]").at(-1) ?? "";
  const psuedoSelectorString = parsePsuedoSelectors(manSelector);

  node.selector = `${ancestorSelectors} .${selectorString}${psuedoSelectorString}`;
  return node;
}
