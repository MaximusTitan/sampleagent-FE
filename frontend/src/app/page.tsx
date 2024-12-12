'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatbotUI() {
  const [messages, setMessages] = useState<{ text: string; agentResponse: string | null }[]>([]);
  const [userInput, setUserInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (userInput.trim() === '') return;

    // Add a temporary message with a null agentResponse
    setMessages([...messages, { text: userInput, agentResponse: null }]);
    setUserInput('');

    fetch('http://127.0.0.1:8000/process-data/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_input: userInput,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1
              ? { ...msg, agentResponse: result["agent's response"] }
              : msg
          )
        );
      })
      .catch((error) => {
        console.error('Error sending input:', error.message);
      });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen ml-10 mr-10">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            {/* User Input aligned right */}
            <div className="block max-w-max p-2 bg-primary text-primary-foreground rounded-lg text-right ml-auto">
              {message.text}
            </div>
            {/* Agent Response aligned left */}
            {message.agentResponse !== null && (
              <div className="block max-w-max p-2 bg-secondary text-secondary-foreground rounded-lg text-left mt-2">
                {message.agentResponse}
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            className="flex-1"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button onClick={handleSubmit}>Send</Button>
        </div>
      </div>
    </div>
  );
}
