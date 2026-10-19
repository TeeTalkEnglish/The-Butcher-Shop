document.querySelectorAll(".reveal-button").forEach((button) => {
  const answer = document.getElementById(button.getAttribute("aria-controls"));

  if (!answer) {
    console.error("Answer panel not found for reveal button:", button);
    return;
  }

  button.textContent = "Show answer";

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    answer.hidden = isExpanded;
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.textContent = isExpanded ? "Show answer" : "Hide answer";
  });
});
