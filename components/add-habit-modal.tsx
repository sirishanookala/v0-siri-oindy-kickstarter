"use client"

import type React from "react"

import { useState } from "react"

interface AddHabitModalProps {
  onAdd: (name: string) => void
  onClose: () => void
}

export default function AddHabitModal({ onAdd, onClose }: AddHabitModalProps) {
  const [habitName, setHabitName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!habitName.trim()) {
      setError("Habit name cannot be empty")
      return
    }
    if (habitName.length > 50) {
      setError("Habit name must be less than 50 characters")
      return
    }
    onAdd(habitName)
    setHabitName("")
    setError("")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full bg-card rounded-t-2xl p-6 max-h-96 flex flex-col border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Create New Habit</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Habit Name</label>
            <input
              type="text"
              value={habitName}
              onChange={(e) => {
                setHabitName(e.target.value)
                setError("")
              }}
              placeholder="e.g., Morning Run, Read 30 minutes"
              autoFocus
              maxLength={50}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            <p className="text-xs text-muted-foreground mt-2">{habitName.length}/50 characters</p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
