// ==========================================================================
//  DATA FILE  -  this file holds the content of the whole site
//  This is the ONLY file group members need to edit.
//  (Design files: the .html pages, style.css and script.js. Please do not edit them.)
// ==========================================================================
//
//  WHAT TO EDIT WHERE
//  ------------------------------------------------------------------
//    1. GROUP        group name, tagline, home page text (hero, about, research areas), team banner
//    2. SUPERVISOR   supervisor's details, short bio and photo (rarely changes)
//    3. MEMBERS      add yourself here (name, role, photo)
//    4. PAPERS       4A ongoing papers   |   4B published papers
//
//  3 STEPS FOR ANY EDIT
//  ------------------------------------------------------------------
//    1. Find your section below (look for the big === banners).
//    2. Copy the TEMPLATE at the bottom of that section, paste it just above
//       the template, then delete the "//" at the start of each pasted line.
//       Keep the comma "," after the closing } or ]
//    3. Change "lastUpdated" below to today's date, save (commit), then open
//       the page and check that it still loads.
//
//  RULES
//  ------------------------------------------------------------------
//    - This repository is PUBLIC. Write only what is fine to show to everyone.
//      For ongoing work: a title and 1-2 general lines. No methods, no results.
//    - No personal phone numbers or personal email addresses.
//    - Keep the quotes " ", commas , and brackets { } [ ] exactly as in the
//      examples. One missing comma can blank the whole page.
//    - Photos: put the picture in the "images" folder, then write the file name
//      exactly (capital/small letters matter), e.g. photo: "rahim.jpg".
//      No photo? Leave photo: "" and the initials are shown.
//    - Any field you do not need can stay empty:  ""  (or  []  for lists).
//    - hidden: true only hides an entry on the page. It is still readable in
//      this file, so never put private information here.
//    - Lines that start with // are notes or templates. They do nothing.
// ==========================================================================

