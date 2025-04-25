const Course = require('../models/Course');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

// 1. Get ALL public courses (no auth required)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, 'title description instructorId')
      .populate('instructorId', 'name email') // only include name/email from user
      .populate('studentsEnrolled', 'name email')
      .populate('assignments');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};


// 2. Create a course (Instructor/Admin only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, instructorId } = req.body;
    const newCourse = await Course.create({ title, description, instructorId });
    res.status(201).json(newCourse);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// In the getMyEnrolledCourses controller
exports.getMyEnrolledCourses = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      console.error('User is not a student, role:', req.user.role);
      return res.status(403).json({ error: 'Only students can fetch enrolled courses' });
    }
    const courses = await Course.find({ studentsEnrolled: req.user.id })
      .populate('instructorId', 'name email');
    console.log('Courses fetched for student:', req.user.id);
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error fetching courses for student:', err);
    res.status(500).json({ error: 'Failed to fetch your courses', details: err.message });
  }
};

exports.getTutorCourses = async (req, res) => {
  try {
    // Verify the user is a tutor
    if (req.user.role !== 'tutor') {
      console.error('User is not a tutor, role:', req.user.role);
      return res.status(403).json({ error: 'Only tutors can fetch their teaching courses' });
    }

    const tutorId = req.user.id;

    // Find courses with population if needed
    const courses = await Course.find({ instructorId: tutorId })
      .populate('studentsEnrolled', 'name email'); 

    if (!courses.length) {
      console.log(`No courses found for tutor: ${tutorId}`);
      return res.status(200).json({ message: 'You are not teaching any courses yet.', courses: [] });
    }

    console.log(`Courses fetched for tutor: ${tutorId}`, courses.length);
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error fetching courses for tutor:', err);
    res.status(500).json({ 
      error: 'Failed to fetch your teaching courses', 
      details: err.message 
    });
  }
};

// Enroll a student in a course
exports.enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      console.error(`Course not found with ID: ${courseId}`);
      return res.status(404).json({ error: 'Course not found' });
    }

    // const student = await User.findById(studentId);
    // if (!student || student.role !== 'student') {
    //   console.error(`Invalid student ID or not a student: ${studentId}`);
    //   return res.status(400).json({ error: 'Invalid student ID or user is not a student' });
    // }

    if (course.studentsEnrolled.includes(studentId)) {
      console.warn(`Student ${studentId} is already enrolled in course ${courseId}`);
      return res.status(400).json({ error: 'Student already enrolled in this course' });
    }

    course.studentsEnrolled.push(studentId);
    await course.save();

    console.log(`Student ${studentId} successfully enrolled in course ${courseId}`);
    res.status(200).json({ message: 'Student enrolled successfully', course });
  } catch (err) {
    console.error('Error enrolling student in course:', err);
    res.status(500).json({ error: 'Failed to enroll student', details: err.message });
  }
};

exports.removeStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    console.log("🧾 Remove request received:");
    console.log("➡️  Course ID:", courseId);
    console.log("➡️  Student ID:", studentId);

    const course = await Course.findById(courseId);
    if (!course) {
      console.log("❌ Course not found");
      return res.status(404).json({ error: 'Course not found' });
    }

    console.log("📚 Course found:", course.title);
    console.log("👥 Enrolled students:", course.studentsEnrolled);

    const index = course.studentsEnrolled.indexOf(studentId);
    if (index === -1) {
      console.log("❗ Student not found in enrolled list");
      return res.status(400).json({ error: 'Student not enrolled in this course' });
    }

    console.log("✅ Student found at index", index, "- removing...");
    course.studentsEnrolled.splice(index, 1); // remove student
    await course.save();

    console.log("💾 Course updated successfully");
    res.status(200).json({ message: 'Student removed from course', course });
  } catch (err) {
    console.error("🚨 Error removing student:", err);
    res.status(500).json({ error: 'Failed to remove student', details: err.message });
  }
};

exports.uploadAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate, maxScore } = req.body;
    const tutorId = req.user.id;

    const newAssignment = new Assignment({
      course: courseId,
      tutor: tutorId,
      title,
      description,
      dueDate,
      maxScore,
      files: [], // you can handle file uploads later
    });

    const savedAssignment = await newAssignment.save();

    // (Optional) Add assignment to course's assignment list
    await Course.findByIdAndUpdate(courseId, {
      $push: { assignments: savedAssignment._id },
    });

    res.status(201).json({ message: 'Assignment uploaded successfully', assignment: savedAssignment });
  } catch (err) {
    console.error('Error uploading assignment:', err);
    res.status(500).json({ error: 'Failed to upload assignment', details: err.message });
  }
};

exports.updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['in progress', 'complete'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};