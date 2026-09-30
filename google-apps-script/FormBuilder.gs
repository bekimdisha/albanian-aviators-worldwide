/**
 * Albanian Aviators Worldwide — Mentorship Program
 * Programmatically builds both application forms from Config.gs's shared
 * option lists, so the matching-field wording can never drift between them.
 *
 * Run buildForms() once (Apps Script editor → select buildForms → Run).
 * It prints both forms' edit and published URLs to the execution log
 * (View → Executions, or Logs). See MENTORSHIP-APPLICATIONS-SETUP.md.
 *
 * Re-running buildForms() creates brand-new forms — it does not update
 * existing ones. If you need to change a question, edit it directly in the
 * Google Forms UI (for matching fields, edit both forms identically and
 * update Config.gs to match, per doc 3's "if a form changes later" rule).
 */

function buildForms() {
  const menteeForm = createMenteeForm();
  const mentorForm = createMentorForm();
  ensureConfirmedMatchesSheet();

  Logger.log("Mentee form — edit: %s", menteeForm.getEditUrl());
  Logger.log("Mentee form — published (embed this): %s", menteeForm.getPublishedUrl());
  Logger.log("Mentor form — edit: %s", mentorForm.getEditUrl());
  Logger.log("Mentor form — published (embed this): %s", mentorForm.getPublishedUrl());

  ScriptApp.newTrigger("onMenteeFormSubmit").forForm(menteeForm).onFormSubmit().create();
  ScriptApp.newTrigger("onMentorFormSubmit").forForm(mentorForm).onFormSubmit().create();
}

// ---- small helpers to keep the question lists below readable ----

function reqText(form, title, helpText) {
  const item = form.addTextItem().setTitle(title).setRequired(true);
  if (helpText) item.setHelpText(helpText);
  return item;
}
function optText(form, title, helpText) {
  const item = form.addTextItem().setTitle(title).setRequired(false);
  if (helpText) item.setHelpText(helpText);
  return item;
}
function reqParagraph(form, title) {
  return form.addParagraphTextItem().setTitle(title).setRequired(true);
}
function optParagraph(form, title, helpText) {
  const item = form.addParagraphTextItem().setTitle(title).setRequired(false);
  if (helpText) item.setHelpText(helpText);
  return item;
}
function reqChoice(form, title, options) {
  return form.addMultipleChoiceItem().setTitle(title).setChoiceValues(options).setRequired(true);
}
function optChoice(form, title, options) {
  return form.addMultipleChoiceItem().setTitle(title).setChoiceValues(options).setRequired(false);
}
function reqCheckbox(form, title, options, opts) {
  opts = opts || {};
  const item = form.addCheckboxItem().setTitle(title).setChoiceValues(options).setRequired(true);
  if (opts.other) item.showOtherOption(true);
  if (opts.selectAtMost) {
    item.setValidation(FormApp.createCheckboxValidation().requireSelectAtMost(opts.selectAtMost).build());
  }
  return item;
}
function agreementCheckbox(form, label, required) {
  return form.addCheckboxItem().setTitle(label).setChoiceValues(["Yes"]).setRequired(required !== false);
}
function sectionHeader(form, title, text) {
  const item = form.addSectionHeaderItem().setTitle(title);
  if (text) item.setHelpText(text);
  return item;
}

// ============================= MENTEE FORM =============================

