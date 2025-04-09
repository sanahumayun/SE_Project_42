// src/pages/Courses/CreateCourse.jsx

import React, { useState } from 'react';
import { createCourse } from '../../api/course'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // or from context
      await createCourse({ title, description }, token);
      alert('Course created successfully!');
      navigate('/my-courses/instructor'); // or wherever makes sense
    } catch (err) {
      console.error(err);
      alert('Failed to create course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 mt-10 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create a New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-xl"
          required
        />
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-xl"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
