import { Dialog, Button, TextInput, Text, Stack, Paper } from '@mantine/core';
import {
  AiChatBoxFormValues,
  AiChatBoxProps,
  ChatMessage,
} from './ai-chat-box.types';
import { useFormik } from 'formik';
import { sendMessageToAIChat } from '@/components-apis/ai-chat/ai-chat-api';
import React, { useState } from 'react';
import { ButtonPrimary } from './../../../ui/button-primary/button-primary';

export const AiChatBox = ({ opened, setOpened }: AiChatBoxProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
      } catch (error) {
        console.error('Error sending message to AI chat:', error);
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
          <Stack className="mt-8">
            {messages.map((message, index) => (
              <Paper
                key={index}
                p="sm"
                withBorder
                ml={message.role === 'user' ? 'xl' : 0}
                mr={message.role === 'assistant' ? 'xl' : 0}
              >
                <Text>{message.content}</Text>
              </Paper>
            ))}
            <TextInput
              name="text"
              label="Ask your financial assistant"
              placeholder="Type your message..."
              value={formik.values.text}
              onChange={formik.handleChange}
            />
            <ButtonPrimary disabled={formik.isSubmitting} type="submit">
              Send
            </ButtonPrimary>
          </Stack>
        </form>
      </div>
    </Dialog>
  );
};
