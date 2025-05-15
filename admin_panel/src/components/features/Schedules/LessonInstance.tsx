import ScheduleTemplate from "./ScheduleTemplate";

const schedules = [
  { day: "Poniedziałek", lessonNumber: 1, subject: "Matematyka", teacher: "Kowalski", classroom: "101" },
  { day: "Poniedziałek", lessonNumber: 2, subject: "Fizyka", teacher: "Nowak", classroom: "102" },
  { day: "Wtorek", lessonNumber: 3, subject: "Chemia", teacher: "Wiśniewska", classroom: "103" },
  { day: "Środa", lessonNumber: 4, subject: "Historia", teacher: "Zieliński", classroom: "104" },
  { day: "Czwartek", lessonNumber: 5, subject: "Biologia", teacher: "Wójcik", classroom: "105" },
  { day: "Piątek", lessonNumber: 6, subject: "Język angielski", teacher: "Kaczmarek", classroom: "106" },
  { day: "Piątek", lessonNumber: 7, subject: "WF", teacher: "Lewandowski", classroom: "Hala sportowa" },
];

export default function App() {
  return <ScheduleTemplate schedules={schedules} />;
}
