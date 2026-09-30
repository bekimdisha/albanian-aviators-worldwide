/**
 * Albanian Aviators Worldwide — Mentorship Program
 * Sends the two application-confirmation emails. Wired up automatically by
 * buildForms() in FormBuilder.gs as "on form submit" triggers — you should
 * not need to create these triggers by hand.
 */

function onMenteeFormSubmit(e) {
  const responses = e.response.getItemResponses();
  const name = getAnswer(responses, "Full name");
  const email = getAnswer(responses, "Email");

  if (email) {
    MailApp.sendEmail({
      to: email,
      subject: `${ORG_NAME}: Your Mentee Application`,
      body:
        `Hi ${name || "there"},\n\n` +
        `Thanks for applying to the ${ORG_NAME} Mentorship Program. Your application has been ` +
        `received and is being reviewed. We'll be in touch once you've been matched, or with next steps.\n\n` +
        `— ${ORG_NAME}`,
    });
  }

  notifyCoordinator("mentee application", name, email, SHEET_NAMES.MENTEE);
}

function onMentorFormSubmit(e) {
  const responses = e.response.getItemResponses();
  const name = getAnswer(responses, "Full name");
  const email = getAnswer(responses, "Email");

  if (email) {
    MailApp.sendEmail({
      to: email,
      subject: `${ORG_NAME}: Your Mentor Sign-up`,
      body:
        `Hi ${name || "there"},\n\n` +
        `Thank you for volunteering with the ${ORG_NAME} Mentorship Program. We've received your ` +
        `sign-up and will verify your details before matching begins.\n\n` +
        `— ${ORG_NAME}`,
    });
  }

  notifyCoordinator("mentor sign-up", name, email, SHEET_NAMES.MENTOR);
}

function notifyCoordinator(kind, name, email, sheetName) {
  MailApp.sendEmail({
    to: COORDINATOR_EMAIL,
    subject: `${ORG_NAME}: New ${kind} — ${name || "unnamed"}`,
    body:
      `A new ${kind} was submitted by ${name || "someone"} (${email || "no email given"}).\n\n` +
      `Review it in the "${sheetName}" tab: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
  });
}

function getAnswer(itemResponses, title) {
  for (let i = 0; i < itemResponses.length; i++) {
    if (itemResponses[i].getItem().getTitle() === title) {
      return itemResponses[i].getResponse();
    }
  }
  return "";
}
