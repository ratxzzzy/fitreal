import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { NotificationWindow } from "./database.types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Recordatorios",
      importance: Notifications.AndroidImportance.MAX,
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

function windowHours(window: NotificationWindow): { start: number; end: number } {
  switch (window) {
    case "morning":
      return { start: 7, end: 11 };
    case "afternoon":
      return { start: 17, end: 21 };
    default:
      return { start: 9, end: 21 };
  }
}

function randomHourMinute(start: number, end: number): { hour: number; minute: number } {
  const totalMinutes = (end - start) * 60;
  const offset = Math.floor(Math.random() * totalMinutes);
  return {
    hour: start + Math.floor(offset / 60),
    minute: offset % 60,
  };
}

export async function scheduleDailyReminder(window: NotificationWindow) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const { start, end } = windowHours(window);

  for (let i = 0; i < 7; i++) {
    const { hour, minute } = randomHourMinute(start, end);
    const trigger = new Date();
    trigger.setDate(trigger.getDate() + i);
    trigger.setHours(hour, minute, 0, 0);
    if (i === 0 && trigger.getTime() < Date.now()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Tu momento FitReal",
        body: "Tienes 2 horas para subir tu foto del entreno",
        sound: true,
        data: { type: "daily_reminder" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      },
    });
  }

  // Reminder de racha en peligro (23:00 cada dia)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🚨 Tu racha en peligro",
      body: "Te queda 1 hora para subir tu foto y mantener la racha",
      sound: true,
      data: { type: "streak_warning" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 23,
      minute: 0,
      repeats: true,
    },
  });
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
