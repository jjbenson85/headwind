function createApp(config: { propertyProcessors: PropertyProcessor[] }) {
  document.addEventListener("DOMContentLoaded", () => main(config));
}
function main(config?: { propertyProcessors: PropertyProcessor[] }): void {
  const propertyProcessors: PropertyProcessor[] = [
    ...(config?.propertyProcessors ?? []),

    (items) => {
      const lookup: Record<string, string> = {
        bg: "background-color",
        "b-r": "border-radius",
        w: "width",
        h: "height",
      };
      return items.map((item) => {
        const key = Object.keys(lookup).find((e) =>
          item.property.startsWith(e)
        );
        if (!key) return item;
        const rest = item.property.replace(key, "").split("-").filter(Boolean);
        const property = [lookup[key], ...rest].join("-");
        return {
          ...item,
          property,
        };
      });
    },

    // (items) => {
    //   const lookup: Record<string, string> = {
    //     // bg: "background-color",
    //     "b-r": "border-radius",
    //     w: "width",
    //     h: "height",
    //   };
    //   return items.map((item) => {
    //     const key = Object.keys(lookup).find((e) =>
    //       item.property.startsWith(e)
    //     );
    //     if (!key) return item;
    //     const rest = item.property.replace(key, "").split("-").filter(Boolean);
    //     const property = [lookup[key], ...rest].join("-");
    //     return {
    //       ...item,
    //       property,
    //     };
    //   });
    // },

    (items) => {
      const firstLookup: Record<string, string> = {
        m: "margin",
        p: "padding",
        b: "border",
      };
      const secondLookup: Record<string, string[]> = {
        t: ["top"],
        b: ["bottom"],
        l: ["left"],
        r: ["right"],
        x: ["left", "right"],
        y: ["top", "bottom"],
      };
      return items.flatMap((item) => {
        if (item.property.length > 3) return item;
        const [first, second] = item.property.replace("-", "");
        const firstVal = firstLookup[first];
        const secondValArr = secondLookup[second];

        if (!(firstVal && secondValArr)) return item;

        return secondValArr.map((secondVal) => ({
          ...item,
          property: `${firstVal}-${secondVal}`,
        }));
      });
    },
    (items) =>
      items.map((item) => {
        const vals = item.value.split("_");
        const some = vals.some((val) => !isNaN(Number(val)));
        if (!some) return item;

        vals.forEach((val) => {
          if (isNaN(Number(val))) return val;
          item.rootVars.push(`--unit-${val}: ${Number(val) * 0.25}rem;`);
        });

        const value = vals
          .map((val) => {
            if (isNaN(Number(val))) return val;
            return `var(--unit-${val})`;
          })
          .join("_");
        return {
          ...item,
          value,
        };
      }),
    (items) => {
      const lookup: Record<string, string[]> = {
        xs: ["0.75rem", "1rem"],
        sm: ["0.875rem", "1.25rem"],
        md: ["1rem", "1.5rem"],
        lg: ["1.125rem", "1.75rem"],
        xl: ["1.25rem", "1.75rem"],
        "2xl": ["1.5rem", "2rem"],
        "3xl": ["1.875rem", "2.25rem"],
        "4xl": ["2.25rem", "2.5rem"],
        "5xl": ["3rem", "1"],
        "6xl": ["3.75rem", "1"],
        "7xl": ["4.5rem", "1"],
        "8xl": ["6rem", "1"],
        "9xl": ["8rem", "1"],
      };
      return items.flatMap((item) => {
        if (item.property !== "text") return item;

        const arr = lookup[item.value] ?? lookup["md"];

        return [
          {
            ...item,
            property: "font-size",
            value: arr[0],
          },
          {
            ...item,
            property: "line-height",
            value: arr[1],
          },
        ];
      });
    },
    (items) => {
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
        console.log({ lightness, lightnessNum });

        return `--hsla-${color}-${lightness}-${transparency}: hsla(${
          Math.max(0, idx) * 30
        }, ${saturation}, ${lightnessNum}%, ${transparencyNum});`;
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
              lightness = "0";
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
    },
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
  console.log(style.textContent);
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
        str += `\n\t${node.property}: ${node.value.replace("_", " ")};`;
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

type PropertyProcessor = (
  items: {
    property: string;
    value: string;
    breakpoint: string;
    rootVars: string[];
  }[]
) => {
  property: string;
  value: string;
  breakpoint: string;
  rootVars: string[];
}[];

export { createApp as headwind };
