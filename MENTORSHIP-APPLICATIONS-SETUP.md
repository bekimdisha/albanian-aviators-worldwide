# Mentorship applications — one-time setup

This replaces the earlier ad-hoc "Request Mentorship" flow entirely. The
real process, per the program's reference documents in `files/`, is:
**apply → you (Coordinator) verify and review → automated shortlist for
1-on-1 requests → you confirm the actual match.** There's no more instant
browsing or messaging a specific mentor.

Reminder from the program docs: *"At the October 4 Summit, collect
applications only. Make no matches until the Board adopts this Code and
the insurance is in place."* The steps below get applications flowing —
whether to also actually run `Confirmed Matches` before then is a Board
timing question, not a technical one.

## 1. Load the script

1. Open the same Google Sheet from the earlier setup (the one with the
   "Requests" tab) → **Extensions → Apps Script**.
2. Delete the old script's contents.
3. Create four script files matching this repo's `google-apps-script/`
   folder — in the Apps Script editor, **File → New → Script file** for
   each, naming them exactly `Config`, `FormBuilder`, `Notifications`,
   `Matching` (Apps Script adds `.gs` itself). Paste in the matching
   file's contents from the repo.
4. In `Config.gs`, confirm `COORDINATOR_EMAIL` is the address that should
   get "new application" notifications — it's currently set to
   `bekimdisha@gmail.com`.
5. Save the project.

## 2. Build both forms

1. In the toolbar, select `buildForms` from the function dropdown, then
   click **Run**.
2. Authorize when prompted (same as last time — **Advanced → Go to
   \<project\> (unsafe) → Allow**). This run needs Forms, Sheets, and Gmail
   permission, so the consent screen will list more than before.
3. Once it finishes, open **View → Executions** (or **View → Logs**) and
   find the four URLs it printed: Mentee form edit + published, Mentor
   form edit + published.

This also creates three new tabs in the Sheet: **Mentee Applications**,
**Mentor Applications**, and **Confirmed Matches** (empty, ready for you
to fill in as you confirm matches). The old **Requests** tab from the
retired flow is untouched — keep it as a historical record or delete it,
your call.

## 3. Embed both forms on the site

Open `mentorship.html` and replace the two placeholders with the
**published** URLs from step 2.3 (keep the `?embedded=true` that's
already in each placeholder):

- `REPLACE_WITH_MENTEE_FORM_PUBLISHED_URL` → the Mentee form's published URL
- `REPLACE_WITH_MENTOR_FORM_PUBLISHED_URL` → the Mentor form's published URL

Commit and push — GitHub Pages picks it up on the next deploy. The iframe
heights (2600px / 1500px) are a starting guess; open the live page and
adjust if either form scrolls awkwardly.

## 4. Reviewing applications (your ongoing Coordinator role)

As applications come in (you'll get an email per submission), open the
Sheet:

- **Mentor Applications**: check their LinkedIn profile, then mark the
  `Verified? (Y/N)` column `Y`. Check the insider/conflict-of-interest
  answers; if clear, mark `Disclosure Cleared? (Y/N)` `Y`.
- **Mentee Applications**: check the insider-disclosure answer; if clear,
  mark `Disclosure Cleared? (Y/N)` `Y`.

Only rows marked this way are eligible for matching — it's the one place
the process deliberately isn't automated (see the earlier discussion on
why credential/disclosure clearance stays a human judgment call).

## 5. Running the matching engine

Reload the spreadsheet tab in your browser once (the custom menu only
appears after a reload). You'll see a new **AAW Mentorship** menu → **Run
Matching**.

This regenerates the **Suggested Matches** tab: for every mentee who
requested 1-on-1 mentoring, it lists the top 3 eligible mentors ranked by
score, using the exact filters and point system from the matching
instructions doc. It does **not** touch Office Hours or Career Call
requests — those are a grouping exercise and a hand-picked process
respectively, per the same doc, not something to force through a scoring
algorithm.

Re-run it anytime (new applications, newly-verified mentors, newly
confirmed matches freeing up or using capacity) — it clears and rebuilds
the tab fresh each time.

## 6. Confirming an actual match

The shortlist is a suggestion, not a decision. Read the mentee's free-text
answers (dream job, obstacles, gender preference) the way the doc
describes, then add a row to **Confirmed Matches**: Mentee Name, Mentee
Email, Mentor Name, Mentor Email, Confirmed Date. This is also what keeps
a mentor's capacity accurate — the matching engine subtracts each
mentor's confirmed-mentee count from their stated capacity, so a mentor
at capacity stops appearing in new shortlists automatically.

Introducing the two people to each other by email is still on you — this
system doesn't send that email for you.

## 7. If a matching-field option ever changes

Per the matching instructions doc: any change to one of the 7 shared
matching fields must be made on **both** live forms the same day. Editing
`Config.gs` alone does nothing to forms that already exist — re-running
`buildForms()` creates entirely new forms, it doesn't update the old
ones. To change an existing question, edit both Google Forms directly in
their UI, keeping the wording character-for-character identical, and
update `Config.gs` to match so future reads of the sheet stay consistent.

## 8. QR code for the Summit

Once you have the Mentee form's published URL, say so and I can generate
a QR code image for it to print — the matching instructions doc asks for
one to use at the Summit.

## 9. Cleaning up the old flow (optional)

The Apps Script Web App from the earlier "Request Mentorship" integration
is no longer called by anything on the site. You can leave it (harmless)
or remove it: in that same Apps Script project, **Deploy → Manage
deployments → Archive**.
