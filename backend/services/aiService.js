const { GoogleGenerativeAI } = require('@google/generative-ai');

// Function to extract structured data from resume text using Gemini
const extractResumeData = async (resumeText) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // Mock fallback if no API key is provided
  if (!apiKey) {
    console.log('No GEMINI_API_KEY found in .env. Using mock AI resume parsing.');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Problem Solving', 'Teamwork'],
          bio: 'A passionate and results-driven software engineer with experience building scalable full-stack web applications using the MERN stack. Adept at creating intuitive user interfaces and robust backend architectures. (Note: This is auto-generated mock data because no API key was provided.)'
        });
      }, 1500); // Simulate network delay
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use the recommended model for general text tasks
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI resume parser. Read the following resume text and extract the candidate's professional bio/summary and their key skills. 
      Return the data strictly in the following JSON format:
      {
        "bio": "A professional summary of the candidate's experience and background.",
        "skills": ["Skill 1", "Skill 2", "Skill 3"]
      }
      
      Do not include markdown blocks like \`\`\`json, just return the raw JSON object.

      RESUME TEXT:
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Sometimes the model might wrap the output in markdown code blocks despite the instruction
    text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();

    const parsedData = JSON.parse(text);
    return {
      bio: parsedData.bio || '',
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : []
    };
  } catch (error) {
    console.error('Error extracting resume data with Gemini:', error);
    // Return empty fields on error so it doesn't crash the upload process
    return {
      bio: '',
      skills: []
    };
  }
};

module.exports = {
  extractResumeData
};