function createMenteeForm() {
  const form = FormApp.create("Albanian Aviators Worldwide — Mentee Application");
  form.setDescription(
    "Mentorship Program · About 10 minutes · Currently open to applicants 18 and older\n\n" +
      "Thank you for applying. Your answers help us connect you with the right mentor or " +
      "session. There are no wrong answers, so be honest, especially about your obstacles."
  );
  form.setCollectEmail(false);

  sectionHeader(form, "Section 1 — About You");
  reqText(form, "Full name");
  reqText(form, "Email");
  reqText(form, "WhatsApp number");
  reqText(form, "Country and city where you live");
  reqChoice(form, "Time zone region", OPTIONS.TIME_ZONE_REGION);
  reqChoice(
    form,
    "Are you 18 or older?",
    ["Yes", "No"]
  ).setHelpText(
    "The program is currently open to 18+. If you are under 18, leave your email above and we will contact you when youth mentoring opens."
  );
  reqCheckbox(form, "Languages you're comfortable being mentored in", OPTIONS.LANGUAGE, { other: true });
  reqCheckbox(form, "Preferred way to communicate", [
    "Video call",
    "Phone",
    "WhatsApp/text",
    "Email",
    "In person if possible",
  ]);

  sectionHeader(form, "Section 2 — Where You Are in Aviation");
  reqCheckbox(
    form,
    "Which area of aviation interests you most? (Check up to two)",
    OPTIONS.AREA_OF_AVIATION.concat([OPTIONS.AREA_OF_AVIATION_MENTEE_EXTRA]),
    { selectAtMost: 2 }
  );
  reqChoice(form, "Where are you right now?", [
    "Just exploring",
    "High school student",
    "University student",
    "In flight or technical training",
    "Recently certified, looking for first job",
    "Working in aviation, want to advance",
    "Changing careers into aviation",
  ]);
  optText(form, "Certificates, licenses or ratings you hold, if any, and the issuing country");
  optText(form, "If you're a pilot or student pilot, approximate total flight hours");
  optText(form, "Current school, flight school or employer, if any");
  reqText(form, "Highest education completed");

  sectionHeader(form, "Section 3 — Your Dreams and Goals");
  reqParagraph(form, "Why aviation? What made you want this?");
  reqParagraph(form, "Describe your dream job as specifically as you can: the role, the aircraft, the airline or company, the country.");
  reqParagraph(form, "Where do you want to be in 5 years?");
  reqCheckbox(
    form,
    "What do you most want help with? (Check up to three)",
    OPTIONS.HELP_TOPICS,
    { selectAtMost: 3 }
  );
  reqParagraph(form, "If this mentorship goes perfectly, what will have changed for you in one year?");

  sectionHeader(form, "Section 4 — Your Obstacles");
  reqCheckbox(form, "What's standing in your way right now? (Check all that apply)", [
    "Cost of training",
    "Don't know where to start",
    "No training available near me",
    "Language barrier",
    "Family doesn't support or understand the path",
    "Balancing with work or school",
    "Failed an exam or checkride and lost momentum",
    "No one in my life works in aviation",
    "Low confidence",
  ], { other: true });
  reqParagraph(form, "Describe your single biggest obstacle in your own words.");
  reqParagraph(form, "What have you already tried to overcome it?");
  reqParagraph(form, 'Is there anything you\'re afraid to ask about aviation because you think it\'s a "stupid question"? Ask it here.');

  sectionHeader(form, "Section 5 — How You Want to Be Mentored");
  reqCheckbox(form, "How would you like to take part? (Check all that apply)", OPTIONS.FORMAT);
  optParagraph(form, "If you chose a Career Call, what is your question?");
  form.addCheckboxItem()
    .setTitle("If you chose 1-on-1, what kind of mentor would help you most? (Check all that apply)")
    .setChoiceValues([
      "Works in the area I want to enter",
      "Works at a specific airline or company",
      "Trained in my country",
      "Overcame obstacles like mine",
      "Speaks Albanian",
      "No preference",
    ])
    .setRequired(false);
  optText(form, 'If you checked "a specific airline or company" above, which one?');
  reqChoice(form, "Do you have a preference for your mentor's gender?", ["No preference", "Female", "Male"])
    .setHelpText("We'll try to honor it but can't guarantee it.");
  reqChoice(form, "How often would you like to meet?", OPTIONS.MEETING_FREQUENCY);
  reqChoice(form, "Hours per month you can realistically commit", ["1–2", "3–5", "5+"]);
  reqChoice(form, "Can you commit to an initial 6-month match?", ["Yes", "No"]);
  optText(form, 'If "No" above, please explain');
  reqParagraph(form, "Mentors are volunteers giving their time. What will you do to make the most of it?");

  sectionHeader(form, "Section 6 — Final Questions");
  reqChoice(form, "How did you hear about us?", [
    "Albanian Student Summit",
    "Social media",
    "A friend or family member",
    "A pilot or mentor",
    "Other",
  ]);
  optChoice(form, "Optional: may we share your story on our website or social media, with your approval of the final text?", ["Yes", "No"]);
  optParagraph(form, "Anything else you'd like to share?");

  sectionHeader(form, "Section 7 — Agreement");
  sectionHeader(
    form,
    "Mentee Commitments",
    "You drive the relationship. You schedule meetings, show up on time, and give at least 24 hours’ notice if you need to cancel.\n\n" +
      "Respect your mentor’s time. Contact them only through the channels and at the hours you agree on.\n\n" +
      "Don’t ask for money, a job, a referral, a jumpseat, cockpit access, visa sponsorship or confidential employer information.\n\n" +
      "Advice is personal experience. It is not flight instruction, legal or immigration advice, or a job promise. Your decisions are yours.\n\n" +
      "Keep it professional. No romantic contact. Meet by video or in public. Don’t record a conversation without consent.\n\n" +
      "Protect your mentor’s privacy. Don’t share their contact details or post about them without permission, and don’t claim they or AAW endorsed you unless they said so in writing.\n\n" +
      "Stay in touch. Two missed meetings without notice, or 30 days without a reply, ends the match.\n\n" +
      "Problems go to the Program Coordinator. Either side can ask for a new match at any time, no explanation needed.\n\n" +
      "Breaking these commitments can end your participation in the program."
  );
  agreementCheckbox(form, "I have read and agree to the Mentee Commitments above.");
  agreementCheckbox(
    form,
    "I understand that Association Membership carries no voting or governance rights; that dues, if any, are non-refundable; and that my participation may be suspended or ended under AAW's bylaws and Code of Conduct."
  );
  agreementCheckbox(form, "I will complete a short video introduction with the Program Coordinator before being matched.");
  reqChoice(form, "Are you related to a director or officer of Albanian Aviators Worldwide?", ["No", "Yes"]);
  optText(form, 'If "Yes" above, name');
  agreementCheckbox(
    form,
    "I consent to AAW storing and using my information to run the Mentorship Program. I can request a copy or deletion of my data at any time."
  );
  reqText(form, "Signature and date (type your full name and today's date)");

  linkFormToSheet(form, SHEET_NAMES.MENTEE);
  addCoordinatorColumns(SHEET_NAMES.MENTEE, ["Disclosure Cleared? (Y/N)"]);
  return form;
}

