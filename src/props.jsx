import { useState } from "react";

function Child(student){
  return (
    <div>
      {students.map((student, index) => (
        <div key={index}>
          <h3>{student.name}</h3>
          <p>Course: {student.course}</p>
          <p>Marks: {student.marks.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

function App() {
  const students = [
    {
      name: "Ansh",
      course: "React",
      marks: [85, 90, 88]
    },
    {
      name: "Akash",
      course: "JavaScript",
      marks: [75, 82, 79]
    },
    {
      name: "Aman",
      course: "Node.js",
      marks: [82,92,34]
    }
  ];

  return <Child students={students} />;
}

export default App;