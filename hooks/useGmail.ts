import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { EmailCategory } from '@/components/Sidebar';

interface EmailHeader {
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
}

export interface Email {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  headers?: EmailHeader;
}

interface EmailContent extends Email {
  body: string;
  attachments: any[];
}

interface UseGmailReturn {
  emails: Email[];
  loading: boolean;
  error: string | null;
  fetchEmails: (query?: string, labelIds?: string) => Promise<void>;
  fetchEmailContent: (emailId: string) => Promise<EmailContent | null>;
  refreshEmails: () => Promise<void>;
  filterEmailsByCategory: (category: EmailCategory) => Email[];
}

export const useGmail = (): UseGmailReturn => {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [labelIds, setLabelIds] = useState<string>('INBOX');

  const fetchEmails = useCallback(async (newQuery?: string, newLabelIds?: string) => {
    if (status !== 'authenticated' || !session?.accessToken) return;

    setLoading(true);
    setError(null);

    if (newQuery !== undefined) setQuery(newQuery);
    if (newLabelIds !== undefined) setLabelIds(newLabelIds);

    try {
      const params = new URLSearchParams();
      if (newQuery || query) params.append('q', newQuery || query);
      if (newLabelIds || labelIds) params.append('labelIds', newLabelIds || labelIds);

      const response = await axios.get(`/api/emails?${params.toString()}`);
      setEmails(response.data.emails || []);
    } catch (err) {
      console.error('Ошибка загрузки писем:', err);
      setError('Не удалось загрузить письма');
    } finally {
      setLoading(false);
    }
  }, [status, session, query, labelIds]);

  const fetchEmailContent = useCallback(async (emailId: string): Promise<EmailContent | null> => {
    if (status !== 'authenticated' || !session?.accessToken || !emailId) return null;

    try {
      const response = await axios.get(`/api/email/${emailId}`);
      return response.data.email || null;
    } catch (err) {
      console.error('Ошибка загрузки содержимого письма:', err);
      setError('Не удалось загрузить содержимое письма');
      return null;
    }
  }, [status, session]);

  const refreshEmails = useCallback(() => {
    return fetchEmails(query, labelIds);
  }, [fetchEmails, query, labelIds]);

  const filterEmailsByCategory = useCallback((category: EmailCategory): Email[] => {
    const categoryToLabelMap: Record<EmailCategory, string> = {
      'inbox': 'INBOX',
      'sent': 'SENT',
      'starred': 'STARRED',
      'trash': 'TRASH',
      'archive': 'ARCHIVE',
      'spam': 'SPAM',
      'important': 'IMPORTANT'
    };
    
    const label = categoryToLabelMap[category];
    
    if (!label) return emails;
    
    return emails.filter(email => email.labelIds.includes(label));
  }, [emails]);

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchEmails();
    }
  }, [status, session, fetchEmails]);

  return {
    emails,
    loading,
    error,
    fetchEmails,
    fetchEmailContent,
    refreshEmails,
    filterEmailsByCategory
  };
}; 