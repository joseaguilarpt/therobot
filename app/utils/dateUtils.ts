import dayjs, { ManipulateType } from "dayjs";

export const isOlderThanDate = (
  timestamp: string | number | Date,
  range: { time: number; measure: ManipulateType | undefined }
): boolean => {
  const date = dayjs(timestamp);
  const oneWeekAgo = dayjs().subtract(range.time, range.measure);
  return date.isBefore(oneWeekAgo);
};