// ============================= MENTOR FORM ==============================

function createMentorForm() {
  const form = FormApp.create("Albanian Aviators Worldwide — Mentor Sign-up");
  form.setDescription(
    "Mentorship Program · About 5 minutes\n\n" +
      "Thank you for giving back. You choose how much time to give, and you can step back at any time.\n\n" +
      "Three ways to help:\n" +
      "• Office Hours host — one 60-minute group video call per quarter — Q&A with 5–20 mentees on a topic you know\n" +
      "• Career Call advisor — one or two 30-minute calls, when you're available — answer one specific question for a mentee\n" +
      "• 1-on-1 Mentor — 1–2 hours a month for 6 months — guide one matched mentee toward their goals"
  );
  form.setCollectEmail(false);

  reqText(form, "Full name");
  reqText(form, "Email");
  reqText(form, "WhatsApp number");
  reqText(form, "Country");
  reqChoice(form, "Time zone region", OPTIONS.TIME_ZONE_REGION);
  reqCheckbox(form, "Languages you can mentor in", OPTIONS.LANGUAGE, { other: true });
  reqCheckbox(form, "Your area of aviation (check all that apply)", OPTIONS.AREA_OF_AVIATION);
  reqText(form, "Current role and employer", 'For example, "A320 First Officer, [airline]"');
  reqText(form, "LinkedIn profile URL", "Used only to verify your credentials.");
  reqCheckbox(form, "How would you like to help? (Check all that apply)", OPTIONS.FORMAT);
  reqCheckbox(form, "What can you help with? (Check all that apply)", OPTIONS.HELP_TOPICS);
  optChoice(form, "If 1-on-1: how many mentees?", OPTIONS.MENTOR_CAPACITY);
  optChoice(form, "If 1-on-1: how often?", OPTIONS.MEETING_FREQUENCY);
  optParagraph(form, "Optional: anything we should know, or anything you'd rather not be asked to help with?");

  sectionHeader(form, "Agreement");
  sectionHeader(
    form,
    "Mentor Commitments",
    "You are a volunteer. Give the time you offered. If that changes, tell the Coordinator. Stepping back is always fine.\n\n" +
      "No money or business with mentees. No loans, sales or paid services, and don’t steer them to anything you profit from.\n\n" +
      "Your advice is your experience. It is not flight instruction, legal or immigration advice, or a job promise.\n\n" +
      "Keep it professional. No romantic contact. Meet on video or in public. No flights, cockpit visits or jumpseats through the program.\n\n" +
      "Don’t handle serious problems alone. If you’re worried about a mentee’s safety, or a mentee crosses a line with you, tell the Coordinator. AAW deals with it, not you.\n\n" +
      "You can end or change a match at any time, with no explanation needed.\n\n" +
      "AAW protects you too: mentees sign a stricter set of commitments, and AAW removes mentees who break them."
  );
  agreementCheckbox(form, "I agree to the Mentor Commitments above.");
  form.addCheckboxItem()
    .setTitle(
      "Check if either applies, and the Program Coordinator will follow up: I have a financial tie to a flight school, training provider, recruiter or lender, or I am a director or officer of AAW or related to one."
    )
    .setChoiceValues(["Yes, this applies to me"])
    .setRequired(false);
  agreementCheckbox(form, "I consent to AAW storing my information to run the program. I can request a copy or deletion at any time.");
  reqText(form, "Signature and date (type your full name and today's date)");

  linkFormToSheet(form, SHEET_NAMES.MENTOR);
  addCoordinatorColumns(SHEET_NAMES.MENTOR, ["Verified? (Y/N)", "Disclosure Cleared? (Y/N)"]);
  return form;
}

// ---- linking + sheet setup ----

function linkFormToSheet(form, sheetName) {
  const before = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets().map((s) => s.getName());
  form.setDestination(FormApp.DestinationType.SPREADSHEET, SPREADSHEET_ID);
  SpreadsheetApp.flush();
  const after = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets();
  const newSheet = after.find((s) => before.indexOf(s.getName()) === -1);
  if (newSheet) newSheet.setName(sheetName);
}

function addCoordinatorColumns(sheetName, columnTitles) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const lastCol = sheet.getLastColumn();
  columnTitles.forEach((title, i) => {
    sheet.getRange(1, lastCol + 1 + i).setValue(title);
  });
}
