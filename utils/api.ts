import axios from 'axios';

// Gmail API base URL
const GMAIL_API_BASE = 'https://www.googleapis.com/gmail/v1/users/me';

// Function to create an authenticated API client
export const createApiClient = (accessToken: string) => {
  const client = axios.create({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return client;
};

// Function to fetch email list
export const fetchEmails = async (accessToken: string, params: any = {}) => {
  const client = createApiClient(accessToken);
  const response = await client.get(`${GMAIL_API_BASE}/messages`, { params });
  return response.data;
};

// Function to fetch a single email
export const fetchEmail = async (accessToken: string, emailId: string) => {
  const client = createApiClient(accessToken);
  const response = await client.get(`${GMAIL_API_BASE}/messages/${emailId}`);
  return response.data;
};

// Function to fetch email labels
export const fetchLabels = async (accessToken: string) => {
  const client = createApiClient(accessToken);
  const response = await client.get(`${GMAIL_API_BASE}/labels`);
  return response.data;
};

// Function to send an email
export const sendEmail = async (accessToken: string, message: string) => {
  const client = createApiClient(accessToken);
  const response = await client.post(`${GMAIL_API_BASE}/messages/send`, {
    raw: message,
  });
  return response.data;
};

// Function to modify email labels (mark as read, archive, etc.)
export const modifyLabels = async (
  accessToken: string,
  emailId: string,
  addLabels: string[] = [],
  removeLabels: string[] = []
) => {
  const client = createApiClient(accessToken);
  const response = await client.post(`${GMAIL_API_BASE}/messages/${emailId}/modify`, {
    addLabelIds: addLabels,
    removeLabelIds: removeLabels,
  });
  return response.data;
};

// Function to trash an email
export const trashEmail = async (accessToken: string, emailId: string) => {
  const client = createApiClient(accessToken);
  const response = await client.post(`${GMAIL_API_BASE}/messages/${emailId}/trash`);
  return response.data;
}; 