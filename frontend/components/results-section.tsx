"use client";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import CourseCard from "../components/course-card";
import { Key } from "react";

interface ResultsSectionProps {
  results: Array<{
    name: string;
    topic: string;
    link: string;
    provider: string;
  }>;
  streamedText: string;
  error: string;
  isLoading: boolean;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

export default function ResultsSection({
  results,
  streamedText,
  error,
  isLoading,
  isDrawerOpen,
  setIsDrawerOpen,
}: ResultsSectionProps) {
  return (
    <section id="results" className="py-12 md:py-24">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Results
        </h2>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <Info />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[75vh] mb-8">
            <DrawerHeader>
              <DrawerTitle>Recommender Agent Reasoning</DrawerTitle>
              <DrawerDescription>
                The direct output from the recommender LLM agent.
              </DrawerDescription>
            </DrawerHeader>
            <pre className="whitespace-pre-wrap text-gray-500 dark:text-gray-400 p-8 mb-8 overflow-y-auto">
              {streamedText}
            </pre>
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
          {results.map(
            (
              course: {
                name: string;
                topic: string;
                link: string;
                provider: string;
              },
              index: Key | null | undefined
            ) => (
              <CourseCard
                key={index}
                title={course.name}
                description={course.topic}
                link={course.link}
                tags={[course.provider]}
              />
            )
          )}
        </div>
      ) : (
        <div className="text-center mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          No results yet.
        </div>
      )}
    </section>
  );
}
