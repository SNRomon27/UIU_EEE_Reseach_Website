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
  var has = function (sel) { return !!$(sel); };
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
      var cardImg = imgSrc(p.image);
      box.appendChild(el("article", { class: "card" }, [
        cardImg ? el("img", { class: "card-media", src: cardImg, alt: "", loading: "lazy" }) : null,
        p.status ? el("span", { class: "status", text: p.status }) : null,
        el("h3", { text: p.title }),
        p.description ? el("p", { class: "card-desc", text: p.description }) : null,
        links(p.links, "card-links"),
        el("p", { class: "card-authors" }, [authorList(p.authors)])
      ]));
    });
  }

  // Published papers use the same card as ongoing research: picture, year badge, title, venue, description, links, authors.
  // If a paper has a "url", the whole card opens the publisher's page (new tab).
  function publicationCards(box, list) {
    if (!list.length) {
      box.appendChild(el("p", { class: "empty", text: "The group's first publications will be listed here once they are published." }));
    }
    list.forEach(function (p) {
      var venue = [p.venue, p.pages].filter(Boolean).join(", ");
      var cardImg = imgSrc(p.image);
      var url = safeUrl(p.url);
      var heading = el("h3", {}, [
        url
          ? el("a", { class: "card-link", href: url, target: "_blank", rel: "noopener" }, [
              p.title,
              el("span", { class: "sr-only", text: " (opens the paper on the publisher's site in a new tab)" })
            ])
          : p.title
      ]);
      box.appendChild(el("article", { class: "card pub-card" + (url ? " is-clickable" : "") }, [
        cardImg ? el("img", { class: "card-media", src: cardImg, alt: "", loading: "lazy" }) : null,
        el("div", { class: "card-body" }, [
          p.year ? el("span", { class: "status status-year", text: String(p.year) }) : null,
          heading,
          venue ? el("p", { class: "card-venue", text: venue }) : null,
          p.description ? el("p", { class: "card-desc", text: p.description }) : null,
          links(p.links, "card-links"),
          el("p", { class: "card-authors" }, [authorList(p.authors)])
        ])
      ]));
    });
  }
  // Newest year first; papers from the same year keep the order of data.js.
  var publishedSorted = published.map(function (p, i) { return { p: p, i: i }; })
    .sort(function (a, b) { return (b.p.year - a.p.year) || (a.i - b.i); })
    .map(function (x) { return x.p; });

  /* ---------- Small helpers for the new pages ---------- */
  function paras(v) { return Array.isArray(v) ? v.filter(Boolean) : (v ? [v] : []); }
  function safeHref(u) {
    u = String(u || "").trim();
    return /^(https?:\/\/|#|[\w\-\/]+\.html(#[\w\-]*)?$)/i.test(u) ? u : "";
  }
  function imgSrc(file) {
    return /^[\w.\- ]+$/.test(String(file || "")) ? "images/" + encodeURI(file) : "";
  }
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---------- Home page ---------- */
  if (page === "home") {
    var G = D.group;

    /* Hero background picture (chip design) */
    var heroImg = imgSrc(G.heroImage);
    if (heroImg) { $("#top").style.setProperty("--hero-img", "url('" + heroImg + "')"); }

    /* Hero slider */
    var slides = (G.heroSlides || []).filter(visible);
    if (!slides.length) {
      slides = [{ intro: "welcome to", title: "", text: pi.department + ", " + pi.university, button: "Learn more", link: "#about" }];
    }
    var slider = $("#hero-slider"), dotsBox = $("#hero-dots");
    var slideNodes = [], dotNodes = [], cur = 0, timer = null, paused = reduced;
    slides.forEach(function (sl, i) {
      var href = safeHref(sl.link);
      var node = el("div", { class: "hero-slide" + (i === 0 ? " is-active" : ""), role: "group", "aria-roledescription": "slide", "aria-label": (i + 1) + " of " + slides.length }, [
        sl.intro ? el("p", { class: "hero-intro", text: sl.intro }) : null,
        el(i === 0 ? "h1" : "h2", { class: "hero-title", text: sl.title || G.name }),
        sl.text ? el("p", { class: "hero-text", text: sl.text }) : null,
        sl.button && href ? el("a", { class: "btn btn-primary", href: href, text: sl.button }) : null
      ]);
      slideNodes.push(node);
      slider.appendChild(node);
      var dot = el("button", { class: "hero-dot", type: "button", "aria-label": "Show slide " + (i + 1) });
      dot.addEventListener("click", function () { show(i); restart(); });
      dotNodes.push(dot);
      dotsBox.appendChild(dot);
    });
    function show(i) {
      cur = (i + slideNodes.length) % slideNodes.length;
      slideNodes.forEach(function (n, k) { n.classList.toggle("is-active", k === cur); });
      dotNodes.forEach(function (d, k) { if (k === cur) { d.setAttribute("aria-current", "true"); } else { d.removeAttribute("aria-current"); } });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); if (!paused && slideNodes.length > 1) { timer = setInterval(function () { show(cur + 1); }, 7000); } }
    show(0);
    var pauseBtn = $("#hero-pause");
    function syncPause() {
      pauseBtn.classList.toggle("is-paused", paused);
      pauseBtn.setAttribute("aria-label", paused ? "Play slides" : "Pause slides");
    }
    if (slideNodes.length < 2) {
      $("#hero-controls").hidden = true;
    } else {
      $("#hero-prev").addEventListener("click", function () { show(cur - 1); restart(); });
      $("#hero-next").addEventListener("click", function () { show(cur + 1); restart(); });
      pauseBtn.addEventListener("click", function () { paused = !paused; syncPause(); restart(); });
      var hero = $("#top");
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", restart);
      hero.addEventListener("focusin", stop);
      hero.addEventListener("focusout", restart);
      document.addEventListener("visibilitychange", function () { if (document.hidden) { stop(); } else { restart(); } });
      syncPause();
      restart();
    }

    /* Stats over the hero, each block links to its page, numbers count up */
    var statBox = $("#stats");
    [
      { n: published.length, title: "Publications", desc: "Sharing our findings with the research community.", href: "publications.html" },
      { n: members.length + 1, title: "Research members", desc: "Researchers working on low-power analog circuits.", href: "team.html" },
      { n: ongoing.length, title: "Ongoing projects", desc: "Active research that is currently in progress.", href: "ongoing.html" }
    ].forEach(function (st) {
      var num = el("span", { class: "count", text: String(st.n) });
      statBox.appendChild(el("a", { class: "hero-stat", href: st.href }, [
        el("div", { class: "hero-stat-num" }, [num, st.n > 0 ? el("span", { class: "plus", text: "+" }) : null]),
        el("div", { class: "hero-stat-title", text: st.title }),
        el("p", { class: "hero-stat-desc", text: st.desc })
      ]));
      if (st.n > 1 && !reduced && "IntersectionObserver" in window) {
        num.textContent = "0";
        var io = new IntersectionObserver(function (entries) {
          if (!entries[0].isIntersecting) { return; }
          io.disconnect();
          var t0 = null;
          (function tick(t) {
            if (t0 === null) { t0 = t; }
            var k = Math.min((t - t0) / 1000, 1);
            num.textContent = String(Math.round(st.n * k));
            if (k < 1) { requestAnimationFrame(tick); }
          })(performance.now());
        });
        io.observe(num);
      }
    });

    /* About */
    $("#h-about").textContent = G.name;
    $("#about-lead").textContent = G.aboutHeadline || G.tagline || "";
    paras(G.about).forEach(function (t) { $("#about-body").appendChild(el("p", { text: t })); });
    $("#about-sup").appendChild(document.createTextNode("Supervisor: "));
    $("#about-sup").appendChild(el("a", { href: "team.html", text: pi.name }));
    $("#about-sup").appendChild(document.createTextNode(", " + pi.title));

    /* Our Research: topic blocks that link to the Ongoing Research page */
    var areas = (G.areas || []).filter(visible);
    if (!areas.length) { $("#focus").hidden = true; }
    $("#research-intro").textContent = G.researchIntro || "";
    if (!G.researchIntro) { $("#research-intro").hidden = true; }
    areas.forEach(function (ar, i) {
      var src = imgSrc(ar.image);
      var media = el("div", { class: "area-media", "aria-hidden": "true" }, [
        src ? el("img", { src: src, alt: "", loading: "lazy" }) : el("span", { class: "area-num", text: String(i + 1) })
      ]);
      var im = media.querySelector("img");
      if (im) { im.addEventListener("error", function () { media.textContent = ""; media.appendChild(el("span", { class: "area-num", text: String(i + 1) })); }); }
      $("#areas").appendChild(el("a", { class: "area", href: "ongoing.html" }, [
        media,
        el("div", { class: "area-body" }, [el("h3", { text: ar.title }), ar.text ? el("p", { text: ar.text }) : null])
      ]));
    });

    /* Ongoing + latest publications previews */
    ongoingCards($("#ongoing-list"), ongoing.slice(0, 3));
    publicationCards($("#pub-preview"), publishedSorted.slice(0, 3));

    /* Affiliations */
    var affs = (G.affiliations || []).filter(visible);
    if (!affs.length) { $("#affiliations").hidden = true; }
    affs.forEach(function (af) {
      var url = safeUrl(af.url), src = imgSrc(af.logo);
      var inner = src ? el("img", { src: src, alt: af.name || "" }) : document.createTextNode(af.name || "");
      var item = url
        ? el("a", { href: url, target: "_blank", rel: "noopener" }, [inner])
        : el("span", { class: "affil-item" }, [inner]);
      var im = item.querySelector && item.querySelector("img");
      if (im) { im.addEventListener("error", function () { item.textContent = af.name || ""; }); }
      $("#affil-list").appendChild(el("li", {}, [item]));
    });

    /* Contact + join */
    $("#c-name").textContent = pi.name + ", " + pi.title;
    if (pi.email) {
      $("#c-mail").textContent = pi.email;
      $("#c-mail").setAttribute("href", "mailto:" + pi.email);
    } else {
      $("#c-mail").hidden = true;
    }
    $("#c-addr").textContent = pi.department + ", " + pi.university;
    var J = G.join || {};
    $("#h-join").textContent = J.title || "Join the Group";
    $("#join-text").textContent = J.text || "";
    $("#join-btn").textContent = J.button || "Get in touch";
    $("#join-btn").setAttribute("href", pi.email ? "mailto:" + pi.email : "team.html");
  }

  /* ---------- Ongoing research page ---------- */
  if (page === "ongoing") {
    ongoingCards($("#ongoing-list"), ongoing);
  }

  /* ---------- Publications page (same card style as Ongoing Research) ---------- */
  if (page === "publications") {
    publicationCards($("#published-list"), publishedSorted);
  }

  /* ---------- Team page (TERRER-style profiles) ---------- */
  function tpPhoto(name, photo) {
    var src = imgSrc(photo);
    var box = el("div", { class: "tp-photo", "aria-hidden": "true" });
    var ph = function () { box.className = "tp-ph"; box.textContent = initials(name); };
    if (src) {
      var img = el("img", { src: src, alt: "", loading: "lazy" });
      img.addEventListener("error", function () { box.textContent = ""; ph(); });
      box.appendChild(img);
    } else {
      ph();
    }
    return box;
  }
  function pillRow(list, email) {
    var items = (list || []).map(function (l) {
      var url = safeUrl(l && l.url);
      return url ? el("a", { class: "tp-link", href: url, target: "_blank", rel: "noopener", text: l.label || "Link" }) : null;
    });
    if (email) { items.unshift(el("a", { class: "tp-link", href: "mailto:" + email, text: "Email" })); }
    items = items.filter(Boolean);
    return items.length ? el("div", { class: "tp-links" }, items) : null;
  }
  var SVG_NS = "http://www.w3.org/2000/svg";
  var ICONS = {
    linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    uiu: "M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"
  };
  function iconSvg(kind) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", ICONS[kind]);
    svg.appendChild(path);
    return svg;
  }
  // LinkedIn icon for everyone; UIU icon too when the person has a "uiu" field (faculty).
  // An empty address shows a greyed-out icon so the spot is ready to be filled in.
  function profileIcons(o) {
    var kinds = [["linkedin", "LinkedIn", o.linkedin]];
    if (Object.prototype.hasOwnProperty.call(o, "uiu")) { kinds.push(["uiu", "UIU profile", o.uiu]); }
    return el("div", { class: "tp-icons" }, kinds.map(function (k) {
      var url = safeUrl(k[2]);
      var label = k[1] + " of " + o.name;
      if (url) {
        var a = el("a", { class: "tp-icon is-" + k[0], href: url, target: "_blank", rel: "noopener", "aria-label": label, title: k[1] });
        a.appendChild(iconSvg(k[0]));
        return a;
      }
      var off = el("span", { class: "tp-icon is-off", role: "img", "aria-label": label + " (not added yet)", title: k[1] + " (not added yet)" });
      off.appendChild(iconSvg(k[0]));
      return off;
    }));
  }
  function bioParas(v) { return paras(v).map(function (t) { return el("p", { class: "tp-bio", text: t }); }); }

  if (page === "team") {
    var G2 = D.group;
    $("#tp-eyebrow").textContent = G2.name + " · " + pi.university;
    $("#tp-sub").textContent = G2.teamSubtitle || "";
    if (!G2.teamSubtitle) { $("#tp-sub").hidden = true; }
    var banner = imgSrc(G2.teamBanner);
    if (banner) { $("#tp-hero-bg").style.backgroundImage = "url('" + banner + "')"; }

    $("#tp-feat").appendChild(el("div", { class: "tp-feat" }, [
      tpPhoto(pi.name, pi.photo),
      el("div", { class: "tp-feat-b" }, [
        el("h2", { class: "tp-name", text: pi.name }),
        el("div", { class: "tp-role", text: pi.title + ", " + pi.department }),
        el("div", {}, bioParas(pi.bio)),
        profileIcons({ name: pi.name, linkedin: pi.linkedin, uiu: pi.uiu }),
        pillRow(pi.links, pi.email)
      ])
    ]));

    var current = members.filter(function (m) { return m.status !== "alumni"; });
    var alumni = members.filter(function (m) { return m.status === "alumni"; });
    var grid = $("#tp-grid");
    if (!current.length) {
      grid.appendChild(el("p", { class: "empty", text: "Group members will be listed here soon." }));
    }
    current.forEach(function (m) {
      grid.appendChild(el("article", { class: "tp-card" }, [
        tpPhoto(m.name, m.photo),
        el("div", { class: "tp-card-b" }, [
          el("h3", { class: "tp-name", text: m.name }),
          m.role ? el("div", { class: "tp-role", text: m.role }) : null,
          el("div", {}, bioParas(m.bio || m.interest)),
          profileIcons(m),
          pillRow(m.links)
        ])
      ]));
    });
    if (alumni.length) {
      $("#tp-alumni").hidden = false;
      alumni.forEach(function (m) {
        $("#tp-alum").appendChild(el("span", {}, [m.name, m.role ? el("em", { text: " · " + m.role }) : null]));
      });
    }
  }

  /* ---------- Footer ---------- */
  if (has("#f-brand")) {
    $("#f-brand").textContent = D.group.name;
    $("#f-tagline").textContent = D.group.tagline || "";
    $("#f-contact").appendChild(document.createTextNode(pi.name));
    $("#f-contact").appendChild(el("br"));
    if (pi.email) {
      $("#f-contact").appendChild(el("a", { href: "mailto:" + pi.email, text: pi.email }));
      $("#f-contact").appendChild(el("br"));
    }
    $("#f-contact").appendChild(document.createTextNode(pi.department + ", " + pi.university));
    $("#f-copy").textContent = "© " + new Date().getFullYear() + " | " + D.group.name + " | " + pi.university;
    $("#f-updated").textContent = "Last updated " + formatDate(D.lastUpdated);
  }
  if (has("#footer-contact")) {
    $("#footer-contact").textContent = "Contact: " + pi.name + (pi.email ? ", " + pi.email : "");
    $("#footer-updated").textContent = "Last updated " + formatDate(D.lastUpdated);
  }
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
