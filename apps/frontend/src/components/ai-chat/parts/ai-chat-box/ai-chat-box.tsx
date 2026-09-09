import {
  Dialog,
  Button,
  TextInput,
  Text,
  Stack,
  Paper,
  Alert,
  ScrollArea,
} from '@mantine/core';
import {
  AiChatBoxFormValues,
  AiChatBoxProps,
  ChatMessage,
} from './ai-chat-box.types';
import { useFormik } from 'formik';
import { sendMessageToAIChat } from '@/components-apis/ai-chat/ai-chat-api';
import React, { useRef, useState, useEffect } from 'react';
import { ButtonPrimary } from './../../../ui/button-primary/button-primary';

export const AiChatBox = ({ opened, setOpened }: AiChatBoxProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  const formik = useFormik<AiChatBoxFormValues>({
    initialValues: {
      text: '',
    },
    onSubmit: async (values) => {
      const text = values.text.trim();

      if (!text) return;

      setMessages((current) => [
        ...current,
        {
          role: 'user',
          content: text,
        },
      ]);

      formik.resetForm();

      try {
        const result = await sendMessageToAIChat(text);

        setMessages((current) => [
          ...current,
          {
            role: 'assistant',
            content: result.response,
          },
        ]);
      } catch (error: any) {
        console.error('Error sending message to AI chat:', error);
        setError(
          error.message || 'An error occurred while sending the message.',
        );
      }
    },
  });

  return (
    <Dialog
      opened={opened}
      withCloseButton
      onClose={() => setOpened(false)}
      size="lg"
      style={{ padding: 15 }}
      position={{ bottom: 80, right: 20 }}
    >
      <div>
        <form onSubmit={formik.handleSubmit}>
          <Stack gap={'sm'} className="mt-8">
            <ScrollArea h={messages.length > 0 ? 200 : 0}>
              {messages.map((message, index) => (
                <Paper
                  key={`message-${index}`}
                  p="sm"
                  withBorder
                  ml={message.role === 'user' ? 'xl' : 0}
                  mr={message.role === 'assistant' ? 'xl' : 0}
                  mb="sm"
                >
                  <Text size="sm">{message.content}</Text>
                </Paper>
              ))}

              {error && (
                <Alert color="red" mt="md">
                  {error}
                </Alert>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <TextInput
              name="text"
              label="Ask your financial assistant"
              placeholder="Type your message..."
              value={formik.values.text}
              onChange={formik.handleChange}
            />
            <ButtonPrimary
              disabled={formik.isSubmitting || !formik.values.text.trim()}
              type="submit"
            >
              Send
            </ButtonPrimary>
          </Stack>
        </form>
      </div>
    </Dialog>
  );
};
