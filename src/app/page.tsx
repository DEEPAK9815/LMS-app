import Link from 'next/link';
import { ArrowRight, PlayCircle, BookOpen, GraduationCap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* Navbar Minimalist */}
      <header className="flex items-center justify-between border-b border-zinc-800/50 bg-zinc-950/80 px-8 py-4 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-500" />
          <span className="text-xl font-bold tracking-tighter">LumosLMS</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
            Sign In
          </Link>
          <Link href="/auth/register" className="rounded-full bg-zinc-100 px-5 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200 transition-all">
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6 py-24 sm:py-32">
        {/* Decorative Background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-3xl text-center relative z-10">
          <div className="mb-6 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
            Elevate your engineering skills today.
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-500 pb-2">
            Master Programming <br />
            <span className="text-zinc-100">Step by Step.</span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-zinc-400 max-w-2xl mx-auto">
            Experience a premium learning management system. Structured courses, seamless video progressing, and a beautifully minimalist environment designed for deep focus.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth/register"
              className="group flex items-center rounded-full bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Start Learning Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/subjects" className="text-sm font-semibold leading-6 text-zinc-300 hover:text-zinc-100 flex items-center">
              View Courses <PlayCircle className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="bg-zinc-900 border-t border-zinc-800/50 py-24 sm:py-32 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 text-center lg:text-left">
            
            <div className="flex flex-col lg:items-start items-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                <GraduationCap className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">Structured Paths</h3>
              <p className="mt-2 text-zinc-400 leading-relaxed">
                Step-by-step videos organized to make complex topics simple. You never lose your place.
              </p>
            </div>

            <div className="flex flex-col lg:items-start items-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                <PlayCircle className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">Seamless Playback</h3>
              <p className="mt-2 text-zinc-400 leading-relaxed">
                Resume from exactly where you left off. Smart progress tracking works magically behind the scenes.
              </p>
            </div>

            <div className="flex flex-col lg:items-start items-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                <BookOpen className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">Minimalist Focus</h3>
              <p className="mt-2 text-zinc-400 leading-relaxed">
                A dark-themed, premium UI designed specifically to eliminate distractions and keep you engaged.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 text-center relative z-10">
        <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} LumosLMS Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
