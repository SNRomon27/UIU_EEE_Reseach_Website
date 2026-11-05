/* Builds the page from data.js. Group members do not need to edit this file. */
(function () {
  "use strict";

  var D = window.SITE;
  if (!D) {
    // data.js has a mistake (for example a missing comma): say so instead of showing a blank page.
    var main = document.getElementById("main");
    if (main) {
      var note = document.createElement("div");
      note.className = "wrap";
      note.style.padding = "48px 20px";
      var title = document.createElement("h2");
      title.textContent = "The page content could not be loaded";
      var msg = document.createElement("p");
      msg.className = "section-note";
      msg.textContent = "There is probably a mistake in data.js, such as a missing comma, quote or bracket. Open data.js on GitHub, check the last edit, or use History to go back to the previous version.";
      note.appendChild(title);
      note.appendChild(msg);
      main.textContent = "";
      main.appendChild(note);
    }
    return;
  }

  var $ = function (sel) { return document.querySelector(sel); };

  // Build an element safely. Text is always inserted as text, never as HTML.
  function el(tag, props, children) {
    var node = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      if (k === "class") { node.className = props[k]; }
      else if (k === "text") { node.textContent = props[k]; }
      else { node.setAttribute(k, props[k]); }
    });
    (children || []).forEach(function (c) {
      if (c == null) { return; }
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function safeUrl(u) {
    return typeof u === "string" && /^https?:\/\//i.test(u.trim()) ? u.trim() : null;
  }

  function visible(x) { return x && x.hidden !== true; }

  function initials(name) {
    var parts = String(name || "").replace(/^Dr\.?\s+/i, "").split(/\s+/).filter(Boolean);
    if (!parts.length) { return "?"; }
    var first = parts[0].charAt(0);
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + last).toUpperCase();
  }

  function avatar(name, photo) {
    var box = el("div", { class: "avatar", "aria-hidden": "true" });
    var fallback = function () { box.textContent = initials(name); };
    if (photo) {
      var img = el("img", { src: "images/" + photo, alt: "", loading: "lazy" });
      img.addEventListener("error", function () { box.textContent = ""; fallback(); });
      box.appendChild(img);
    } else {
      fallback();
    }
    return box;
  }

  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) { return iso || ""; }
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(d);
  }

  function authorList(authors) {
    var wrap = el("span");
    (authors || []).forEach(function (a, i) {
      if (i > 0) { wrap.appendChild(document.createTextNode(i === authors.length - 1 ? " and " : ", ")); }
      var isPi = a === D.pi.authorName;
      wrap.appendChild(isPi ? el("span", { class: "is-pi", text: a }) : document.createTextNode(a));
    });
    return wrap;
  }

  function links(list, cls) {
    var items = (list || []).map(function (l) {
      var url = safeUrl(l && l.url);
      return url ? el("a", { href: url, target: "_blank", rel: "noopener", text: l.label || "Link" }) : null;
    }).filter(Boolean);
    return items.length ? el("div", { class: cls }, items) : null;
  }

  var pi = D.pi;
  var page = document.body.getAttribute("data-page");

  /* ---------- Old single-page links keep working ----------
     The old one-page site used #published and #members. They now live on their own pages. */
  if (page === "home") {
    var legacy = { "#published": "publications.html", "#members": "team.html" };
    if (legacy[location.hash]) { location.replace(legacy[location.hash]); return; }
  }

  /* ---------- Brand and page title ---------- */
  $("#brand").textContent = D.group.name;
  var titles = {
    home: D.group.name + " | " + pi.university,
    ongoing: "Ongoing Research | " + D.group.name,
    publications: "Publications | " + D.group.name,
    team: "Team | " + D.group.name
  };
  document.title = titles[page] || D.group.name;

  /* ---------- Mobile menu and Research dropdown ---------- */
  var navBtn = $(".nav-toggle");
  var nav = $("#site-nav");
  navBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    navBtn.setAttribute("aria-expanded", String(open));
  });
  var sub = $(".has-sub");
  var subBtn = $(".sub-toggle");
  subBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    var open = sub.classList.toggle("open");
    subBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", function (e) {
    if (!sub.contains(e.target)) { sub.classList.remove("open"); subBtn.setAttribute("aria-expanded", "false"); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      sub.classList.remove("open"); subBtn.setAttribute("aria-expanded", "false");
      nav.classList.remove("open"); navBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Shared data ---------- */
  var ongoing = (D.papers || []).filter(function (p) { return visible(p) && p.type === "ongoing"; });
  var published = (D.papers || []).filter(function (p) { return visible(p) && p.type === "published"; });
  var members = (D.members || []).filter(visible);

  function ongoingCards(box, list) {
    if (!list.length) {
      box.appendChild(el("p", { class: "empty", text: "Ongoing research will be listed here soon." }));
    }
    list.forEach(function (p) {
      box.appendChild(el("article", { class: "card" }, [
        p.status ? el("span", { class: "status", text: p.status }) : null,
        el("h3", { text: p.title }),
        p.description ? el("p", { class: "card-desc", text: p.description }) : null,
        links(p.links, "card-links"),
        el("p", { class: "card-authors" }, [authorList(p.authors)])
      ]));
    });
  }

  /* ---------- Home page ---------- */
  if (page === "home") {
    $("#hero-where").textContent = pi.department + ", " + pi.university;
    $("#hero-title").textContent = D.group.name;
    $("#hero-tagline").textContent = D.group.tagline || "";
    if (D.group.showWhere !== true) { $("#hero-where").hidden = true; }
    if (D.group.interests && D.group.interests.length) {
      $("#hero-interests").textContent = "Research interests: " + D.group.interests.join(", ") + ".";
    } else {
      $("#hero-interests").hidden = true;
    }

    var stat = function (n, label) {
      return el("div", { class: "stat" }, [el("div", { class: "stat-num", text: String(n) }), el("div", { class: "stat-label", text: label })]);
    };
    $("#stats").appendChild(stat(ongoing.length, "Ongoing projects"));
    $("#stats").appendChild(stat(published.length, "Publications"));
    $("#stats").appendChild(stat(members.length + 1, "Team members"));

    var about = $("#about-body");
    about.appendChild(el("p", { text: D.group.about || D.group.tagline || "" }));
    $("#sup-card").appendChild(el("div", { class: "sup-card" }, [
      avatar(pi.name, pi.photo),
      el("span", { class: "sup-label", text: "Supervisor" }),
      el("h3", { text: pi.name }),
      el("p", { text: pi.title }),
      el("p", { text: pi.department })
    ]));

    var areaBox = $("#areas");
    var areas = (D.group.areas || []).filter(visible);
    if (!areas.length) { $("#focus").hidden = true; }
    areas.forEach(function (a, i) {
      areaBox.appendChild(el("article", { class: "area" }, [
        el("div", { class: "area-num", "aria-hidden": "true", text: String(i + 1) }),
        el("h3", { text: a.title }),
        a.text ? el("p", { text: a.text }) : null
      ]));
    });

    ongoingCards($("#ongoing-list"), ongoing.slice(0, 3));

    var pubBox = $("#pub-preview");
    var recent = published.slice().sort(function (a, b) { return b.year - a.year; }).slice(0, 3);
    if (!recent.length) {
      pubBox.appendChild(el("p", { class: "empty", text: "The group's first publications will be listed here once they are published." }));
    } else {
      var ul = el("ul", { class: "pub-preview" });
      recent.forEach(function (p) {
        var venue = [p.venue, p.pages].filter(Boolean).join(", ");
        ul.appendChild(el("li", {}, [
          el("div", { class: "year", text: p.year }),
          el("div", {}, [
            el("p", { class: "pub-title", text: p.title }),
            el("p", { class: "pub-authors" }, [authorList(p.authors)]),
            venue ? el("p", { class: "pub-venue", text: venue }) : null
          ])
        ]));
      });
      pubBox.appendChild(ul);
    }

    var strip = $("#team-strip");
    strip.appendChild(el("li", { class: "team-chip" }, [
      avatar(pi.name, pi.photo), el("h3", { text: pi.name }), el("p", { text: pi.title })
    ]));
    members.filter(function (m) { return m.status !== "alumni"; }).slice(0, 11).forEach(function (m) {
      strip.appendChild(el("li", { class: "team-chip" }, [
        avatar(m.name, m.photo), el("h3", { text: m.name }), m.role ? el("p", { text: m.role }) : null
      ]));
    });

    if (pi.email) {
      $("#cta-btn").textContent = "Email the supervisor";
      $("#cta-btn").setAttribute("href", "mailto:" + pi.email);
    }
  }

  /* ---------- Ongoing research page ---------- */
  if (page === "ongoing") {
    ongoingCards($("#ongoing-list"), ongoing);
  }

  /* ---------- Publications page (published papers, grouped by year) ---------- */
  if (page === "publications") {
    var pubList = $("#published-list");
    if (!published.length) {
      pubList.appendChild(el("p", { class: "empty", text: "The group's first publications will be listed here once they are published." }));
    }
    var years = {};
    published.forEach(function (p) { (years[p.year] = years[p.year] || []).push(p); });
    Object.keys(years).sort(function (a, b) { return b - a; }).forEach(function (y) {
      var list = el("ul", { class: "pub-list" });
      years[y].forEach(function (p) {
        var venue = [p.venue, p.pages].filter(Boolean).join(", ");
        list.appendChild(el("li", {}, [
          el("p", { class: "pub-title", text: p.title }),
          el("p", { class: "pub-authors" }, [authorList(p.authors)]),
          venue ? el("p", { class: "pub-venue", text: venue }) : null,
          links(p.links, "pub-links")
        ]));
      });
      pubList.appendChild(el("div", { class: "year-group" }, [el("div", { class: "year", text: y }), list]));
    });
  }

  /* ---------- Team page ---------- */
  function photoBox(name, photo) {
    var box = el("div", { class: "profile-photo", "aria-hidden": "true" });
    var fallback = function () { box.textContent = initials(name); };
    if (photo) {
      var img = el("img", { src: "images/" + photo, alt: "", loading: "lazy" });
      img.addEventListener("error", function () { box.textContent = ""; fallback(); });
      box.appendChild(img);
    } else {
      fallback();
    }
    return box;
  }
  function profile(o) {
    return el("li", { class: "profile" + (o.lead ? " is-lead" : "") }, [
      photoBox(o.name, o.photo),
      el("div", { class: "profile-body" }, [
        el("h3", { text: o.name }),
        o.role ? el("p", { class: "profile-role", text: o.role }) : null,
        o.sub ? el("p", { class: "profile-sub", text: o.sub }) : null,
        o.bio ? el("p", { class: "profile-bio", text: o.bio }) : null,
        o.email ? el("p", { class: "profile-contact" }, [el("a", { href: "mailto:" + o.email, text: o.email })]) : null
      ])
    ]);
  }
  if (page === "team") {
    $("#pi-list").appendChild(profile({
      lead: true, name: pi.name, role: pi.title,
      sub: pi.department + ", " + pi.university, bio: pi.bio, email: pi.email, photo: pi.photo
    }));
    var current = members.filter(function (m) { return m.status !== "alumni"; });
    var alumni = members.filter(function (m) { return m.status === "alumni"; });
    var memberBox = $("#member-list");
    if (!current.length) {
      memberBox.appendChild(el("li", { class: "empty", text: "Group members will be listed here soon." }));
    }
    current.forEach(function (m) {
      memberBox.appendChild(profile({ name: m.name, role: m.role, bio: m.bio || m.interest, photo: m.photo }));
    });
    if (alumni.length) {
      $("#alumni-section").hidden = false;
      alumni.forEach(function (m) {
        $("#alumni-list").appendChild(profile({ name: m.name, role: m.role, bio: m.bio || m.interest, photo: m.photo }));
      });
    }
  }

  /* ---------- Footer ---------- */
  $("#footer-contact").textContent = "Contact: " + pi.name + (pi.email ? ", " + pi.email : "");
  $("#footer-updated").textContent = "Last updated " + formatDate(D.lastUpdated);

  /* ---------- In-page links ----------
     Scroll with JavaScript so the menu and buttons also work inside sandboxed
     previews, where plain #links do nothing. */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1);
      var target = id ? document.getElementById(id) : null;
      if (!target) { return; }
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      try { history.replaceState(null, "", "#" + id); } catch (err) { /* not allowed in some previews */ }
    });
  });

  /* ---------- Section links: always scroll to the section, even inside a preview frame ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) { return; }
    var id = a.getAttribute("href").slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) { return; }
    e.preventDefault();
    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    try { history.replaceState(null, "", "#" + id); } catch (err) { /* ignore */ }
  });
})();
