import mongoose from 'mongoose';
import Faculty from './models/Faculty.js';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Faculty.updateMany({}, { 
  department: 'Computer Science',
  specialization: ['MAT2004', 'Internet and Web Programming', 'Data Structures', 'Operating Systems', 'Database Management']
});

console.log('Updated!');
await mongoose.disconnect();