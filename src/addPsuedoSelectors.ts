export function addPsuedoSelectors<T extends { className: string }>(node: T) {
  return {
    ...node,
    psuedoSelectors: node.className.split(":").slice(1),
  };
}
