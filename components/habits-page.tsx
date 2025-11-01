"use client"

import { useState, useEffect } from "react"
import type { Habit, HabitCompletion } from "@/types/habit"
import AddHabitModal from "./add-habit-modal"
import HabitCard from "./habit-card"
import ShareModal from "./share-modal"

export default function HabitsPage({
  selectedDate,
  onDateReset,
}: {
  selectedDate: Date | null
  onDateReset: () => void
}) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [completions, setCompletions] = useState<HabitCompletion[]>([])

  // Load data from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits")
    const savedCompletions = localStorage.getItem("completions")
    if (savedHabits) setHabits(JSON.parse(savedHabits))
    if (savedCompletions) setCompletions(JSON.parse(savedCompletions))
  }, [])

  // Save habits to localStorage
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
  }, [habits])

  // Save completions to localStorage
  useEffect(() => {
    localStorage.setItem("completions", JSON.stringify(completions))
  }, [completions])

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    }
    setHabits([...habits, newHabit])
    setShowModal(false)
  }

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((h) => h.id !== habitId))
    setCompletions(completions.filter((c) => c.habitId !== habitId))
  }

  const isCompletedOnDate = (habitId: string, date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    const key = `${habitId}-${dateStr}`
    return completions.some((c) => c.key === key)
  }

  const toggleCompletionOnDate = (habitId: string, date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    const key = `${habitId}-${dateStr}`
    const exists = completions.find((c) => c.key === key)

    if (exists) {
      setCompletions(completions.filter((c) => c.key !== key))
    } else {
      setCompletions([
        ...completions,
        {
          habitId,
          key,
          date: date.toISOString(),
          completed: true,
        },
      ])
    }
  }

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleString("default", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  }

  const toggleCompletion = (habitId: string, dayIndex: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() - (6 - dayIndex))

    const key = `${habitId}-${targetDate.toISOString().split("T")[0]}`
    const exists = completions.find((c) => c.key === key)

    if (exists) {
      setCompletions(completions.filter((c) => c.key !== key))
    } else {
      setCompletions([
        ...completions,
        {
          habitId,
          key,
          date: targetDate.toISOString(),
          completed: true,
        },
      ])
    }
  }

  const isCompleted = (habitId: string, dayIndex: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() - (6 - dayIndex))
    const key = `${habitId}-${targetDate.toISOString().split("T")[0]}`
    return completions.some((c) => c.key === key)
  }

  const getCurrentDayIndex = () => {
    return 6 // Always highlight the last day (today)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Habits</h1>
            {selectedDate && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">{formatDateDisplay(selectedDate)}</p>
                <button
                  onClick={onDateReset}
                  className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to Today
                </button>
              </div>
            )}
            {!selectedDate && <p className="text-sm text-muted-foreground">Track your daily progress</p>}
          </div>
          <div className="flex items-center gap-2">
            {!selectedDate && (
              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Share this week's habits"
              >
                <span className="text-lg">📤</span>
              </button>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <span className="text-lg">+</span>
              <span className="ml-2 text-sm font-medium">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">🌱</div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No habits yet</h2>
            <p className="text-sm text-muted-foreground mb-6">Start building habits to track your progress</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              if (selectedDate) {
                const isCompleted = isCompletedOnDate(habit.id, selectedDate)
                return (
                  <div
                    key={habit.id}
                    className="p-4 bg-card border border-border rounded-lg flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{habit.name}</h3>
                    </div>
                    <button
                      onClick={() => toggleCompletionOnDate(habit.id, selectedDate)}
                      className={`w-8 h-8 rounded-lg border-2 transition-colors flex items-center justify-center ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border hover:border-primary text-foreground"
                      }`}
                    >
                      {isCompleted && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                )
              }

              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  completions={Array.from({ length: 7 }, (_, i) => isCompleted(habit.id, i))}
                  currentDayIndex={getCurrentDayIndex()}
                  onToggle={(dayIndex) => toggleCompletion(habit.id, dayIndex)}
                  onDelete={() => deleteHabit(habit.id)}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      {showModal && <AddHabitModal onAdd={addHabit} onClose={() => setShowModal(false)} />}

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        habits={habits}
        completions={completions}
      />
    </div>
  )
}
