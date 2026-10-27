/* Davinder Singh Portfolio — navigation, scroll reveals and small interactions */
(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  const backTop = document.querySelector(".back-top");
  const year = document.querySelector("#year");

  // Current year in the footer.
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation: open/close and close after choosing a section.
  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      nav.classList.toggle("open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  // Show a back-to-top control after scrolling.
  const updateBackTop = () => {
    if (backTop) backTop.classList.toggle("visible", window.scrollY > 600);
  };
  window.addEventListener("scroll", updateBackTop, { passive: true });
  updateBackTop();

  // Progressive reveal animation; content remains visible if IntersectionObserver is unavailable.
  const revealTargets = document.querySelectorAll(
    ".intro-grid, .stat, .project-card, .services-heading, .service-row, .timeline-item, .skill-cloud span"
  );

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("reveal-ready");
    revealTargets.forEach((element) => element.classList.add("reveal"));

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    revealTargets.forEach((element) => observer.observe(element));
  }

  // Reveal full sections as they enter the viewport.
  // If IntersectionObserver is unavailable or reduced motion is preferred, sections remain visible.
  const sections = document.querySelectorAll("main > section:not(.hero)");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("section-motion-ready");
    const sectionObserver = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Console marker to help verify that script.js loaded successfully.
  console.info("Davinder Singh portfolio JavaScript loaded successfully.");
})();
