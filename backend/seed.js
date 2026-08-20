require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const connectDB = require('./config/db');

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    console.log('Database cleared.');

    // Create 2 employer users
    const employers = await User.create([
      {
        name: 'Tech Corp',
        email: 'employer1@example.com',
        password: 'password123',
        role: 'employer',
      },
      {
        name: 'Innovate LLC',
        email: 'employer2@example.com',
        password: 'password123',
        role: 'employer',
      }
    ]);
    console.log('Employers created.');

    // Create 1 jobseeker user
    await User.create({
      name: 'John Doe',
      email: 'jobseeker@example.com',
      password: 'password123',
      role: 'jobseeker',
    });
    console.log('Jobseeker created.');

    // Create 8 job postings
    const jobs = [
      {
        title: 'Software Engineer',
        description: 'Looking for a skilled software engineer to join our team.',
        company: employers[0].name,
        location: 'New York, NY',
        salaryRange: '$100k - $120k',
        jobType: 'full-time',
        postedBy: employers[0]._id,
      },
      {
        title: 'Frontend Developer',
        description: 'React developer needed for exciting new project.',
        company: employers[1].name,
        location: 'San Francisco, CA',
        salaryRange: '$110k - $130k',
        jobType: 'full-time',
        postedBy: employers[1]._id,
      },
      {
        title: 'Backend Intern',
        description: 'Learn and grow with our backend team.',
        company: employers[0].name,
        location: 'Austin, TX',
        salaryRange: '$40k - $50k',
        jobType: 'internship',
        postedBy: employers[0]._id,
      },
      {
        title: 'Remote DevOps Engineer',
        description: 'Manage our cloud infrastructure from anywhere.',
        company: employers[1].name,
        location: 'Remote',
        salaryRange: '$120k - $140k',
        jobType: 'remote',
        postedBy: employers[1]._id,
      },
      {
        title: 'Part-time UI/UX Designer',
        description: 'Help us design beautiful interfaces.',
        company: employers[0].name,
        location: 'Chicago, IL',
        salaryRange: '$50/hr',
        jobType: 'part-time',
        postedBy: employers[0]._id,
      },
      {
        title: 'Full Stack Developer',
        description: 'Node.js and React expertise required.',
        company: employers[1].name,
        location: 'Seattle, WA',
        salaryRange: '$115k - $135k',
        jobType: 'full-time',
        postedBy: employers[1]._id,
      },
      {
        title: 'Data Analyst Intern',
        description: 'Assist in data analysis and visualization.',
        company: employers[0].name,
        location: 'Boston, MA',
        salaryRange: '$35k - $45k',
        jobType: 'internship',
        postedBy: employers[0]._id,
      },
      {
        title: 'Senior Product Manager',
        description: 'Lead our product strategy and development.',
        company: employers[1].name,
        location: 'Denver, CO',
        salaryRange: '$130k - $160k',
        jobType: 'full-time',
        postedBy: employers[1]._id,
      }
    ];

    await Job.insertMany(jobs);
    console.log('Jobs created.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
