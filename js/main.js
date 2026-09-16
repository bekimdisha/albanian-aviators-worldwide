// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      const expanded = links.classList.contains("open");
      toggle.setAttribute("aria-expanded", String(expanded));
    });
    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => links.classList.remove("open"));
    });
  }

  // Member directory filtering (members.html only)
  const filterBar = document.querySelector(".filter-bar");
  const memberCards = document.querySelectorAll("[data-region]");
  if (filterBar && memberCards.length) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const region = btn.dataset.filter;
      memberCards.forEach((card) => {
        const match = region === "all" || card.dataset.region === region;
        card.style.display = match ? "" : "none";
      });
    });
  }

  // Contact form (static demo — no backend wired up)
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.getElementById("form-status");
      if (status) {
        status.textContent = "Thanks — this form isn't connected to a server yet, so nothing was actually sent.";
        status.style.color = "#d21f3c";
      }
    });
  }
});
