"use client";
import { useState } from "react";
import CourseCard from "../components/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSearch = async (searchQuery: string) => {
    console.log(apiUrl);
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setError(""); // Reset error state

    try {
      const response = await fetch(
        `${apiUrl}?query=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      // Check if we got valid results
      if (!Array.isArray(json)) {
        throw new Error("Invalid response format");
      }

      setResults(json);
    } catch (e) {
      console.error("Search error:", e);
      setError("Search error");
      setResults([]);
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
                    An error occured: {error}
                  </div>
                ) : isLoading ? (
                  <div className="text-center mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Searching courses...
                  </div>
                ) : results.length > 0 ? (
                  <div className="grid gap-6">
                    {results.map((course) => (
                      <CourseCard
                        key={course.name}
                        title={course.name}
                        description={course.topic}
                        link={course.link}
                        tags={[course.provider]}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      No results yet.
                    </p>
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
