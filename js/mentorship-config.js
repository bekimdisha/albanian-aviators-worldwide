// Mentorship request form configuration.
//
// This form is fire-and-forget: it POSTs to a Google Apps Script Web App
// (bound to a Google Sheet you own) which logs the request as a row and
// sends the two notification emails. See MENTORSHIP-FORM-SETUP.md for the
// one-time setup steps.

window.MENTORSHIP_FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbxZB_ylZuYtJtTr6236151eJ5ns2bRXCVOtU0QXCKJVKFfnfqxk25mh0RHWfq7wFfpdQg/exec";

// TODO: replace these placeholder addresses with each mentor's real email.
// Keys must match the mentor names used in mentorship.html's "Request
// Mentorship" links exactly (they're passed via ?mentor=Name).
window.MENTORS = {
  "Arben Kola": "PLACEHOLDER-arben.kola@example.com",
  "Elira Dushku": "PLACEHOLDER-elira.dushku@example.com",
  "Vlora Hoxha": "PLACEHOLDER-vlora.hoxha@example.com",
};
