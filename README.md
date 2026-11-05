# Research Group Website

**Only edit `data.js`. Do not touch the other files.**

The site has four pages. All of them are built from `data.js`:

| Page | File | Content |
|------|------|---------|
| Home | `index.html` | Sliding banner with live counters, about, our research, ongoing research, latest publications, affiliations, contact and join box |
| Research -> Ongoing Research | `ongoing.html` | Ongoing papers |
| Research -> Publications | `publications.html` | Published papers as cards (same style as Ongoing Research), newest first |
| Team | `team.html` | Banner, featured supervisor profile, member profiles (photo, name, designation, biography, links) and alumni |

---

## How to open the website (step by step)

The site is plain HTML, CSS and JavaScript. It needs no build step and no installation. Choose **Option A** (quickest), **Option B** (recommended for reviewing changes) or **Option C** (the live site on GitHub Pages).

### Option A: Open it directly from your computer

1. Open the repository on GitHub: `https://github.com/SNRomon27/UIU_EEE_Reseach_Website`.
2. Click the branch menu (it says `main`) and select the branch you want to review, for example `claude/inspiring-mendel-d98utv`.
3. Click the green **Code** button -> **Download ZIP**.
4. Open the downloaded ZIP file and **extract** it to a folder. Do not open the site from inside the ZIP.
5. Open the extracted folder and double-click **`index.html`**. It opens in your web browser.
6. Use the top menu (**Home**, **Research**, **Team**) to move between pages. Hover over **Research** to see **Ongoing Research** and **Publications**.

Note: the site loads its fonts from Google Fonts, so an internet connection gives the best look. Without it, the page still works with fallback fonts.

### Option B: Run a local web server (recommended)

A local server behaves exactly like the real website and is the best way to test every page.

1. Install **Git** and **Python 3** if you do not have them (both are free).
2. Open a terminal (Command Prompt, PowerShell or Terminal) and download the project:

   ```bash
   git clone https://github.com/SNRomon27/UIU_EEE_Reseach_Website.git
   ```

3. Go into the project folder:

   ```bash
   cd UIU_EEE_Reseach_Website
   ```

4. Switch to the branch you want to review (skip this step to view `main`):

   ```bash
   git checkout claude/inspiring-mendel-d98utv
   ```

5. Start the local server:

   ```bash
   python3 -m http.server 8000
   ```

   On Windows, use `python -m http.server 8000` if `python3` is not found.
6. Open your browser and go to **http://localhost:8000**.
7. Check the pages:
   - Home: `http://localhost:8000/index.html`
   - Ongoing Research: `http://localhost:8000/ongoing.html`
   - Publications: `http://localhost:8000/publications.html`
   - Team: `http://localhost:8000/team.html`
8. To test phone and tablet layouts, press **F12** in the browser, then click the **device toolbar** icon (or press **Ctrl+Shift+M**) and pick a device size.
9. When you finish, go back to the terminal and press **Ctrl+C** to stop the server.

After you edit `data.js` or any other file, save it and refresh the browser page (**Ctrl+R**, or **Ctrl+Shift+R** to bypass the cache).

### Option C: Open the live website on GitHub Pages

1. Open the repository on GitHub and go to **Settings** -> **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose the branch (`main` for the published site, or a review branch to preview changes) and the folder **`/ (root)`**, then click **Save**.
4. Wait 1-2 minutes, then refresh the Pages settings screen. A banner shows the site address:
   `https://snromon27.github.io/UIU_EEE_Reseach_Website/`
5. Open that address in your browser.

Changes only appear on the live site after they are merged into the branch selected in step 3.

### Troubleshooting

- **Blank page or "The page content could not be loaded":** `data.js` has a mistake, usually a missing comma or quote. See the section below.
- **Styles look broken:** you probably opened a single file from inside the ZIP. Extract the whole ZIP first, so `style.css`, `script.js` and `data.js` sit next to the HTML files.
- **A photo does not show:** check that the file name in `data.js` matches the file in the `images` folder exactly, including capital and small letters.
- **`localhost:8000` does not load:** make sure the terminal is still running the server, and that you ran the command from inside the project folder.

---

## How to edit

1. Open the repository on GitHub -> **`data.js`** -> click the pencil icon.
2. Find your section (look for the large `=====` banners):
   `3. MEMBERS` | `4A. ONGOING PAPERS` | `4B. PUBLISHED PAPERS`
3. Copy the **Template** at the bottom of the section and paste it **just above** the Template. Then delete the `//` at the start of every pasted line.
4. Set `lastUpdated` at the top to today's date: `"YYYY-MM-DD"`.
5. Click **Commit changes** -> choose **Create a new branch and start a pull request**.
6. When the admin approves and merges, the page updates in 1-2 minutes.

