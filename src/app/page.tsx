"use client"

import { useEffect, useState, useRef } from 'react';
import { Button } from '../components/Button';
import { searchResults } from './search-results';

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searchResultImageSrc, setSearchResultImageSrc] = useState('');
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
    setTranscript('');
    setSearchResultImageSrc('');
    recognitionRef.current?.start();
    setIsListening(true);
  };

  const handleStop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);

    if (transcript.includes('show') && (transcript.includes('cat') || transcript.includes('dog'))) {
      const animal = transcript.includes('cat') ? 'cat' : 'dog';
      const color = (() => {
        if ( transcript.includes('black')) return 'black';
        if ( transcript.includes('blue')) return 'blue';
        if ( transcript.includes('gray')) return 'gray';
        if ( transcript.includes('green')) return 'green';
        if ( transcript.includes('orange')) return 'orange';
        if ( transcript.includes('red')) return 'red';
        return 'noMatch';
      })();
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSearchResultImageSrc((searchResults[animal] as any)[color]);
    }
  };

  const handleClear = () => {
    setTranscript('');
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 gap-8 md:p-8 pb-20 md:gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl md:text-4xl mx-auto">🎤 Speech Recognition</h1>
        <div className="flex gap-6 my-4 mx-0 justify-center items-center w-full flex-wrap">
          <Button onClick={handleStart} disabled={isListening}>
            Start Talking
          </Button>
          <Button onClick={handleStop} disabled={!isListening}>
            Stop Talking
          </Button>
          <Button onClick={handleClear} disabled={isListening}>
            Clear Transcript
          </Button>
        </div>
        <p className="italic">
          (To show a cat or dog: Click &quot;Start Talking&quot;, ask it to show you a cat or a dog of any color, then click &quot;Stop talking&quot;)
        </p>
        <div className="max-w-xl mx-auto text-left">
          <h2 className="font-bold">Transcript:</h2>
          <p>{transcript}</p>
          <p id="interim" style={{ color: 'gray' }}></p>
        </div>
        {searchResultImageSrc && (
          <div className="max-w-xl mx-auto text-left">
            <h3 className="font-bold">Search result:</h3>
            <img src={searchResultImageSrc} />
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center border-t-2 border-t-amber-600">
        Was this cool or what?!
      </footer>
    </div>
  );
}
