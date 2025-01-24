import keyBy from 'lodash/keyBy';
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import axios, { endpoints, fetcher } from '@/lib/axios';

// ----------------------------------------------------------------------

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

interface Contact {
  id: string;
  name: string;
  // Add other contact properties here
}

interface Conversation {
  id: string;
  messages: Message[];
  unreadCount: number;
  // Add other conversation properties here
}

interface Message {
  id: string;
  text: string;
  // Add other message properties here
}

interface UseGetContactsReturn {
  contacts: Contact[];
  contactsLoading: boolean;
  contactsError: any;
  contactsValidating: boolean;
  contactsEmpty: boolean;
}

interface UseGetConversationsReturn {
  conversations: {
    byId: Record<string, Conversation>;
    allIds: string[];
  };
  conversationsLoading: boolean;
  conversationsError: any;
  conversationsValidating: boolean;
  conversationsEmpty: boolean;
}

interface UseGetConversationReturn {
  conversation: Conversation | undefined;
  conversationLoading: boolean;
  conversationError: any;
  conversationValidating: boolean;
}

export function useGetContacts(): UseGetContactsReturn {
  const URL = [endpoints.chat, { params: { endpoint: 'contacts' } }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      contacts: data?.contacts || [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !data?.contacts.length,
    }),
    [data?.contacts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversations(): UseGetConversationsReturn {
  const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(() => {
    const byId = keyBy(data?.conversations, 'id') || {};
    const allIds = Object.keys(byId) || [];

    return {
      conversations: {
        byId,
        allIds,
      },
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !allIds.length,
    };
  }, [data?.conversations, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversation(conversationId: string | null): UseGetConversationReturn {
  const URL = conversationId
    ? [endpoints.chat, { params: { conversationId, endpoint: 'conversation' } }]
    : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      conversation: data?.conversation,
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isValidating,
    }),
    [data?.conversation, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId: string, messageData: Message): Promise<void> {
  const CONVERSATIONS_URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  const CONVERSATION_URL = [
    endpoints.chat,
    {
      params: { conversationId, endpoint: 'conversation' },
    },
  ];

  /**
   * Work on server
   */
  // const data = { conversationId, messageData };
  // await axios.put(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    CONVERSATION_URL,
    (currentData: any) => {
      const { conversation: currentConversation } = currentData;

      const conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, messageData],
      };

      return {
        conversation,
      };
    },
    false
  );

  /**
   * Work in local
   */
  mutate(
    CONVERSATIONS_URL,
    (currentData: any) => {
      const { conversations: currentConversations } = currentData;

      const conversations = currentConversations.map((conversation: Conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, messageData],
            }
          : conversation
      );

      return {
        conversations,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: Conversation): Promise<any> {
  const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const conversations = [...currentData.conversations, conversationData];
      return {
        ...currentData,
        conversations,
      };
    },
    false
  );

  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string): Promise<void> {
  const URL = endpoints.chat;

  /**
   * Work on server
   */
  // await axios.get(URL, { params: { conversationId, endpoint: 'mark-as-seen' } });

  /**
   * Work in local
   */
  mutate(
    [
      URL,
      {
        params: { endpoint: 'conversations' },
      },
    ],
    (currentData: any) => {
      const conversations = currentData.conversations.map((conversation: Conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      );

      return {
        ...currentData,
        conversations,
      };
    },
    false
  );
}