export function ArchivedFilter() {
  return (arr = [], archived = false) => arr.filter((elm) => elm.archived === archived);
}
