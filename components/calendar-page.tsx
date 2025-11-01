"use client"

import { useState } from "react"

export default function CalendarPage({ onDateSelect }: { onDateSelect: (date: Date) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => null)

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onDateSelect(selectedDate)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-6 border-b border-border">
        <h1 className="text-3xl font-bold text-foreground mb-2">Calendar</h1>
        <p className="text-sm text-muted-foreground">Click a date to view habits for that day</p>
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={previousMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold text-foreground">{monthName}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-3 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="h-12 flex items-center justify-center font-semibold text-sm text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-3">
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-16 rounded-lg bg-muted/20" />
          ))}
          {days.map((day) => {
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`h-16 rounded-lg font-semibold transition-colors cursor-pointer ${
                  isToday
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-card border border-border hover:border-primary/50 text-foreground"
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>

        {/* Coming Soon Message */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg text-center">
          <p className="text-muted-foreground">Calendar analytics coming soon</p>
        </div>
      </div>
    </div>
  )
}
