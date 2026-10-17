/* ===================================================================
   Saharat Labs — main.js
   - bilingual switch (TH/EN) via [data-th] / [data-en]
   - sticky nav state, mobile menu, scroll reveal, footer year
   =================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "sl-lang";
  var DEFAULT_LANG = "th";
  var currentLang = DEFAULT_LANG;

  /* -------------------------------------------------- language switch */
  function applyLang(lang) {
    currentLang = lang;
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
  var revealIO = null;

  function observeReveal(items) {
    if (!items || !items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function () { el.classList.add("in"); }, Math.min(i * 60, 240));
            revealIO.unobserve(el);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    items.forEach(function (el) { revealIO.observe(el); });
  }

  function initReveal() {
    observeReveal(document.querySelectorAll(".reveal"));
  }

  /* ------------------------------------------------ projects (JSON) */
  function buildCard(p) {
    var art = document.createElement("article");
    art.className = "card reveal";

    var top = document.createElement("div");
    top.className = "card-top";
    var dot = document.createElement("span");
    dot.className = "dot";
    dot.setAttribute("aria-hidden", "true");      // จุดตกแต่ง
    var h3 = document.createElement("h3");
    h3.textContent = p.title || "";
    top.appendChild(dot);
    top.appendChild(h3);

    var desc = document.createElement("p");
    desc.setAttribute("data-th", p.desc_th || "");
    desc.setAttribute("data-en", p.desc_en || "");
    desc.textContent = p.desc_th || "";

    var link = document.createElement("a");
    link.className = "card-link";
    link.href = p.url || "#";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    var label = document.createElement("span");
    label.setAttribute("data-th", p.link_th || "เปิด");
    label.setAttribute("data-en", p.link_en || "Open");
    label.textContent = p.link_th || "เปิด";
    link.appendChild(label);
    link.appendChild(document.createTextNode(" →"));

    art.appendChild(top);
    art.appendChild(desc);
    art.appendChild(link);
    return art;
  }

  function initProjects() {
    var grid = document.getElementById("projectsGrid");
    if (!grid || !window.fetch) return;   // ไม่มี fetch → ปล่อย fallback แสดงต่อ

    fetch("assets/data/projects.json", { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (list) {
        if (!Array.isArray(list) || !list.length) return;
        grid.textContent = "";            // ล้าง fallback
        var cards = list.map(buildCard);
        cards.forEach(function (c) { grid.appendChild(c); });
        observeReveal(cards);             // ให้ animation reveal
        applyLang(currentLang);           // ให้ตรงภาษาปัจจุบัน
      })
      .catch(function (err) {
        if (window.console) console.warn("โหลด projects.json ไม่สำเร็จ:", err);
      });
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
    initProjects();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
