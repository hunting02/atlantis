import React from "react";
import { AtlantisTemporalPlainTime } from "../types";

interface FormatTimeProps<T extends AtlantisTemporalPlainTime | Date | string> {
  /**
   * Civil Time of time to be displayed.
   *
   * A `string` should be an ISO 8601 format date string.
   */
  readonly time: T;

  /**
   * Optionally specify clock format. If `undefined` system format will be respected.
   */
  readonly use24HourClock?: boolean;
}

export function FormatTime<
  T extends AtlantisTemporalPlainTime | Date | string,
>({ time: inputTime, use24HourClock }: FormatTimeProps<T>) {
  let dateObject: Date;

  if (inputTime instanceof Date) {
    dateObject = inputTime;
  } else if (typeof inputTime === "string") {
    dateObject = new Date(inputTime);
  } else {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDay();
    dateObject = new Date(
      currentYear,
      currentMonth,
      currentDay,
      inputTime.hour,
      inputTime.minute,
      inputTime.second,
      inputTime.millisecond,
    );
  }

  return <>{formatCivilTime(dateObject, use24HourClock)}</>;
}

function formatCivilTime(date: Date, use24HourClock?: boolean) {
  return date.toLocaleTimeString(navigator.language, {
    hour12: typeof use24HourClock === "boolean" ? !use24HourClock : undefined,
    minute: "2-digit",
    hour: "numeric",
  });
}
