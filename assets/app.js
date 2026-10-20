(function () {
  "use strict";
  var CV = window.CV;

  /* ---------- state: language & theme ----------
     URL params (?lang=es|en, ?theme=light|dark, ?collapsed=all) exist for
     testing and deep links; otherwise preferences come from localStorage
     and fall back to the device settings. */
  var params = new URLSearchParams(location.search);

  function stored(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  var lang = params.get("lang") || stored("lang") ||
    ((navigator.language || "en").toLowerCase().indexOf("es") === 0 ? "es" : "en");
  if (lang !== "es" && lang !== "en") lang = "en";

  var theme = params.get("theme") || stored("theme") ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  if (theme !== "dark" && theme !== "light") theme = "light";

  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("lang", lang);

  /* ---------- render ---------- */
  var L = CV[lang];
  var UI = CV.ui[lang];

  document.title = L.metaTitle;
  var md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", L.metaDescription);

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderBody(section, container) {
    if (section.type === "paragraph") {
      container.appendChild(el("p", "summary-text", section.text));
    } else if (section.type === "jobs") {
      section.jobs.forEach(function (job) {
        var j = el("div", "job");
        j.appendChild(el("div", "period", job.period));
        j.appendChild(el("div", "role", job.role));
        var org = el("div", "org");
        org.appendChild(document.createTextNode(job.org));
        if (job.note) org.appendChild(el("span", "note", job.note));
        j.appendChild(org);
        if (job.bullets && job.bullets.length) {
          var ul = el("ul");
          job.bullets.forEach(function (b) { ul.appendChild(el("li", null, b)); });
          j.appendChild(ul);
        }
        container.appendChild(j);
      });
    } else if (section.type === "skillgroups") {
      section.groups.forEach(function (g) {
        var gr = el("div", "skill-group");
        gr.appendChild(el("div", "label", g.label));
        var chips = el("div", "chips");
        g.items.forEach(function (i) { chips.appendChild(el("span", "chip", i)); });
        gr.appendChild(chips);
        container.appendChild(gr);
      });
    } else if (section.type === "list") {
      var ul = el("ul", "plain");
      section.items.forEach(function (i) { ul.appendChild(el("li", null, i)); });
      container.appendChild(ul);
    }
  }

  var nav = document.getElementById("nav");
  var main = document.getElementById("sections");
  var startCollapsed = params.get("collapsed") === "all";
  var startExpanded = params.get("expanded") === "all";

  L.sections.forEach(function (section, idx) {
    var a = el("a", null, section.title);
    a.href = "#" + section.id;
    nav.appendChild(a);

    var card = el("section", "card");
    card.id = section.id;
    var open = startExpanded || (!startCollapsed && idx === 0);
    if (open) card.classList.add("open");

    var head = el("button", "section-head");
    head.setAttribute("aria-expanded", open ? "true" : "false");
    head.setAttribute("aria-controls", "body-" + section.id);
    head.appendChild(el("span", null, section.title));
    head.innerHTML += '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';

    var body = el("div", "section-body");
    body.id = "body-" + section.id;
    var clip = el("div", "clip");
    var pad = el("div", "pad");
    renderBody(section, pad);
    clip.appendChild(pad);
    body.appendChild(clip);

    head.addEventListener("click", function () {
      var isOpen = card.classList.toggle("open");
      head.setAttribute("aria-expanded", isOpen ? "true" : "false");
      syncExpandBtn();
    });

    card.appendChild(head);
    card.appendChild(body);
    main.appendChild(card);
  });

  /* ---------- controls ---------- */
  var expandBtn = document.getElementById("expand-all");
  function allOpen() {
    var cards = main.querySelectorAll(".card");
    for (var i = 0; i < cards.length; i++) {
      if (!cards[i].classList.contains("open")) return false;
    }
    return true;
  }
  function syncExpandBtn() {
    expandBtn.textContent = allOpen() ? UI.collapseAll : UI.expandAll;
  }
  expandBtn.addEventListener("click", function () {
    var target = !allOpen();
    main.querySelectorAll(".card").forEach(function (c) {
      c.classList.toggle("open", target);
      c.querySelector(".section-head").setAttribute("aria-expanded", target ? "true" : "false");
    });
    syncExpandBtn();
  });
  syncExpandBtn();

  var langBtn = document.getElementById("lang-toggle");
  langBtn.textContent = UI.langLabel;
  langBtn.addEventListener("click", function () {
    store("lang", lang === "en" ? "es" : "en");
    location.reload();
  });

  var themeBtn = document.getElementById("theme-toggle");
  themeBtn.setAttribute("aria-label", UI.themeLabel);
  themeBtn.setAttribute("title", UI.themeLabel);
  function paintThemeBtn() {
    themeBtn.textContent = theme === "dark" ? "☀︎" : "☾";
  }
  paintThemeBtn();
  themeBtn.addEventListener("click", function () {
    theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    store("theme", theme);
    paintThemeBtn();
  });

  /* ---------- hero & footer ---------- */
  document.getElementById("hero-name").textContent = CV.name;
  document.getElementById("hero-headline").textContent = L.headline;
  var li = document.getElementById("linkedin-link");
  li.href = CV.linkedin;
  document.getElementById("linkedin-text").textContent = "LinkedIn";
  document.getElementById("foot-year").textContent = String(new Date().getFullYear());
  document.getElementById("foot-name").textContent = CV.name;
})();
