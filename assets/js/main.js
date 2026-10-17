/* ===================================================================
   Saharat Labs — main.js
   - bilingual switch (TH/EN) via [data-th] / [data-en]
   - sticky nav state, mobile menu, scroll reveal, footer year
   =================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "sl-lang";
  var DEFAULT_LANG = "th";

  /* -------------------------------------------------- language switch */
  function applyLang(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-th][data-en]").forEach(function (el) {
      var text = el.getAttribute("data-" + lang);
      if (text == null) return;
      el.textContent = text;
    });

    document.querySelectorAll("[data-th-placeholder][data-en-placeholder]").forEach(function (el) {
      var text = el.getAttribute("data-" + lang + "-placeholder");
      if (text != null) el.setAttribute("placeholder", text);
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var on = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function initLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved !== "th" && saved !== "en") {
      saved = (navigator.language || "").toLowerCase().indexOf("th") === 0 ? "th" : DEFAULT_LANG;
    }
    applyLang(saved);

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });
  }

  /* ------------------------------------------------------- nav state */
  function initNav() {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("burger");
    var links = document.getElementById("navLinks");

    function onScroll() {
      if (!nav) return;
      nav.classList.toggle("scrolled", window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (burger && links) {
      burger.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      links.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          links.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  /* --------------------------------------------------- scroll reveal */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { el.classList.add("in"); }, Math.min(i * 60, 240));
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------ year */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------- active nav link */
  function initActiveNav() {
    var links = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!links.length) return;

    var map = {};
    links.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute("href").slice(1));
      if (sec) map[sec.id] = a;
    });

    function setCurrent(active) {
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      if (active) active.setAttribute("aria-current", "page");
    }

    links.forEach(function (a) {
      a.addEventListener("click", function () { setCurrent(a); });
    });

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && map[entry.target.id]) {
            setCurrent(map[entry.target.id]);
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
    }
  }

  /* ------------------------------------------------------------ boot */
  function boot() {
    initLang();
    initNav();
    initActiveNav();
    initReveal();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
