import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get('/api/users?role=tutor'); // or whatever endpoint gives tutors
        setInstructors(res.data);
      } catch (err) {
        console.error('Failed to fetch instructors', err);
      }
    };

    fetchInstructors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/courses', {
        title,
        description,
        instructorId,
      });

      setTitle('');
      setDescription('');
      setInstructorId('');
      setSuccessMessage('Course created successfully!');
    } catch (err) {
      console.error('Failed to create course', err);
      setSuccessMessage('Failed to create course.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create a New Course</h2>

      {successMessage && (
        <p className="mb-2 text-green-600">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Assign Instructor</label>
          <select
            className="w-full border p-2 rounded"
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            required
          >
            <option value="">Select an instructor</option>
            {instructors.map((inst) => (
              <option key={inst._id} value={inst._id}>
                {inst.name} ({inst.email})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse
