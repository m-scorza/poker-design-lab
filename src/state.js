// Shared mutable state across modules (replaces the old implicit window globals).
export const state = {
  // RGB triple (string) the background mesh morphs toward; theme-dock writes it.
  gridColor: '0, 240, 255',
};
