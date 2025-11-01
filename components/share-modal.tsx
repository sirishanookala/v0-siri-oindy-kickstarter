"use client"

import type React from "react"

import { useState } from "react"
import type { Habit, HabitCompletion } from "@/types/habit"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  habits: Habit[]
  completions: HabitCompletion[]
}

export default function ShareModal({ isOpen, onClose, habits, completions }: ShareModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  if (!isOpen) return null

  const getWeeklyStats = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - 6)

    const stats = habits.map((habit) => {
      const completed = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        const dateStr = date.toISOString().split("T")[0]
        const key = `${habit.id}-${dateStr}`
        return completions.some((c) => c.key === key)
      })

      const completionCount = completed.filter(Boolean).length
      return {
        name: habit.name,
        completed: completionCount,
        total: 7,
        percentage: Math.round((completionCount / 7) * 100),
      }
    })

    return stats
  }

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter an email address" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const stats = getWeeklyStats()
      const response = await fetch("/api/share-habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: email,
          stats,
        }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Habits shared successfully!" })
        setEmail("")
        setTimeout(() => {
          onClose()
          setMessage(null)
        }, 2000)
      } else {
        const error = await response.json()
        setMessage({
          type: "error",
          text: error.message || "Failed to share habits. Please try again.",
        })
      }
    } catch {
      setMessage({
        type: "error",
        text: "An error occurred. Please check that RESEND_API_KEY is configured.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={onClose}>
      <div
        className="bg-background w-full rounded-t-2xl p-6 max-w-md mx-auto animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Share This Week</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleShare} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Friend's Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Share Habits"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}
