import mongoose from 'mongoose';
import Timetable from './models/Timetable.js';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
await Timetable.deleteMany({});

// Timetable 1 - Semester 4 - Conflicts ke saath
await Timetable.create({
  name: "Computer Science - Semester 4 2026",
  department: "Computer Science",
  semester: "4",
  year: 2026,
  status: "draft",
  schedule: [
    // Monday
    { courseId: "CSE001", facultyId: "FAC001", roomId: "ROOM001", day: "Monday", startTime: "09:00", endTime: "10:00", courseName: "Internet and Web Programming", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "09:00-10:00" },
    { courseId: "CSE002", facultyId: "FAC001", roomId: "ROOM001", day: "Monday", startTime: "09:00", endTime: "10:00", courseName: "Database Management Systems", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "09:00-10:00" },
    { courseId: "MAT001", facultyId: "FAC002", roomId: "ROOM001", day: "Monday", startTime: "11:15", endTime: "12:15", courseName: "Probability and Statistics", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "11:15-12:15" },
    { courseId: "CSE004", facultyId: "FAC001", roomId: "ROOM001", day: "Monday", startTime: "14:15", endTime: "15:15", courseName: "Operating Systems", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "14:15-15:15" },
    { courseId: "CSE005", facultyId: "FAC002", roomId: "ROOM001", day: "Monday", startTime: "15:15", endTime: "16:15", courseName: "Data Structures", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "15:15-16:15" },
    // Tuesday - conflict
    { courseId: "CSE003", facultyId: "FAC002", roomId: "ROOM001", day: "Tuesday", startTime: "10:00", endTime: "11:00", courseName: "Operating Systems", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "10:00-11:00" },
    { courseId: "CSE004", facultyId: "FAC002", roomId: "ROOM001", day: "Tuesday", startTime: "10:00", endTime: "11:00", courseName: "Data Structures", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "10:00-11:00" },
    { courseId: "MAT001", facultyId: "FAC001", roomId: "ROOM001", day: "Tuesday", startTime: "11:15", endTime: "12:15", courseName: "Probability and Statistics", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "11:15-12:15" },
    { courseId: "CSE001", facultyId: "FAC001", roomId: "ROOM001", day: "Tuesday", startTime: "14:15", endTime: "15:15", courseName: "Internet and Web Programming", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "14:15-15:15" },
    { courseId: "CSE005", facultyId: "FAC002", roomId: "ROOM001", day: "Tuesday", startTime: "15:15", endTime: "16:15", courseName: "Data Structures", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "15:15-16:15" },
    // Wednesday
    { courseId: "CSE001", facultyId: "FAC001", roomId: "ROOM001", day: "Wednesday", startTime: "09:00", endTime: "10:00", courseName: "Internet and Web Programming", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "09:00-10:00" },
    { courseId: "MAT001", facultyId: "FAC002", roomId: "ROOM001", day: "Wednesday", startTime: "10:00", endTime: "11:00", courseName: "Probability and Statistics", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "10:00-11:00" },
    { courseId: "CSE002", facultyId: "FAC001", roomId: "ROOM001", day: "Wednesday", startTime: "11:15", endTime: "12:15", courseName: "Database Management Systems", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "11:15-12:15" },
    { courseId: "CSE004", facultyId: "FAC001", roomId: "ROOM001", day: "Wednesday", startTime: "14:15", endTime: "15:15", courseName: "Operating Systems", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "14:15-15:15" },
    { courseId: "CSE005", facultyId: "FAC002", roomId: "ROOM001", day: "Wednesday", startTime: "15:15", endTime: "16:15", courseName: "Data Structures", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "15:15-16:15" },
    // Thursday
    { courseId: "CSE003", facultyId: "FAC002", roomId: "ROOM001", day: "Thursday", startTime: "09:00", endTime: "10:00", courseName: "Operating Systems", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "09:00-10:00" },
    { courseId: "CSE002", facultyId: "FAC001", roomId: "ROOM001", day: "Thursday", startTime: "10:00", endTime: "11:00", courseName: "Database Management Systems", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "10:00-11:00" },
    { courseId: "MAT001", facultyId: "FAC002", roomId: "ROOM001", day: "Thursday", startTime: "11:15", endTime: "12:15", courseName: "Probability and Statistics", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "11:15-12:15" },
    { courseId: "CSE001", facultyId: "FAC001", roomId: "ROOM001", day: "Thursday", startTime: "14:15", endTime: "15:15", courseName: "Internet and Web Programming", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "14:15-15:15" },
    { courseId: "CSE004", facultyId: "FAC001", roomId: "ROOM001", day: "Thursday", startTime: "15:15", endTime: "16:15", courseName: "Operating Systems", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "15:15-16:15" },
    // Friday
    { courseId: "CSE005", facultyId: "FAC002", roomId: "ROOM001", day: "Friday", startTime: "09:00", endTime: "10:00", courseName: "Data Structures", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "09:00-10:00" },
    { courseId: "CSE001", facultyId: "FAC001", roomId: "ROOM001", day: "Friday", startTime: "10:00", endTime: "11:00", courseName: "Internet and Web Programming", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "10:00-11:00" },
    { courseId: "MAT001", facultyId: "FAC002", roomId: "ROOM001", day: "Friday", startTime: "11:15", endTime: "12:15", courseName: "Probability and Statistics", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "11:15-12:15" },
    { courseId: "CSE002", facultyId: "FAC001", roomId: "ROOM001", day: "Friday", startTime: "14:15", endTime: "15:15", courseName: "Database Management Systems", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "14:15-15:15" },
    { courseId: "CSE003", facultyId: "FAC002", roomId: "ROOM001", day: "Friday", startTime: "15:15", endTime: "16:15", courseName: "Operating Systems", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "15:15-16:15" },
  ],
  conflicts: [
    { type: "faculty_conflict", message: "Faculty conflict: Dr. Priyanka Roy has 2 classes on Monday at 09:00", entries: ["0", "1"] },
    { type: "room_conflict", message: "Room conflict: Room A001 has 2 classes on Monday at 09:00", entries: ["0", "1"] },
    { type: "faculty_conflict", message: "Faculty conflict: Dr. Adnan Abassi has 2 classes on Tuesday at 10:00", entries: ["5", "6"] },
    { type: "room_conflict", message: "Room conflict: Room A001 has 2 classes on Tuesday at 10:00", entries: ["5", "6"] },
  ],
  metadata: { totalHours: 25, utilizationRate: 71, conflictCount: 4 }
});

