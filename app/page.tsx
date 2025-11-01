"use client"

import { useState } from "react"
import HabitsPage from "@/components/habits-page"
import CalendarPage from "@/components/calendar-page"
import SettingsPage from "@/components/settings-page"

type Tab = "habits" | "calendar" | "settings"

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("habits")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setActiveTab("habits")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "habits" && <HabitsPage selectedDate={selectedDate} onDateReset={() => setSelectedDate(null)} />}
        {activeTab === "calendar" && <CalendarPage onDateSelect={handleDateSelect} />}
        {activeTab === "settings" && <SettingsPage />}
      </div>

      {/* Bottom Navigation */}
      <nav className="border-t border-border bg-card">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => setActiveTab("habits")}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              activeTab === "habits" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-xs">Habits</span>
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              activeTab === "calendar" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              activeTab === "settings" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
