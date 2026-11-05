# Research Group Page

**শুধু `data.js` edit করবেন। বাকি file ছোঁবেন না।**
Only edit `data.js`. Do not touch the other files.

---

## কীভাবে edit করবেন (How to edit)

1. GitHub-এ repo খুলুন → **`data.js`** → ✏️ (pencil) চাপুন।
2. নিজের অংশ খুঁজুন (বড় `=====` banner দেখুন):
   `3. MEMBERS` · `4A. ONGOING PAPERS` · `4B. PUBLISHED PAPERS`
3. অংশের নিচের **Template**-টা copy করে, Template-এর **ঠিক ওপরে** paste করুন। তারপর প্রতি লাইনের শুরু থেকে `//` মুছুন।
4. ওপরের `lastUpdated` আজকের তারিখ করুন: `"YYYY-MM-DD"`।
5. **Commit changes** চাপুন → **Create a new branch and start a pull request** বেছে নিন।
6. Admin approve ও merge করলে ১-২ মিনিটে page বদলাবে।

---

## Copy-paste করার block

**Member**
```js
{ name: "Full name", role: "Research student", interest: "One line about your research", photo: "full-name.jpg" },
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

- যা লাগবে না তা ফাঁকা রাখুন: `""` অথবা `[]`। Field মুছবেন না।
- বাধ্যতামূলক: member-এ `name`; paper-এ `type` ও `title`; published-এ `year`-ও।
- Paper published হলে: `type` বদলে `"published"` করুন, `status` ও `description` মুছুন, `venue`, `pages`, `year` যোগ করুন।

---

## ছবি যোগ করা (Add a photo)

1. চৌকো ছবি, ৫০০ KB-এর নিচে। নাম ছোট হাতের অক্ষরে, space ছাড়া: `rahim-hasan.jpg`।
2. Repo-র **`images`** folder → **Add file → Upload files** → **Commit changes**।
3. `data.js`-এ **হুবহু একই নাম** লিখুন: `photo: "rahim-hasan.jpg"`।

ছবি না এলে নামের বানান মেলেনি (`.JPG` আর `.jpg` আলাদা)। তখন নামের initials দেখায়।

---

## নিয়ম (Rules)

- Repo **public**। যা সবাই দেখলে সমস্যা নেই, শুধু তা-ই লিখুন।
- Ongoing paper-এ শুধু title আর ১-২ লাইনের সাধারণ বিবরণ। Method বা result নয়।
- ব্যক্তিগত ফোন নম্বর বা email নয়।
- `" "`, `,` আর `{ } [ ]` উদাহরণের মতোই রাখুন। একটা কমা বাদ গেলে পুরো page ভেঙে যায়।
- অন্যের ছবি দেওয়ার আগে তার অনুমতি নিন।

---

## Page-এ "The page content could not be loaded" দেখালে

`data.js`-এ ভুল আছে। বার্তায় লাইন নম্বর লেখা থাকে, ওই লাইন বা তার ঠিক ওপরে দেখুন (সাধারণত কমা বা `"` বাদ গেছে)।
না পারলে: `data.js` → **History** → আগের কাজের version খুলে restore করুন।

---

## Admin-এর জন্য

- **Member যোগ:** repo → Settings → **Collaborators and teams** → **Add people** → role **Write**।
- **Approval নিয়ম:** Settings → **Rules → Rulesets → New branch ruleset** → default branch target → **Require a pull request before merging** (approvals: 1)।
- **Page চালু:** Settings → **Pages** → branch `main`, folder `/ (root)`।
- **University domain পেলে:** Settings → Pages → **Custom domain** → **Enforce HTTPS**। `CNAME` file মুছবেন না।