window.SITE = {

  // Change this to the date of your edit (YYYY-MM-DD). Shown in the page footer.
  lastUpdated: "2026-10-25",


  // ========================================================================
  //  1. GROUP  (title area at the top of the page; rarely changes)
  // ========================================================================
  group: {
    name: "Research Group",   // change when the group name is decided, e.g. "Semiconductor Devices Research Group"
    tagline: "Ongoing and published research from the Department of Electrical and Electronic Engineering, UIU.",
    interests: [
      // "Topic one",
      // "Topic two"
    ],
    // ---- Home page: background picture behind the hero banner (a file inside "images") ----
    heroImage: "chip-design.svg",

    // ---- Home page: hero slider (3 slides work best). title "" = use the group name. ----
    heroSlides: [
      { intro: "welcome to", title: "", text: "Department of Electrical and Electronic Engineering, United International University", button: "Learn more", link: "#about" },
      { intro: "our research", title: "Low-power analog circuits", text: "Low-voltage, low-power analog circuit design for wearable front-end applications.", button: "Explore research", link: "ongoing.html" },
      { intro: "meet our", title: "Research team", text: "The supervisor and members of the group.", button: "Meet the team", link: "team.html" }
    ],

    // ---- Home page: About section ----
    aboutHeadline: "Designing low-power analog circuits for wearable electronics",
    about: [
      "We are a research group in the Department of Electrical and Electronic Engineering at United International University. Our work focuses on low-voltage, low-power circuit design, with an emphasis on analog front-end circuits for wearable applications.",
      "Our members work together on circuit design and analysis, from the first idea and simulation through to writing up the results for publication.",
      "Explore our ongoing research, meet our team members, and read our publications on this website."
    ],

    // ---- Home page: "Our Research" section ----
    researchIntro: "Our research centres on low-voltage, low-power analog circuit design. The main topics are:",
    // Cards link to the Ongoing Research page. "image" is optional: a file name inside the "images" folder.
    areas: [
      { title: "Low-Power Analog Circuits", text: "Designing analog building blocks that operate at very low supply voltage and power.", image: "area-low-power.svg" },
      { title: "Wearable Front-Ends", text: "Circuits that acquire and condition signals for compact, battery-powered wearable devices.", image: "area-wearable.svg" },
      { title: "Low-Voltage Circuit Design", text: "Techniques such as current reuse that keep performance up while supply voltage goes down.", image: "area-low-voltage.svg" }
    ],

    // ---- Home page: "Affiliations" (logos are optional: a file name inside "images") ----
    affiliations: [
      { name: "United International University", logo: "", url: "https://www.uiu.ac.bd" },
      { name: "Department of Electrical and Electronic Engineering", logo: "", url: "" }
    ],

    // ---- Home page: "Join the group" box next to the contact details ----
    join: {
      title: "Join the Group",
      text: "We welcome motivated students and researchers who are interested in low-power circuit design. If you would like to join, please get in touch with the supervisor.",
      button: "Get in touch"
    },

    // ---- Team page banner ----
    teamSubtitle: "Researchers working on low-power analog circuit design.",
    teamBanner: "team-banner.svg",   // picture behind "Meet the team": a file inside "images". Replace with a real team photo, e.g. "team.jpg"

    // Optional, off for now:
    showWhere: false          // true = show "Department..., University" above the title
  },


  // ========================================================================
  //  2. SUPERVISOR  (rarely changes)
  // ========================================================================
  pi: {
    name: "Dr. Md. Iqbal Bahar Chowdhury",
    authorName: "Md. Iqbal Bahar Chowdhury",   // spelling used in author lists, so it is highlighted. Do not change.
    title: "Professor",
    department: "Department of Electrical and Electronic Engineering",
    university: "United International University",
    email: "iqbal@eee.uiu.ac.bd",
    // bio can be one string or a list of paragraphs (like the Team page of a lab website).
    bio: [
      "Professor in the Department of Electrical and Electronic Engineering, United International University, and supervisor of this research group."
    ],
    // Profile icons on the Team page (leave "" to show a greyed-out icon).
    // TODO: replace these two with the exact profile addresses.
    linkedin: "https://www.linkedin.com/in/dr-md-iqbal-bahar-chowdhury-b307021b/",
    uiu: "https://www.uiu.ac.bd",
    // Optional extra link buttons on the Team page, e.g. { label: "Google Scholar", url: "https://..." }
    links: [],
    photo: "ibcsir.jpg"       // file inside the "images" folder
  },


  // ========================================================================
  //  3. MEMBERS  (the supervisor is added automatically at the top)
  //     Only "name" is required. role, bio, interest and photo can be "".
  //     "bio" is a short biography shown on the Team page (falls back to "interest").
  //     Optional: linkedin: "https://www.linkedin.com/in/..." shows a LinkedIn icon (greyed out when empty).
  //     Optional: uiu: "https://..." shows a UIU profile icon.
  //     Optional: links: [{ label: "ORCID", url: "https://..." }] adds link buttons to the profile.
  //     Optional: status: "alumni" moves the person to the Alumni list (name and role only).
  // ========================================================================
  members: [

    // ---- Add new members ABOVE the template below (keep the comma) ----

    // PLACEHOLDER MEMBERS: replace each "Member Name N" with the real name, role, biography,
    // photo (a file in "images") and LinkedIn address. Delete any you do not need.
    { name: "Member Name 1", role: "Research Student", bio: "Short biography to be added: academic background, research interests and current work.", linkedin: "", photo: "" },
    { name: "Member Name 2", role: "Research Student", bio: "Short biography to be added: academic background, research interests and current work.", linkedin: "", photo: "" },
    { name: "Member Name 3", role: "Research Student", bio: "Short biography to be added: academic background, research interests and current work.", linkedin: "", photo: "" },
    { name: "Member Name 4", role: "Research Student", bio: "Short biography to be added: academic background, research interests and current work.", linkedin: "", photo: "" },
    { name: "Member Name 5", role: "Research Student", bio: "Short biography to be added: academic background, research interests and current work.", linkedin: "", photo: "" },
    { name: "Member Name 6", role: "Research Student", bio: "Short biography to be added: academic background, research interests and current work.", linkedin: "", photo: "" },

    // Template - copy it up here, then delete the // at the start of each line:
    // { name: "Full name", role: "Research student", bio: "Two or three lines about the member.", linkedin: "https://www.linkedin.com/in/...", links: [], interest: "One line about their research", photo: "full-name.jpg" },

  ],


  // ========================================================================
  //  4. PAPERS
  //     Every paper needs  type: "ongoing"  or  type: "published".
  //     The page sorts them by type, so the order in this file does not matter.
  //     Authors: write the names in the order shown on the paper.
  //     To move an ongoing paper to Published: change type to "published",
  //     delete status and description, add venue, pages, year (and links).
  // ========================================================================
  papers: [

    // ======================================================================
    //  4A. ONGOING PAPERS
    //      Required: type, title.  Optional: status, description, image, authors, links.
    //      status examples: "Data collection", "Writing", "Under review"
    // ======================================================================

    // ---- Add new ongoing papers ABOVE the template below (keep the comma) ----

    {
      type: "ongoing",
      title: "A 1-V Ultra-Low-Power Recycling Current-Reuse OTA for Wearable Analog Front-End Applications",
      status: "Writing",
      description: "Low-voltage, low-power analog circuit design for wearable front-end applications.",
      image: "project-ota.svg",   // optional picture: a file inside "images"
      authors: ["Md. Iqbal Bahar Chowdhury", "Author name", "Author name"],
      links: []
    },

    // Template - copy it up here, then delete the // at the start of each line:
    // {
    //   type: "ongoing",
    //   title: "Paper title",
    //   status: "Writing",
    //   description: "One or two general lines about the topic. No methods or results before publication.",
    //   image: "project-name.jpg",
    //   authors: ["Md. Iqbal Bahar Chowdhury", "Member name", "Member name"],
    //   links: []
    // },


    // ======================================================================
    //  4B. PUBLISHED PAPERS
    //      Required: type, title, year.  Optional: venue, pages, image, authors, links.
    //      They appear on the Publications page, newest year first.
    // ======================================================================

    // ---- Add new published papers ABOVE the template below (keep the comma) ----

    // PLACEHOLDER: a sample entry so the Publications tab is not empty. Replace it with a real paper.
    {
      type: "published",
      title: "Sample Published Paper Title",
      venue: "Journal or Conference Name",
      pages: "pp. 1-4",
      year: 2026,
      image: "publication-sample.svg",   // optional picture: a file inside "images"
      authors: ["Md. Iqbal Bahar Chowdhury", "Author name"],
      links: []
    },

    // Template - copy it up here, then delete the // at the start of each line:
    // {
    //   type: "published",
    //   title: "Paper title",
    //   venue: "Journal or conference name",
    //   pages: "pp. 1-4",
    //   year: 2027,
    //   image: "paper-name.jpg",
    //   authors: ["Md. Iqbal Bahar Chowdhury", "Member name", "Member name"],
    //   links: [{ label: "DOI", url: "https://doi.org/..." }]
    // },

  ]
};
