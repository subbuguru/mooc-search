import { useState } from 'react';

interface Course {
  id: string;
  name: string;
  topic: string;
  link: string;
  provider: string;
}

export function useSearch() {
  const [results, setResults] = useState<Course[]>([]);
  const [streamedText, setStreamedText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSearch = async (
    searchQuery: string,
    numRecommendations: number,
    orderType: string,
  ) => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setStreamedText('');
    setResults([]);

    try {
      const response = await fetch(
        `${apiUrl}?query=${encodeURIComponent(
          searchQuery,
        )}&numRecommendations=${numRecommendations}&orderType=${orderType}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let fullText = '';

      while (!done) {
        const { value, done: readerDone } = await reader!.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamedText((prev) => prev + chunk);
      }

      const answerIndex = fullText.lastIndexOf('Answer:');
      if (answerIndex !== -1) {
        const jsonText = fullText.slice(answerIndex + 7).trim();
        try {
          const parsedResults = JSON.parse(jsonText);
          setResults(parsedResults);
        } catch (e) {
          console.error('JSON parsing error:', jsonText, e);
          throw new Error('Invalid JSON format in the response.');
        }
      } else {
        throw new Error('Final JSON output not found in the response.');
      }
    } catch (e) {
      console.error('Search error:', e);
      setError('Search error');
    } finally {
      setIsLoading(false);
    }
  };

  return { results, streamedText, error, isLoading, handleSearch };
}
