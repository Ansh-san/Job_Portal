require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const connectDB = require('./config/db');

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('Database cleared.');

    // Create a few employers
    const employerData = Array.from({ length: 5 }).map(() => ({
      name: faker.company.name(),
      email: faker.internet.email(),
      password: 'password123',
      role: 'employer',
    }));

    const employers = await User.insertMany(employerData);
    console.log(`${employers.length} Employers created.`);

    // Create Jobseeker
    await User.create({
      name: 'John Doe',
      email: 'jobseeker@example.com',
      password: 'password123',
      role: 'jobseeker',
    });
    console.log('Jobseeker created.');

    const jobTypes = ['full-time', 'part-time', 'internship', 'remote'];
    const experienceLevels = ['fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years', 'entry-level', 'mid-level', 'senior-level'];
    const techSkills = ['React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'CSS', 'HTML', 'Next.js', 'Express', 'Git', 'Machine Learning', 'Data Analysis'];

    // Generate 50 Jobs
    const jobsToCreate = [];
    for (let i = 0; i < 50; i++) {
      const employer = employers[Math.floor(Math.random() * employers.length)];
      
      // Select 3 to 6 random skills
      const numSkills = Math.floor(Math.random() * 4) + 3;
      const skillsRequired = faker.helpers.arrayElements(techSkills, numSkills);

      jobsToCreate.push({
        title: faker.person.jobTitle(),
        description: faker.lorem.paragraphs(3) + '\n\nResponsibilities:\n- ' + faker.lorem.sentences(3).split('. ').join('.\n- '),
        company: employer.name,
        location: faker.location.city() + ', ' + faker.location.state({ abbreviated: true }),
        salaryRange: `$${faker.number.int({ min: 40, max: 80 })}k - $${faker.number.int({ min: 90, max: 180 })}k`,
        jobType: faker.helpers.arrayElement(jobTypes),
        experienceLevel: faker.helpers.arrayElement(experienceLevels),
        skillsRequired,
        postedBy: employer._id,
        createdAt: faker.date.recent({ days: 30 })
      });
    }

    await Job.insertMany(jobsToCreate);
    console.log('50 Jobs created.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
