"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "../lib/hooks/useSearch";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Results from "@/components/results";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [numRecommendations, setNumRecommendations] = useState(3);
  const [orderType, setOrderType] = useState("Ordered");
  const { results, streamedText, error, isLoading, handleSearch } = useSearch();

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Options</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                          Number of Recommendations
                        </label>
                        <Select
                          value={numRecommendations.toString()}
                          onValueChange={(value) =>
                            setNumRecommendations(Number(value))
                          }
                        >
                          <SelectTrigger>
                            <span>{numRecommendations}</span>
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                          Recommendation Type
                        </label>
                        <Select
                          value={orderType}
                          onValueChange={(value) => setOrderType(value)}
                        >
                          <SelectTrigger>
                            <span>{orderType}</span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ordered">
                              Ordered Sequence
                            </SelectItem>
                            <SelectItem value="Unordered">
                              Unordered List
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  onClick={() => {
                    handleSearch(searchQuery, numRecommendations, orderType);
                    setIsDrawerOpen(true); // Open the drawer
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </section>

          <section id="results" className="py-12 md:py-24">
            <Results
              results={results}
              error={error}
              isLoading={isLoading}
              streamedText={streamedText}
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
