import { PropertyProcessor } from "./main";

export const useExtendedColors: PropertyProcessor = (items) => {
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
