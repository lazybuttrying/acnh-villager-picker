/** Sum over groups of c*(c-1)/2 (number of duplicate pairs). Shared by the
 * Animal Crossing and Pokopia team scorers, which penalize duplicate
 * species/personality (ACNH) and duplicate types (Pokopia) the same way. */
export function dupPairs(counts: Map<string, number>): number {
  let sum = 0
  for (const c of counts.values()) {
    sum += (c * (c - 1)) / 2
  }
  return sum
}
