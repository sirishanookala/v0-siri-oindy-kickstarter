export interface Habit {
  id: string
  name: string
  createdAt: string
}

export interface HabitCompletion {
  habitId: string
  key: string
  date: string
  completed: boolean
}
