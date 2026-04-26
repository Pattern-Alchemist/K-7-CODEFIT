import type React from "react"
import { ExternalLink, BookOpen } from "lucide-react"

interface AnswerCardProps {
  question: string
  shortAnswer: string
  fullContent: React.ReactNode
  sources?: Array<{
    title: string
    url?: string
  }>
  tags?: string[]
}

export function AnswerCard({ question, shortAnswer, fullContent, sources, tags }: AnswerCardProps) {
  return (
    <article className="rounded-3xl glass glow p-8 space-y-6 border border-cyan-500/20">
      {/* Question Header */}
      <div>
        <h2 className="font-cinzel text-2xl font-semibold text-cyan-300 mb-3">{question}</h2>
      </div>

      {/* Short Answer - SEO Optimized for AI Extraction */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-2xl p-6 border border-cyan-400/30">
        <p className="text-lg text-white font-medium leading-relaxed">
          <strong className="text-cyan-200">Quick Answer:</strong> {shortAnswer}
        </p>
      </div>

      {/* Full Content */}
      <div className="space-y-4 text-white/85">{fullContent}</div>

      {/* Sources - Trust Signal */}
      {sources && sources.length > 0 && (
        <div className="border-t border-white/10 pt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-200 mb-3">
            <BookOpen className="h-4 w-4" />
            Authoritative Sources
          </h3>
          <ul className="space-y-2">
            {sources.map((source, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-cyan-300 mt-1">→</span>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1"
                  >
                    {source.title}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span>{source.title}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags for Better Discoverability */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-cyan-500/20 text-cyan-200 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
