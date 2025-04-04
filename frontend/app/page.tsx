"use client";
import { useState } from "react";
import Header from "../components/Header";
import { useSearch } from "../lib/hooks/useSearch";
import ResultsSection from "@/components/ResultsSection";
import SearchSection from "@/components/SearchSection";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [numRecommendations, setNumRecommendations] = useState(3);
  const [orderType, setOrderType] = useState("ordered");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { results, streamedText, error, isLoading, handleSearch } = useSearch();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex justify-center w-full">
        <div className="container px-4 md:px-6">
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            numRecommendations={numRecommendations}
            setNumRecommendations={setNumRecommendations}
            orderType={orderType}
            setOrderType={setOrderType}
            handleSearch={handleSearch}
            isLoading={isLoading}
            setIsDrawerOpen={setIsDrawerOpen}
          />
          <ResultsSection
            results={results}
            streamedText={streamedText}
            error={error}
            isLoading={isLoading}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          />
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
