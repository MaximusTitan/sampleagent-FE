'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RawMessage {
  text: string;
  type: 'user' | 'agent' | 'tool';
  timestamp?: string;
}

interface Message {
  userInput: string;
  agentResponse: string | null;
  toolMessage?: string | null;
  rawMessages?: RawMessage[]; // Replace any[] with RawMessage[]
}

const base_url = process.env.NEXT_PUBLIC_BASE_URL!;

export default function ChatbotUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (userInput.trim() === '') return;
  
    // Add a temporary message with null values for placeholders
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        userInput,
        agentResponse: null,
        toolMessage: null,
        rawMessages: [],
      },
    ]);
    setUserInput(''); // Clear input field
  
    fetch(`${base_url}/process-data/`, {
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
        console.log(result); // Log the result for debugging
  
        // Update the last message with the response data
        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1
              ? {
                  userInput: msg.userInput,
                  agentResponse: result["agent's response"],
                  toolMessage: result["tool_response"] || null,
                  rawMessages: result["raw_messages"] || [],
                }
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
              {message.userInput}
            </div>
            
            {/* Tool Message aligned left */}
            {message.toolMessage && (
              <div className="block max-w-max p-2 bg-yellow-100 text-yellow-900 rounded-lg text-left mt-2">
                <strong>Tool Message:</strong>
                <br />
                {message.toolMessage}
              </div>
            )}
            
            {/* Agent Response aligned left */}
            {message.agentResponse !== null && (
              <div className="block max-w-max p-2 bg-secondary text-secondary-foreground rounded-lg text-left mt-2">
                <strong>AI Message:</strong>
                <br/>
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