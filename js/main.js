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

  // Mentor request prefill (contact.html?mentor=Name, linked from mentorship.html)
  const mentorName = new URLSearchParams(window.location.search).get("mentor");
  if (mentorName) {
    const eyebrow = document.getElementById("contact-eyebrow");
    const heading = document.getElementById("contact-heading");
    const lead = document.getElementById("contact-lead");
    const message = document.getElementById("message");
    if (eyebrow) eyebrow.textContent = "Mentorship Request";
    if (heading) heading.textContent = `Requesting mentorship from ${mentorName}`;
    if (lead) lead.textContent = "Tell us a bit about your background and goals, and we'll pass this along to your requested mentor.";
    if (message) message.value = `Hi — I'd like to request mentorship from ${mentorName}.\n\nA bit about me and what I'm hoping to learn:\n`;
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
