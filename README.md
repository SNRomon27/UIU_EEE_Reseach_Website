# Research Group Website

**Only edit `data.js`. Do not touch the other files.**

The site has four pages. All of them are built from `data.js`:

| Page | File | Content |
|------|------|---------|
| Home | `index.html` | Hero, about, research focus, ongoing research, latest publications, team preview |
| Research → Ongoing Research | `ongoing.html` | Ongoing papers |
| Research → Publications | `publications.html` | Published papers, grouped by year |
| Team | `team.html` | Supervisor and members with photo, designation and biography |

---

## How to edit

1. Open the repository on GitHub → **`data.js`** → click the pencil icon (✏️).
2. Find your section (look for the large `=====` banners):
   `3. MEMBERS` · `4A. ONGOING PAPERS` · `4B. PUBLISHED PAPERS`
3. Copy the **Template** at the bottom of the section and paste it **just above** the Template. Then delete the `//` at the start of every pasted line.
4. Set `lastUpdated` at the top to today's date: `"YYYY-MM-DD"`.
5. Click **Commit changes** → choose **Create a new branch and start a pull request**.
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
- The home page shows the group's `about` text and `areas` (research focus cards). Edit them in the `GROUP` section of `data.js`.

---

## Adding a photo

1. Use a square photo under 500 KB. Use a lowercase name with no spaces: `rahim-hasan.jpg`.
2. In the repository, open the **`images`** folder → **Add file → Upload files** → **Commit changes**.
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
If you cannot find it: `data.js` → **History** → open the previous working version and restore it.

---

## For the admin

- **Add a member:** repository → Settings → **Collaborators and teams** → **Add people** → role **Write**.
- **Approval rule:** Settings → **Rules → Rulesets → New branch ruleset** → target the default branch → **Require a pull request before merging** (approvals: 1).
- **Publish the site:** Settings → **Pages** → branch `main`, folder `/ (root)`.
- **When a university domain is available:** Settings → Pages → **Custom domain** → **Enforce HTTPS**. Do not delete the `CNAME` file.