---

## Copy-paste blocks

**Member**
```js
{ name: "Full name", role: "Research student", bio: "Two or three lines about the member.", interest: "One line about your research", photo: "full-name.jpg" },
```

**Ongoing paper**
```js
{
  type: "ongoing",
  title: "Paper title",
  status: "Writing",
  description: "One or two general lines. No methods or results.",
  authors: ["Md. Iqbal Bahar Chowdhury", "Member name"],
  links: []
},
```

**Published paper**
```js
{
  type: "published",
  title: "Paper title",
  venue: "Journal or conference name",
  pages: "pp. 1-4",
  year: 2027,
  authors: ["Md. Iqbal Bahar Chowdhury", "Member name"],
  links: [{ label: "DOI", url: "https://doi.org/..." }]
},
```

- Leave anything you do not need empty: `""` or `[]`. Do not delete the field.
- Required: `name` for a member; `type` and `title` for a paper; `year` as well for a published paper.
- When a paper is published: change `type` to `"published"`, delete `status` and `description`, and add `venue`, `pages` and `year`.
- To move a member to the Alumni list on the Team page, add `status: "alumni"` to their entry.
- **Home page text** lives in the `GROUP` section of `data.js`:
  - `heroSlides`: the sliding banner at the top (small intro line, title, text, button label and button link).
  - `aboutHeadline` and `about`: the About section (`about` is a list of paragraphs).
  - `researchIntro` and `areas`: the "Our Research" blocks. Each block can have an optional `image` (a file in the `images` folder).
  - `affiliations`: the Affiliations row (an optional `logo` file in the `images` folder and an optional `url`).
  - `join`: the "Join the Group" box next to the contact details.
  - The three counters over the banner (Publications, Research members, Ongoing projects) are counted automatically.
- **Pictures:** put the picture file in the `images` folder and write its exact file name in `data.js`.
  - `heroImage` (GROUP section): the chip-design picture behind the home page banner.
  - `image` on each ongoing paper, published paper and research area: the picture shown with it. It is optional.
  - `teamBanner`: the picture behind "Meet the team". The supplied `team-banner.svg` is an illustration; replace it with a real team photo (for example `team.jpg`).
- **Team page** text: `teamSubtitle` in the `GROUP` section; the supervisor's `bio` (one text or a list of paragraphs) in the `SUPERVISOR` section; each member's `bio` in the `MEMBERS` section.
- **Profile icons:** every profile shows a LinkedIn icon (`linkedin: "https://www.linkedin.com/in/..."`). The supervisor also has a UIU profile icon (`uiu`). An empty address shows a greyed-out icon.
- **Placeholders:** `Member Name 1` to `Member Name 6` and the sample published paper are placeholders. Replace them with real information.
- To add link buttons (for example ORCID or Google Scholar) to a profile: `links: [{ label: "ORCID", url: "https://orcid.org/..." }]`.

---

## Adding a photo

1. Use a square photo under 500 KB. Use a lowercase name with no spaces: `rahim-hasan.jpg`.
2. In the repository, open the **`images`** folder -> **Add file -> Upload files** -> **Commit changes**.
3. In `data.js`, write **exactly the same file name**: `photo: "rahim-hasan.jpg"`.

If the photo does not appear, the file name does not match (`.JPG` and `.jpg` are different). The person's initials are shown instead.

---

## Rules

- The repository is **public**. Write only what is fine for everyone to see.
- For an ongoing paper, write only the title and one or two general lines. No methods or results.
- No personal phone numbers or personal email addresses.
- Keep `" "`, `,` and `{ } [ ]` exactly as in the examples. One missing comma can break the whole page.
- Ask for permission before using someone else's photo.

---

## If the page shows "The page content could not be loaded"

There is a mistake in `data.js`. Look at the line mentioned in the message, or just above it (usually a missing comma or `"`).
If you cannot find it: `data.js` -> **History** -> open the previous working version and restore it.

---

## For the admin

- **Add a member:** repository -> Settings -> **Collaborators and teams** -> **Add people** -> role **Write**.
- **Approval rule:** Settings -> **Rules -> Rulesets -> New branch ruleset** -> target the default branch -> **Require a pull request before merging** (approvals: 1).
- **Publish the site:** Settings -> **Pages** -> branch `main`, folder `/ (root)`.
- **When a university domain is available:** Settings -> Pages -> **Custom domain** -> **Enforce HTTPS**. Do not delete the `CNAME` file.
