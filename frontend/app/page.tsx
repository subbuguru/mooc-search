//import { Button } from "@/components/ui/button"
import Link from "next/link"
import CourseCard from "./components/course-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="px-8 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">MOOC Search</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6">
        <section id="search" className="py-12 md:py-24 ">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                MOOC Search
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Search MOOCs with a Word2Vec model trained on over 4000 online courses from Harvard, MIT, and other top providers.
                </p>
              </div>
              <div className="flex items-center p-2 gap-4">
      <Input
        type="text"
        placeholder="Python Data Analytics"
        className="flex-1 text-gray-900 dark:text-white bg-transparent border-none focus:ring-0"
      />
      <Button>Search</Button>
    </div>
            </div>
          </div>
        </section>

        <section id="results" className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">Results</h2>
            <div className="grid gap-6">
              <CourseCard
                title="E-commerce Platform"
                description="A full-stack e-commerce platform built with Next.js, Prisma, and Stripe integration."
                link="https://github.com"
                tags={["Next.js", "Prisma", "Stripe"]}
              />
              <CourseCard
                title="Task Management App"
                description="A real-time task management application with team collaboration features."
                link="https://github.com"
                tags={["React", "Node.js", "Socket.io"]}
              />
              <CourseCard
                title="AI Chat Interface"
                description="An AI-powered chat interface with natural language processing capabilities."
                link="https://github.com"
                tags={["OpenAI", "Next.js", "TailwindCSS"]}
              />
            </div>
          </div>
        </section>
        </main>

      <footer className="border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Dhruva Kumar. Made with GenAI.</p>
        </div>
      </footer>
    </div>

  )
}

