"use client"

import { useEffect, useState, useRef } from 'react';
import { Button } from '../components/Button';
import { searchResults } from './search-results';

type State = {
  isListening: boolean;
  searchResultImageSrc: string | null;
  transcript: string | null;
};

export default function Home() {
  const [state, setState] = useState<State>({
    isListening: false,
    searchResultImageSrc: null,
    transcript: null,
  })
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    hasInitialized.current = true;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          handleStop(event.results[i][0].transcript);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleStart = () => {
    setState({
      isListening: true,
      searchResultImageSrc: null,
      transcript: null,
    });
    recognitionRef.current?.start();
  };

  const handleStop = (transcriptChunk: string) => {
    let matchingSearchResultImageSrc: string | null = null;
    recognitionRef.current?.stop();

    if (transcriptChunk.includes('show') && (transcriptChunk.includes('cat') || transcriptChunk.includes('dog'))) {
      const animal = transcriptChunk.includes('cat') ? 'cat' : 'dog';
      const color = (() => {
        if ( transcriptChunk.includes('black')) return 'black';
        if ( transcriptChunk.includes('blue')) return 'blue';
        if ( transcriptChunk.includes('gray')) return 'gray';
        if ( transcriptChunk.includes('green')) return 'green';
        if ( transcriptChunk.includes('orange')) return 'orange';
        if ( transcriptChunk.includes('red')) return 'red';
        return 'noMatch';
      })();
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      matchingSearchResultImageSrc = (searchResults[animal] as any)[color];
      if (!matchingSearchResultImageSrc) {
        matchingSearchResultImageSrc = searchResults[animal].noMatch;
      }
    }

    setState({
      isListening: false,
      searchResultImageSrc: matchingSearchResultImageSrc,
      transcript: transcriptChunk,
    });
  };

  const handleClear = () => {
    setState({
      isListening: false,
      searchResultImageSrc: null,
      transcript: null,
    });
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 gap-8 md:p-8 pb-20 md:gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl md:text-4xl mx-auto">🎤 Speech Recognition</h1>
        <div className="flex gap-6 my-4 mx-0 justify-center items-center w-full flex-wrap">
          <Button onClick={handleStart} disabled={state.isListening}>
            Start Talking
          </Button>
          <Button onClick={handleClear} disabled={!state.transcript}>
            Clear
          </Button>
        </div>
        <p className="italic">
          (To show a cat or dog: Click &quot;Start Talking&quot;, ask it to show you a cat or a dog of any color, then click &quot;Stop talking&quot;)
        </p>
        <div className="max-w-xl mx-auto text-left">
          <h2 className="font-bold">Transcript:</h2>
          <p>{state.transcript}</p>
        </div>
        {state.searchResultImageSrc && (
          <div className="max-w-xl mx-auto text-left">
            <h3 className="font-bold">Search result:</h3>
            <img src={state.searchResultImageSrc} />
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center border-t-2 border-t-amber-600">
        Was this cool or what?!
      </footer>
    </div>
  );
}
