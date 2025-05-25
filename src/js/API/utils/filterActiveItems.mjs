export function filterActiveItems(items) {
  const activeSwitch = document.getElementById("switchCheckChecked");
  if (activeSwitch && activeSwitch.checked) {
    const now = new Date();

    return items.filter((item) => new Date(item.endsAt) > now);
  }

  return items;
}
