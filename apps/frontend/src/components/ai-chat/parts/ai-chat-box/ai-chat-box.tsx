import { Dialog, Button, TextInput, Text } from '@mantine/core';
import { AiChatBoxFormValues, AiChatBoxProps } from './ai-chat-box.types';
import { useFormik } from 'formik';
import { sendMessageToAIChat } from '@/components-apis/ai-chat/ai-chat-api';
import React, { useState } from 'react';

export const AiChatBox = ({ opened, setOpened }: AiChatBoxProps) => {
  const [response, setResponse] = useState<string | null>(null);

  const formik = useFormik<AiChatBoxFormValues>({
    initialValues: {
      text: '',
    },
    onSubmit: async (values) => {
      try {
        const result = await sendMessageToAIChat(values.text);
        setResponse(result.response);
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
      position={{ bottom: 80, right: 20 }}
    >
      <div>
        <form onSubmit={formik.handleSubmit}>
          <TextInput
            name="text"
            label="Message"
            placeholder="Type your message..."
            value={formik.values.text}
            onChange={formik.handleChange}
          />
          <Button type="submit">Send</Button>
          {response && <Text mt="md">{response}</Text>}{' '}
        </form>
      </div>
    </Dialog>
  );
};
