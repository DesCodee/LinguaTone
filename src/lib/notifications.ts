export function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return Promise.resolve(false)
  return Notification.requestPermission().then((p) => p === 'granted')
}

export function sendReminderNotification(title: string, body: string): boolean {
  if (!('Notification' in window) || Notification.permission !== 'granted') return false
  new Notification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
  })
  return true
}

export function scheduleDailyReminder(hour: number = 20, minute: number = 0): void {
  if (!('Notification' in window)) return
  
  // Проверяем каждую минуту — не идеально, но для MVP работает
  setInterval(() => {
    const now = new Date()
    if (now.getHours() === hour && now.getMinutes() === minute) {
      sendReminderNotification(
        'LinguaTone — Time to practice!',
        'Your daily goal is waiting. 10 minutes for better tones!'
      )
    }
  }, 60000)
}