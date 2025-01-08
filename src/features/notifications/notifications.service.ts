import { User } from "@prisma/client";

async function sendNewUserNotification(user: User) {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';

  const message = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🎉 New User Alert!",
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Email:*\n${user.email}`
          },
          {
            type: 'mrkdwn',
            text: `*ID:*\n${user.id}`
          },
          {
            type: 'mrkdwn',
            text: `*Created At:*\n${user.created_at.toLocaleString()}`
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error('Slack notification failed:', response);
    }

    return true;
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    throw error;
  }
}

export const notificationsService = {
  sendNewUserNotification
};
