/**
 * Delivers a validated form submission somewhere useful. If
 * FORM_WEBHOOK_URL is configured (e.g. a Slack/Teams incoming webhook, or a
 * small internal relay that sends email), the submission is POSTed there as
 * JSON. Otherwise it falls back to a structured server log so submissions
 * are never silently dropped — operators just need to set the env var to
 * start receiving them for real.
 */
export type FormSubmission = {
  form: "contact" | "newsletter" | "mitmachen" | "sponsoring";
  submittedAt: string;
  data: Record<string, string>;
};

export async function deliverFormSubmission(
  form: FormSubmission["form"],
  data: Record<string, string>
): Promise<void> {
  const submission: FormSubmission = {
    form,
    submittedAt: new Date().toISOString(),
    data,
  };

  const webhookUrl = process.env.FORM_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log(`[form:${form}] submission received (no FORM_WEBHOOK_URL configured):`, {
      ...data,
      message: undefined, // avoid dumping full free-text into logs by default
    });
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    if (!response.ok) {
      console.error(`[form:${form}] webhook delivery failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(`[form:${form}] webhook delivery threw`, error);
  }
}