// Timetable 2 - Semester 2 - No conflicts
await Timetable.create({
  name: "Computer Science - Semester 2 2026",
  department: "Computer Science",
  semester: "2",
  year: 2026,
  status: "published",
  schedule: [
    // Monday
    { courseId: "CSE101", facultyId: "FAC001", roomId: "ROOM001", day: "Monday", startTime: "09:00", endTime: "10:00", courseName: "Programming Fundamentals", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "09:00-10:00" },
    { courseId: "MAT101", facultyId: "FAC002", roomId: "ROOM001", day: "Monday", startTime: "10:00", endTime: "11:00", courseName: "Discrete Mathematics", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "10:00-11:00" },
    { courseId: "CSE102", facultyId: "FAC001", roomId: "ROOM001", day: "Monday", startTime: "11:15", endTime: "12:15", courseName: "Digital Logic Design", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "11:15-12:15" },
    { courseId: "MAT102", facultyId: "FAC002", roomId: "ROOM001", day: "Monday", startTime: "14:15", endTime: "15:15", courseName: "Linear Algebra", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "14:15-15:15" },
    { courseId: "CSE103", facultyId: "FAC001", roomId: "ROOM001", day: "Monday", startTime: "15:15", endTime: "16:15", courseName: "Computer Organization", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "15:15-16:15" },
    // Tuesday
    { courseId: "CSE101", facultyId: "FAC001", roomId: "ROOM001", day: "Tuesday", startTime: "09:00", endTime: "10:00", courseName: "Programming Fundamentals", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "09:00-10:00" },
    { courseId: "CSE102", facultyId: "FAC001", roomId: "ROOM001", day: "Tuesday", startTime: "11:15", endTime: "12:15", courseName: "Digital Logic Design", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "11:15-12:15" },
    { courseId: "MAT101", facultyId: "FAC002", roomId: "ROOM001", day: "Tuesday", startTime: "14:15", endTime: "15:15", courseName: "Discrete Mathematics", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "14:15-15:15" },
    { courseId: "CSE103", facultyId: "FAC001", roomId: "ROOM001", day: "Tuesday", startTime: "15:15", endTime: "16:15", courseName: "Computer Organization", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "15:15-16:15" },
    // Wednesday
    { courseId: "MAT102", facultyId: "FAC002", roomId: "ROOM001", day: "Wednesday", startTime: "09:00", endTime: "10:00", courseName: "Linear Algebra", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "09:00-10:00" },
    { courseId: "CSE101", facultyId: "FAC001", roomId: "ROOM001", day: "Wednesday", startTime: "10:00", endTime: "11:00", courseName: "Programming Fundamentals", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "10:00-11:00" },
    { courseId: "MAT101", facultyId: "FAC002", roomId: "ROOM001", day: "Wednesday", startTime: "11:15", endTime: "12:15", courseName: "Discrete Mathematics", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "11:15-12:15" },
    { courseId: "CSE102", facultyId: "FAC001", roomId: "ROOM001", day: "Wednesday", startTime: "14:15", endTime: "15:15", courseName: "Digital Logic Design", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "14:15-15:15" },
    { courseId: "CSE103", facultyId: "FAC001", roomId: "ROOM001", day: "Wednesday", startTime: "15:15", endTime: "16:15", courseName: "Computer Organization", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "15:15-16:15" },
    // Thursday
    { courseId: "MAT102", facultyId: "FAC002", roomId: "ROOM001", day: "Thursday", startTime: "09:00", endTime: "10:00", courseName: "Linear Algebra", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "09:00-10:00" },
    { courseId: "CSE101", facultyId: "FAC001", roomId: "ROOM001", day: "Thursday", startTime: "10:00", endTime: "11:00", courseName: "Programming Fundamentals", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "10:00-11:00" },
    { courseId: "MAT101", facultyId: "FAC002", roomId: "ROOM001", day: "Thursday", startTime: "14:15", endTime: "15:15", courseName: "Discrete Mathematics", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "14:15-15:15" },
    { courseId: "CSE102", facultyId: "FAC001", roomId: "ROOM001", day: "Thursday", startTime: "15:15", endTime: "16:15", courseName: "Digital Logic Design", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "15:15-16:15" },
    // Friday
    { courseId: "CSE103", facultyId: "FAC001", roomId: "ROOM001", day: "Friday", startTime: "09:00", endTime: "10:00", courseName: "Computer Organization", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "09:00-10:00" },
    { courseId: "MAT102", facultyId: "FAC002", roomId: "ROOM001", day: "Friday", startTime: "10:00", endTime: "11:00", courseName: "Linear Algebra", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "10:00-11:00" },
    { courseId: "CSE101", facultyId: "FAC001", roomId: "ROOM001", day: "Friday", startTime: "11:15", endTime: "12:15", courseName: "Programming Fundamentals", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "11:15-12:15" },
    { courseId: "MAT101", facultyId: "FAC002", roomId: "ROOM001", day: "Friday", startTime: "14:15", endTime: "15:15", courseName: "Discrete Mathematics", facultyName: "Dr. Adnan Abassi", roomName: "Room A001", timeSlot: "14:15-15:15" },
    { courseId: "CSE102", facultyId: "FAC001", roomId: "ROOM001", day: "Friday", startTime: "15:15", endTime: "16:15", courseName: "Digital Logic Design", facultyName: "Dr. Priyanka Roy", roomName: "Room A001", timeSlot: "15:15-16:15" },
  ],
  conflicts: [],
  metadata: { totalHours: 23, utilizationRate: 66, conflictCount: 0 }
});

console.log('Done! 2 timetables created.');
await mongoose.disconnect();