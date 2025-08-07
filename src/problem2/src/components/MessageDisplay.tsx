import React from 'react';

/**
 * Represents the state of a message to be displayed to the user.
 */
interface MessageState {
  type: '' | 'error' | 'success';
  text: string;
}

/**
 * Props for the MessageDisplay component.
 */
interface MessageDisplayProps {
  message: MessageState;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  if (!message.text) {
    return null;
  }

  return (
    <div
      className={`p-3 rounded-xl mb-4 text-sm font-medium ${
        message.type === 'error' ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
      }`}
      role="alert"
    >
      {message.text}
    </div>
  );
};

export default MessageDisplay;
