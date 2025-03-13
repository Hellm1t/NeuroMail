import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';

type EmailResponse = {
  email?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmailResponse>
) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Email ID is required' });
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${id}`,
      {
        params: {
          format: 'full',
        },
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    const emailData = response.data;
    const headers: { [key: string]: string } = {};
    let body = '';
    let attachments: any[] = [];

    // Extract headers
    if (emailData.payload && emailData.payload.headers) {
      emailData.payload.headers.forEach((header: { name: string; value: string }) => {
        headers[header.name.toLowerCase()] = header.value;
      });
    }

    // Extract body
    const extractBody = (part: any) => {
      if (part.body && part.body.data) {
        return Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
      return '';
    };

    // Extract parts (body and attachments)
    const processParts = (parts: any[]) => {
      parts.forEach((part) => {
        if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
          body = extractBody(part);
        } else if (part.mimeType.startsWith('image/') || part.mimeType.startsWith('application/')) {
          attachments.push({
            filename: part.filename,
            mimeType: part.mimeType,
            size: part.body.size,
            attachmentId: part.body.attachmentId,
          });
        }

        if (part.parts) {
          processParts(part.parts);
        }
      });
    };

    if (emailData.payload.parts) {
      processParts(emailData.payload.parts);
    } else if (emailData.payload.body && emailData.payload.body.data) {
      body = Buffer.from(emailData.payload.body.data, 'base64').toString('utf-8');
    }

    const email = {
      id: emailData.id,
      threadId: emailData.threadId,
      labelIds: emailData.labelIds,
      snippet: emailData.snippet,
      headers,
      body,
      attachments,
    };

    return res.status(200).json({ email });
  } catch (error) {
    console.error('Error fetching email:', error);
    return res.status(500).json({ error: 'Failed to fetch email' });
  }
} 