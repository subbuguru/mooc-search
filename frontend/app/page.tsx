"use client";
import { useState } from "react";
import CourseCard from "../components/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Course {
  id: string;
  name: string;
  topic: string;
  link: string;
  provider: string;
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Course[]>([]);
  const [streamedText, setStreamedText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setStreamedText("");
    setResults([]);

    try {
      const response = await fetch(
        `${apiUrl}?query=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let fullText = "";

      while (!done) {
        const { value, done: readerDone } = await reader!.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamedText((prev) => prev + chunk);
      }

      console.log("Full response:", fullText);

      const answerIndex = fullText.lastIndexOf("Answer:");
      if (answerIndex !== -1) {
        const jsonText = fullText.slice(answerIndex + 7).trim();
        console.log("Extracted JSON text:", jsonText);

        try {
          const parsedResults = JSON.parse(jsonText);
          setResults(parsedResults);
        } catch (e) {
          console.error("JSON parsing error:", e);
          throw new Error("Invalid JSON format in the response.");
        }
      } else {
        throw new Error("Final JSON output not found in the response.");
      }
    } catch (e) {
      console.error("Search error:", e);
      setError("Search error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between">
          <div className="container">
            <div className="px-8 hidden md:flex"></div>
          </div>
          <div className="px-8">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex justify-center w-full">
        <div className="container px-4 md:px-6">
          <section id="search" className="py-12 md:py-24">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  MOOC Search
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Search MOOCs with AI-powered recommendations.
                </p>
              </div>
              <div className="flex items-center p-2 gap-4 w-full max-w-[700px]">
                <Input
                  type="text"
                  placeholder="Python Data Analytics"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-gray-900 dark:text-white bg-transparent focus:ring-0"
                />
                <Button
                  onClick={() => handleSearch(searchQuery)}
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </section>

          <section id="results" className="py-12 md:py-24">
            <div className="flex justify-center w-full">
              <div className="container">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
                  Results
                </h2>
                {error != "" ? (
                  <div className="text-center mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    An error occurred: {error}
                  </div>
                ) : isLoading ? (
                  <div className="text-center mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    {streamedText || "Searching courses..."}
                  </div>
                ) : results.length > 0 ? (
                  <div className="grid gap-6">
                    {results.map((course, index) => (
                      <CourseCard
                        key={index}
                        title={course.name}
                        description={course.topic}
                        link={course.link}
                        tags={[course.provider]}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    No results yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            © Dhruva Kumar 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
