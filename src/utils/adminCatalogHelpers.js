// Shared helper for merging Admin custom items, overrides, and visibility hides on public catalogs

export function mergeManagedCatalog(
  baseList = [],
  { customItems = [], disabledIds = [], overrides = {}, customFilter = null } = {}
) {
  const disabledSet = new Set(disabledIds || []);

  const filteredCustom = (customItems || []).filter((item) => {
    if (!item || disabledSet.has(item.id)) return false;
    return customFilter ? customFilter(item) : true;
  });

  const mergedBase = (baseList || [])
    .filter((item) => item && !disabledSet.has(item.id))
    .map((item) => {
      const ov = overrides?.[item.id];
      return ov ? { ...item, ...ov } : item;
    });

  return [...filteredCustom, ...mergedBase];
}
