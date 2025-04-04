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
import CourseCard from "@/components/course-card";

interface ResultsProps {
  results: Array<{
    name: string;
    topic: string;
    link: string;
    provider: string;
  }>;
  error: string | null;
  isLoading: boolean;
  streamedText: string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

// Results function component that displays the streamed output passed down from page.tsx in a drawer and the final course array, passed down as the results prop

export default function Results({
  results,
  error,
  isLoading,
  streamedText,
  isDrawerOpen,
  setIsDrawerOpen,
}: ResultsProps) {
  return (
    <>
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
      {error ? (
        <div className="text-center mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          An error occurred: {error}
        </div>
      ) : isLoading ? (
        <div className="text-center mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Searching courses...
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
    </>
  );
}
