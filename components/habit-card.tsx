"use client"

import type { Habit } from "@/types/habit"

interface HabitCardProps {
  habit: Habit
  completions: boolean[]
  currentDayIndex: number
  onToggle: (dayIndex: number) => void
  onDelete: () => void
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function HabitCard({ habit, completions, currentDayIndex, onToggle, onDelete }: HabitCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{habit.name}</h3>
        <button onClick={onDelete} className="text-muted-foreground hover:text-destructive transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-7 gap-2">
        {completions.map((completed, index) => (
          <div key={index} className="flex flex-col items-center">
            <button
              onClick={() => onToggle(index)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all font-medium text-sm mb-1 ${
                completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              } ${index === currentDayIndex ? "ring-2 ring-primary ring-offset-1" : ""}`}
            >
              {completed ? "✓" : "○"}
            </button>
            <span className="text-xs text-muted-foreground font-medium">{dayLabels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
