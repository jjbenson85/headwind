export function addSelector<T extends { className: string }>(classNode: T) {
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
