export function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toastContainer";
  container.className = "toast-container position-fixed top-0 end-0 p-3"; // Top-right position
  document.body.appendChild(container);
  return container;
}
