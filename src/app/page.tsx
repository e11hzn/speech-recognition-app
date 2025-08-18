"use client"

import Image from "next/image";
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptChunk + ' ');
        } else {
          interimTranscript += transcriptChunk;
        }
      }
      const iterimElement = document.getElementById('interim');
      if (iterimElement) {
        iterimElement.innerText = interimTranscript;
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleStart = () => {
    recognitionRef.current?.start();
    setIsListening(true);
  };

  const handleStop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleClear = () => {
    setTranscript('');
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl mx-auto">🎤 Speech Recognition</h1>
        <div className="flex gap-6 my-4 mx-0 justify-center items-center w-full">
          <button className="rounded-2xl my-4 mx-0 py-2 px-4 bg-amber-200 disabled:text-gray-400" onClick={handleStart} disabled={isListening}>
            Start Listening
          </button>
          <button className="rounded-2xl my-4 mx-0 py-2 px-4 bg-amber-200 disabled:!text-gray-400" onClick={handleStop} disabled={!isListening}>
            Stop Listening
          </button>
          <button className="rounded-2xl my-4 mx-0 py-2 px-4 bg-amber-200 disabled:!text-gray-400" onClick={handleClear} disabled={isListening}>
            Clear Transcript
          </button>
        </div>
        <div className="mt-8 max-w-xl mx-auto text-left">
          <h2>Transcript:</h2>
          <p>{transcript}</p>
          <p id="interim" style={{ color: 'gray' }}></p>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center border-t-2 border-t-amber-600">
        Was this cool or what?!
      </footer>
    </div>
  );
}
