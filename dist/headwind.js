function v(o) {
  document.addEventListener("DOMContentLoaded", () => k(o));
}
function k(o) {
  const c = [
    ...(o == null ? void 0 : o.propertyProcessors) ?? [],
    (p) => {
      const s = {
        bg: "background-color",
        "b-r": "border-radius",
        w: "width",
        h: "height"
      };
      return p.map((r) => {
        const t = Object.keys(s).find(
          (a) => r.property.startsWith(a)
        );
        if (!t)
          return r;
        const n = r.property.replace(t, "").split("-").filter(Boolean), e = [s[t], ...n].join("-");
        return {
          ...r,
          property: e
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
    (p) => {
      const s = {
        m: "margin",
        p: "padding",
        b: "border"
      }, r = {
        t: ["top"],
        b: ["bottom"],
        l: ["left"],
        r: ["right"],
        x: ["left", "right"],
        y: ["top", "bottom"]
      };
      return p.flatMap((t) => {
        if (t.property.length > 3)
          return t;
        const [n, e] = t.property.replace("-", ""), a = s[n], u = r[e];
        return a && u ? u.map((d) => ({
          ...t,
          property: `${a}-${d}`
        })) : t;
      });
    },
    (p) => p.map((s) => {
      const r = s.value.split("_");
      if (!r.some((e) => !isNaN(Number(e))))
        return s;
      r.forEach((e) => {
        if (isNaN(Number(e)))
          return e;
        s.rootVars.push(`--unit-${e}: ${Number(e) * 0.25}rem;`);
      });
      const n = r.map((e) => isNaN(Number(e)) ? e : `var(--unit-${e})`).join("_");
      return {
        ...s,
        value: n
      };
    }),
    (p) => {
      const s = {
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
        "9xl": ["8rem", "1"]
      };
      return p.flatMap((r) => {
        if (r.property !== "text")
          return r;
        const t = s[r.value] ?? s.md;
        return [
          {
            ...r,
            property: "font-size",
            value: t[0]
          },
          {
            ...r,
            property: "line-height",
            value: t[1]
          }
        ];
      });
    },
    (p) => {
      const s = [
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
        "white"
      ];
      function r(t, n, e, a) {
        let u = s.indexOf(t);
        const d = 100 - parseInt(n) / 10, m = parseInt(a) / 100;
        return console.log({ lightness: n, lightnessNum: d }), `--hsla-${t}-${n}-${a}: hsla(${Math.max(0, u) * 30}, ${e}, ${d}%, ${m});`;
      }
      return p.flatMap((t) => {
        const e = t.value.split("_").map((a) => {
          const u = s.find(($) => a.includes($));
          if (!u)
            return a;
          const [d, m] = a.split(u);
          let i = a.split("/")[1] ?? "100", f = m == null ? void 0 : m.slice(1).split("/")[0];
          f === "" && (f = "500");
          let b = "var(--theme-saturation)";
          switch (u) {
            case "gray":
            case "grey":
              b = "0%";
              break;
            case "black":
              b = "0%", f = "0";
              break;
            case "white":
              b = "100%", f = "0";
              break;
          }
          const y = r(
            u,
            f,
            b,
            i
          );
          return t.rootVars.push(y), `${d}var(--hsla-${u}-${f}-${i})`;
        });
        return {
          ...t,
          value: e.join("_")
        };
      });
    }
  ], x = M().map(A).map(w).map(V).flatMap(N(c)), l = document.createElement("style");
  l.textContent = g(x), document.head.appendChild(l), console.log(l.textContent);
}
function g(o) {
  const c = [
    "--theme-saturation: 80%;",
    ...new Set(o.flatMap((l) => l.rootVars))
  ];
  return [...new Set(o.map((l) => l.breakpoint))].map((l) => {
    const p = o.filter((e) => e.breakpoint === l), r = p.map((e) => e.selector).map((e) => {
      const a = p.filter((i) => i.selector === e), u = a.flatMap((i) => i.psuedoSelectors), d = u.length ? `:is(${u.map((i) => `:${i}`).join(", ")})` : "";
      let m = `.${e}${d} {`;
      for (const i of a)
        m += `
	${i.property}: ${i.value.replace("_", " ")};`;
      return m += `
}`, m;
    }), t = [...new Set(r)];
    let n = `:root { 
${c.map((e) => `	${e}`).join(`
`)}
}
`;
    return l && (n = `@media (min-width: ${{
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }[l]}px) {
`), n += t.join(`
`), l && (n += `
}`), n;
  }).join(`
`);
}
function S(o) {
  const c = /\[(.*?)]/g;
  return o.matchAll(c);
}
function N(o) {
  return function(c) {
    const h = c.className.split("[")[0], l = [...S(c.className)].map(([s, r]) => {
      const [t, n] = r.split("@");
      return {
        value: t,
        property: h,
        breakpoint: n,
        rootVars: []
      };
    });
    return o.reduce((s, r) => r(s), l).map((s) => ({ ...c, ...s }));
  };
}
function V(o) {
  return {
    ...o,
    psuedoSelectors: o.className.split(":").slice(1)
  };
}
function w(o) {
  const c = o.className.replaceAll(":", "\\:").replaceAll(".", "\\.").replaceAll("@", "\\@").replaceAll("%", "\\%").replaceAll("[", "\\[").replaceAll("]", "\\]").replaceAll("/", "\\/");
  return { ...o, selector: c };
}
function A(o) {
  return { className: o };
}
function M() {
  const o = document.querySelectorAll("*");
  return [...new Set([...o].flatMap((c) => [...c.classList]))];
}
export {
  v as headwind
};
