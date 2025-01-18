import db from "@/src/lib/services/db";

const createWebhook = async (formId: string, webhookUrl: string) => {
  return db.webhook.create({
    data: { form_id: formId, url: webhookUrl },
  });
};

const deleteWebhook = async (formId: string) => {
  return db.webhook.delete({
    where: { form_id: formId },
  });
};

const getWebhookByFormId = async (formId: string) => {
  return db.webhook.findUnique({
    where: { form_id: formId },
  });
};

const callWebhook = async (formId: string, submission: Record<string, any>) => {
  const webhook = await getWebhookByFormId(formId);
  if (!webhook || !webhook.url) return;

  const kebabCaseEntries = Object.entries(submission).map(([key, value]) => {
    const kebabCaseFieldName = key.split(' ').join('_').toLowerCase();
    return [kebabCaseFieldName, value]

  })

  const kebabCaseSubmission = Object.fromEntries(kebabCaseEntries);

  try {
    const response = await fetch(webhook.url, {
      method: webhook.method || "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submission: kebabCaseSubmission,
        identity: 'INCREDIFORMS_WEBHOOK_INTEGRATOR',
      }),
    });
    return response;
  } catch (error) {
    console.log(`Webhook call failed with status ${error}`);
    return null;
  }
};



export { createWebhook, deleteWebhook, getWebhookByFormId, callWebhook };