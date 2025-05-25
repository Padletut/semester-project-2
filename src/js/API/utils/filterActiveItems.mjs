export function filterActiveItems(items) {
  const activeSwitch = document.getElementById("switchCheckChecked");
  if (activeSwitch && activeSwitch.checked) {
    const now = new Date();
    console.log(
      "Filtered items:",
      items.filter((item) => new Date(item.endsAt) > now),
    );
    return items.filter((item) => new Date(item.endsAt) > now);
  }
  console.log("No active filter applied, returning all items.");
  console.log("Items before filtering:", items);
  return items;
}
