'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, ArrowUpIcon, Sun, Moon, Book } from 'lucide-react';
import { useFileContext } from '@/context/FileContext';

type Message = {
  content: string;
  type: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [inputText, setInputText] = useState('');
  const [showWarning, setShowWarning] = useState(false); // State to control warning visibility
  const { files, setFiles } = useFileContext(); // Access uploaded files and set them

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkTheme);
    document.body.classList.toggle('light', !isDarkTheme);
  }, [isDarkTheme]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      if (files.length === 0) {
        setShowWarning(true); // Show the warning if no files are uploaded
        return;
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { content: inputText, type: 'user' },
      ]);
      setInputText(''); // Clear input after sending the message
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handle file input change (when a file is selected)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles: File[]) => [...prevFiles, ...selectedFiles]); // Add files to context state
      setShowWarning(false); // Hide warning once a file is uploaded
    }
  };

  // Handle the click of the plus icon to trigger file selection
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  return (
    <div className={`flex flex-col h-screen ${isDarkTheme ? 'dark' : 'light'}`}>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for uploaded files */}
        <aside className={`w-64 h-full overflow-y-auto ${isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-300'} border-r p-4`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Book className="inline w-6 h-6 mr-2" /> {/* Book icon */}
              <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                Library
              </h2>
            </div>
            <button className="p-1 hover:bg-gray-700 rounded" onClick={handleFileClick}>
              <Plus className="w-6 h-6 text-gray-400" /> {/* Plus icon */}
            </button>
          </div>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className={`p-2 rounded-md transition-colors duration-200 ${isDarkTheme ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-black hover:bg-gray-200'}`}
              >
                {file.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main chat area */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Warning message */}
          {showWarning && (
            <div className="bg-red-500 text-white p-2 rounded-md mb-4 text-center">
              Click on '+' to upload a file in your library.
            </div>
          )}

          <div className="max-w-3xl mx-auto space-y-8">
            {/* Show "What can I help with?" only when there are no user messages */}
            {messages.length === 0 && (
              <div
                className={`flex items-center justify-center text-center text-3xl font-semibold ${isDarkTheme ? 'text-white' : 'text-black'} mb-8`}
                style={{ minHeight: '50vh' }} // Vertically center it
              >
                What can I help with?
              </div>
            )}

            {/* Display user messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col items-end space-y-2 ${isDarkTheme ? 'text-white' : 'text-black'} mb-4`}
              >
                <div className="text-right font-semibold">User</div> {/* User label */}
                <div className="bg-muted p-2 rounded-md text-right">{message.content}</div> {/* User's message */}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Fixed input area at bottom */}
      <div className={`border-t border-gray-700 ${isDarkTheme ? 'bg-[#1E1E1E]' : 'bg-white'} p-4`}>
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Your prompt here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full rounded-lg pl-4 pr-20 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkTheme ? '' : 'border border-gray-300'}`}
              style={{ backgroundColor: isDarkTheme ? '#2A2A2A' : '#FFFFFF', color: isDarkTheme ? '#FFFFFF' : '#000000' }}
            />
            <div className="absolute right-2 flex items-center space-x-2">
              <button
                className="p-1 hover:bg-gray-700 rounded"
                onClick={handleSendMessage}
              >
                <ArrowUpIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Theme toggle button */}
      <button
        className="absolute bottom-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600"
        onClick={toggleTheme}
      >
        {isDarkTheme ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-400" />}
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept=".pdf,.txt,.docx,.csv,.xlsx"
        onChange={handleFileChange} // Handle the file selection
      />
    </div>
  );
}
