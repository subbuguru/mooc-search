"use client";
import { useState } from "react";
import CourseCard from "../components/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSearch } from "../lib/hooks/useSearch";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Info } from "lucide-react";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const { results, streamedText, error, isLoading, handleSearch } = useSearch();

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Results
              </h2>
              <Drawer>
                <DrawerTrigger>
                  <Button variant="outline" size="icon">
                    <Info></Info>
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Recommender Agent Reasoning</DrawerTitle>
                    <DrawerDescription>
                      The direct output from the recommender LLM agent.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 text-gray-500 dark:text-gray-400">
                    {streamedText || "No results yet."}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
            {error != "" ? (
              <div className="text-center mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                An error occurred: {error}
              </div>
            ) : isLoading ? (
              <div className="text-center mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                {"Searching courses..."}
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
