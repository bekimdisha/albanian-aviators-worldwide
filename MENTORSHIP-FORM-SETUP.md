# Mentorship request form — one-time setup

The "Request Mentorship" button on `mentorship.html` sends people to
`contact.html?mentor=Name`, which is wired (in `js/main.js`) to submit that
form to a Google Apps Script Web App you own. This only applies to
mentorship requests — the general contact form (no `?mentor=` in the URL)
is untouched and stays a static stub.

On submission the script does three things: appends a row to a Google
Sheet you own, emails the mentee a confirmation, and emails the mentor a
notification. All free, no new accounts beyond the Google account you
already use for the org.

## 1. Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → create a new
   blank spreadsheet. Name it something like "Mentorship Requests."
2. Rename the first tab (bottom-left) to `Requests` — this must match the
   `SHEET_NAME` constant in the script (step 2), or edit the constant to
   match whatever you name it instead.
3. Add a header row: `Timestamp | Mentee Name | Mentee Email | Mentee Role | Location | Mentor Name | Mentor Email | Message`

## 2. Add the script

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete the placeholder `function myFunction() {}` code.
3. Copy the contents of this repo's
   [`google-apps-script/mentorship-request-handler.gs`](google-apps-script/mentorship-request-handler.gs)
   and paste it in.
4. Save the project (any name is fine).

## 3. Deploy it as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Set **Execute as: Me**, **Who has access: Anyone**.
4. Click **Deploy**. Google will ask you to authorize the script — this is
   expected since it's your own script accessing your own Sheet and Gmail.
   Click through **Advanced → Go to \<project name\> (unsafe)** → **Allow**.
   ("Unsafe" here just means Google hasn't reviewed this script — it's
   only ever run under your own account.)
5. Copy the **Web app URL** shown (it ends in `/exec`).

## 4. Plug it into the site

Open `js/mentorship-config.js` and:

1. Replace `REPLACE_WITH_YOUR_APPS_SCRIPT_WEB_APP_URL` with the URL from
   step 3.5.
2. Replace each mentor's placeholder email with their real one. The keys
   must exactly match the names used in `mentorship.html`'s "Request
   Mentorship" links.

Commit and push — GitHub Pages picks it up on the next deploy.

## 5. Test it

1. On the live site, go to Mentorship → click "Request Mentorship" on any
   mentor → fill out the form → submit.
2. Check the Sheet for a new row.
3. Check both the mentee's and mentor's inboxes (and spam folders, the
   first time) for the two emails.

## Known limitation: no failure feedback in the browser

Google Apps Script Web Apps don't add CORS headers to their responses, so
the page can't read the response back — it just fires the request and
shows "request sent" once the network call completes. If something goes
wrong server-side (a malformed email address, a renamed sheet tab, a
script error), the visitor won't see it. To check for problems, open the
Apps Script project → **Executions** (left sidebar) and look for failed
runs, or just check the Sheet directly.

## Updating the script later

If you edit the Apps Script code after deploying, use **Deploy → Manage
deployments → pencil icon → Version: New version → Deploy**. This updates
the same URL. Creating a brand new deployment instead would give you a
different URL, which you'd have to re-paste into `js/mentorship-config.js`.

## Email sending limits

`MailApp.sendEmail` sends from your own Gmail account and is subject to
its daily quota — about 100 emails/day for a personal Gmail account, up to
1,500/day on Google Workspace. Two emails per request, so that's plenty of
headroom for expected volume.
