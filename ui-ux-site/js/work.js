// Simple tab toggle for the Work section — no framework needed for two panes.

document.querySelectorAll(".work__tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".work__tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".work__grid").forEach((g) => (g.hidden = true));

    tab.classList.add("active");
    document.getElementById(tab.dataset.target).hidden = false;
  });
});