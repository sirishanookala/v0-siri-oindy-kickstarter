"use client"

import { useState, useEffect } from "react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // Load settings from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications")
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications))
    if (savedTheme) setTheme(savedTheme)
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem("theme", theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      localStorage.removeItem("habits")
      localStorage.removeItem("completions")
      window.location.reload()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-6 border-b border-border">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto">
        {/* Notifications */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">Daily reminder notifications</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                notifications ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  notifications ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Theme */}
        <div className="px-6 py-6 border-b border-border">
          <h3 className="font-semibold text-foreground mb-4">Theme</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                theme === "light"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary/50"
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary/50"
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="px-6 py-6 border-b border-border">
          <h3 className="font-semibold text-foreground mb-4">Data Management</h3>
          <button
            onClick={clearAllData}
            className="w-full px-4 py-3 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors font-medium"
          >
            Clear All Data
          </button>
          <p className="text-xs text-muted-foreground mt-2">This action cannot be undone</p>
        </div>

        {/* About */}
        <div className="px-6 py-6">
          <h3 className="font-semibold text-foreground mb-4">About</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="text-foreground font-medium">1.0.0</span>
            </div>
            <button className="text-sm text-primary hover:underline">Privacy Policy</button>
            <button className="text-sm text-primary hover:underline">Terms of Service</button>
          </div>
        </div>
      </div>
    </div>
  )
}
