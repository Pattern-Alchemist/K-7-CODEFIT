import { google } from "googleapis"

export interface CalendarEvent {
  summary: string
  description: string
  startTime: Date
  endTime: Date
  attendeeEmail: string
  location?: string
}

export async function createGoogleCalendarEvent(event: CalendarEvent) {
  try {
    // Initialize Google Calendar API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/calendar"],
    })

    const calendar = google.calendar({ version: "v3", auth })

    const calendarEvent = {
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: event.startTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: event.endTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      attendees: [{ email: event.attendeeEmail }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
      conferenceData: {
        createRequest: {
          requestId: `consultation-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    }

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      requestBody: calendarEvent,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    })

    return {
      success: true,
      eventId: response.data.id,
      meetLink: response.data.hangoutLink,
      htmlLink: response.data.htmlLink,
    }
  } catch (error) {
    console.error("Error creating Google Calendar event:", error)
    return { success: false, error }
  }
}

export function generateICalFile(event: CalendarEvent): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AstroKalki//Consultation//EN
BEGIN:VEVENT
UID:${Date.now()}@astrokalki.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(event.startTime)}
DTEND:${formatDate(event.endTime)}
SUMMARY:${event.summary}
DESCRIPTION:${event.description}
LOCATION:${event.location || "Online Video Consultation"}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Reminder: ${event.summary} tomorrow
END:VALARM
END:VEVENT
END:VCALENDAR`
}
