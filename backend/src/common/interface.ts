// This interface represent occupied time during working hour (6am to 6pm)
type IDailyTimetable = [boolean];

interface ICoordinate {
  zone: "Q10" | "TD";
  block: string;
  level: number;
}
