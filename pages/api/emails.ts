import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';

type EmailData = {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload?: any;
  headers?: {
    subject?: string;
    from?: string;
    to?: string;
    date?: string;
  };
};

type ApiResponse = {
  emails?: EmailData[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const session = await getSession({ req });

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Get list of emails
    const response = await axios.get(
      'https://www.googleapis.com/gmail/v1/users/me/messages',
      {
        params: {
          maxResults: 20,
          q: req.query.q || '',
          labelIds: req.query.labelIds || 'INBOX',
        },
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.data.messages) {
      return res.status(200).json({ emails: [] });
    }

    // Get details for each email
    const emailPromises = response.data.messages.map(async (message: { id: string }) => {
      const emailResponse = await axios.get(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const emailData = emailResponse.data;
      const headers: { [key: string]: string } = {};

      // Extract headers
      if (emailData.payload && emailData.payload.headers) {
        emailData.payload.headers.forEach((header: { name: string; value: string }) => {
          if (['Subject', 'From', 'To', 'Date'].includes(header.name)) {
            headers[header.name.toLowerCase()] = header.value;
          }
        });
      }

      return {
        id: emailData.id,
        threadId: emailData.threadId,
        labelIds: emailData.labelIds,
        snippet: emailData.snippet,
        headers,
      };
    });

    const emails = await Promise.all(emailPromises);
    return res.status(200).json({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return res.status(500).json({ error: 'Failed to fetch emails' });
  }
} 