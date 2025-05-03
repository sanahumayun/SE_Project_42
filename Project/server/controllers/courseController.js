
const Assignment = require('../models/Assignment');
// // const User = require('../models/User');
// // const ChatRoom = require('../models/ChatRoom');

// // // const updateChatRoom = async (courseId, instructorId, students = []) => {
// // //   try {
// // //     let chatRoom = await ChatRoom.findOne({ courseId });
    
// // //     if (!chatRoom) {
// // //       chatRoom = new ChatRoom({
// // //         courseId,
// // //         participants: [{ userId: instructorId, role: 'tutor' }]
// // //       });
// // //     }

// // //     // Add students to chat room
// // //     const studentParticipants = students.map(studentId => ({
// // //       userId: studentId,
// // //       role: 'student'
// // //     }));

// // //     // Combine and remove duplicates
// // //     chatRoom.participants = [
// // //       ...new Map([
// // //         ...chatRoom.participants.map(p => [p.userId.toString(), p]),
// // //         ...studentParticipants.map(p => [p.userId.toString(), p])
// // //       ]).values()
// // //     ];

// // //     await chatRoom.save();
// // //     return chatRoom;
// // //   } catch (err) {
// // //     console.error('Error updating chat room:', err);
// // //     throw err;
// // //   }
// // // };
// // const updateChatRoom = async (courseId, instructorId, students = []) => {
// //   try {
// //     let chatRoom = await ChatRoom.findOne({ courseId });
    
// //     if (!chatRoom) {
// //       chatRoom = new ChatRoom({
// //         courseId,
// //         participants: [{ userId: instructorId, role: 'tutor' }]
// //       });
// //     }

// //     const studentParticipants = students.map(studentId => ({
// //       userId: studentId,
// //       role: 'student'
// //     }));

// //     chatRoom.participants = [
// //       ...new Map([
// //         ...chatRoom.participants.map(p => [p.userId.toString(), p]),
// //         ...studentParticipants.map(p => [p.userId.toString(), p])
// //       ]).values()
// //     ];

// //     // ✅ Always save chatRoom
// //     await chatRoom.save();

// //     return chatRoom;
// //   } catch (err) {
// //     console.error('Error updating chat room:', err);
// //     throw err;
// //   }
// // };



// // // 1. Get ALL public courses (no auth required)
// // exports.getAllCourses = async (req, res) => {
// //   try {
// //     const courses = await Course.find({}, 'title description instructorId')
// //       .populate('instructorId', 'name email') // only include name/email from user
// //       .populate('studentsEnrolled', 'name email');
// //     res.status(200).json(courses);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch courses' });
// //   }
// // };


// // // // 2. Create a course (Instructor/Admin only)
// // // exports.createCourse = async (req, res) => {
// // //   try {
// // //     const { title, description, instructorId } = req.body;
// // //     const newCourse = await Course.create({ title, description, instructorId });
// // //     res.status(201).json(newCourse);
// // //   } catch (err) {
// // //     console.log(err);
// // //     res.status(500).json({ error: 'Failed to create course' });
// // //   }
// // // };
// // exports.createCourse = async (req, res) => {
// //   try {
// //     const { title, description, instructorId } = req.body;
// //     const newCourse = await Course.create({ title, description, instructorId });
    
// //     // Create chat room for the course
// //     await updateChatRoom(newCourse._id, instructorId);
    
// //     res.status(201).json(newCourse);
// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).json({ error: 'Failed to create course' });
// //   }
// // };

// // // In the getMyEnrolledCourses controller
// // exports.getMyEnrolledCourses = async (req, res) => {
// //   try {
// //     if (req.user.role !== 'student') {
// //       console.error('User is not a student, role:', req.user.role);
// //       return res.status(403).json({ error: 'Only students can fetch enrolled courses' });
// //     }
// //     const courses = await Course.find({ studentsEnrolled: req.user.id })
// //       .populate('instructorId', 'name email');
// //     console.log('Courses fetched for student:', req.user.id);
// //     res.status(200).json(courses);
// //   } catch (err) {
// //     console.error('Error fetching courses for student:', err);
// //     res.status(500).json({ error: 'Failed to fetch your courses', details: err.message });
// //   }
// // };

// // exports.getTutorCourses = async (req, res) => {
// //   try {
// //     // Verify the user is a tutor
// //     if (req.user.role !== 'tutor') {
// //       console.error('User is not a tutor, role:', req.user.role);
// //       return res.status(403).json({ error: 'Only tutors can fetch their teaching courses' });
// //     }

// //     const tutorId = req.user.id;

// //     // Find courses with population if needed
// //     const courses = await Course.find({ instructorId: tutorId })
// //       .populate('studentsEnrolled', 'name email'); // Optional: populate enrolled students

// //     if (!courses.length) {
// //       console.log(`No courses found for tutor: ${tutorId}`);
// //       return res.status(200).json({ message: 'You are not teaching any courses yet.', courses: [] });
// //     }

// //     console.log(`Courses fetched for tutor: ${tutorId}`, courses.length);
// //     res.status(200).json(courses);
// //   } catch (err) {
// //     console.error('Error fetching courses for tutor:', err);
// //     res.status(500).json({ 
// //       error: 'Failed to fetch your teaching courses', 
// //       details: err.message 
// //     });
// //   }
// // };

// // // Enroll student (adds to chat room)
// // exports.enrollStudent = async (req, res) => {
// //   try {
// //     const { courseId } = req.params;
// //     const { studentId } = req.body;

// //     const course = await Course.findById(courseId);
// //     if (!course) {
// //       return res.status(404).json({ error: 'Course not found' });
// //     }

// //     if (course.studentsEnrolled.includes(studentId)) {
// //       return res.status(400).json({ error: 'Student already enrolled' });
// //     }

// //     course.studentsEnrolled.push(studentId);
// //     await course.save();

// //     // Update chat room with new student
// //     await updateChatRoom(courseId, course.instructorId, course.studentsEnrolled);

// //     res.status(200).json({ message: 'Student enrolled successfully', course });
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to enroll student', details: err.message });
// //   }
// // };

// // // Enroll a student in a course
// // // exports.enrollStudent = async (req, res) => {
// // //   try {
// // //     const { courseId } = req.params;
// // //     const { studentId } = req.body;

// // //     const course = await Course.findById(courseId);
// // //     if (!course) {
// // //       console.error(`Course not found with ID: ${courseId}`);
// // //       return res.status(404).json({ error: 'Course not found' });
// // //     }


// //     // const student = await User.findById(studentId);
// //     // if (!student || student.role !== 'student') {
// //     //   console.error(`Invalid student ID or not a student: ${studentId}`);
// //     //   return res.status(400).json({ error: 'Invalid student ID or user is not a student' });
// //     // }

// // //     if (course.studentsEnrolled.includes(studentId)) {
// // //       console.warn(`Student ${studentId} is already enrolled in course ${courseId}`);
// // //       return res.status(400).json({ error: 'Student already enrolled in this course' });
// // //     }

// // //     course.studentsEnrolled.push(studentId);
// // //     await course.save();

// // //     console.log(`Student ${studentId} successfully enrolled in course ${courseId}`);
// // //     res.status(200).json({ message: 'Student enrolled successfully', course });
// // //   } catch (err) {
// // //     console.error('Error enrolling student in course:', err);
// // //     res.status(500).json({ error: 'Failed to enroll student', details: err.message });
// // //   }
// // // };
// // exports.removeStudent = async (req, res) => {
// //   try {
// //     const { courseId } = req.params;
// //     const { studentId } = req.body;

// //     const course = await Course.findById(courseId);
// //     if (!course) {
// //       return res.status(404).json({ error: 'Course not found' });
// //     }

// //     const index = course.studentsEnrolled.indexOf(studentId);
// //     if (index === -1) {
// //       return res.status(400).json({ error: 'Student not enrolled' });
// //     }

// //     course.studentsEnrolled.splice(index, 1);
// //     await course.save();

// //     // Update chat room by removing student
// //     const chatRoom = await ChatRoom.findOne({ courseId });
// //     if (chatRoom) {
// //       chatRoom.participants = chatRoom.participants.filter(
// //         p => p.userId.toString() !== studentId
// //       );
// //       await chatRoom.save();
// //     }

// //     res.status(200).json({ message: 'Student removed successfully', course });
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to remove student', details: err.message });
// //   }
// // };

// // // exports.removeStudent = async (req, res) => {
// // //   try {
// // //     const { courseId } = req.params;
// // //     const { studentId } = req.body;

// // //     console.log("🧾 Remove request received:");
// // //     console.log("➡️  Course ID:", courseId);
// // //     console.log("➡️  Student ID:", studentId);

// // //     const course = await Course.findById(courseId);
// // //     if (!course) {
// // //       console.log("❌ Course not found");
// // //       return res.status(404).json({ error: 'Course not found' });
// // //     }

// // //     console.log("📚 Course found:", course.title);
// // //     console.log("👥 Enrolled students:", course.studentsEnrolled);

// // //     const index = course.studentsEnrolled.indexOf(studentId);
// // //     if (index === -1) {
// // //       console.log("❗ Student not found in enrolled list");
// // //       return res.status(400).json({ error: 'Student not enrolled in this course' });
// // //     }

// // //     console.log("✅ Student found at index", index, "- removing...");
// // //     course.studentsEnrolled.splice(index, 1); // remove student
// // //     await course.save();

// // //     console.log("💾 Course updated successfully");
// // //     res.status(200).json({ message: 'Student removed from course', course });
// // //   } catch (err) {
// // //     console.error("🚨 Error removing student:", err);
// // //     res.status(500).json({ error: 'Failed to remove student', details: err.message });
// // //   }
// // // };

// // exports.uploadAssignment = async (req, res) => {
// //   try {
// //     const { courseId } = req.params;
// //     const { title, description, dueDate, maxScore } = req.body;
// //     const tutorId = req.user.id;

// //     const newAssignment = new Assignment({
// //       course: courseId,
// //       tutor: tutorId,
// //       title,
// //       description,
// //       dueDate,
// //       maxScore,
// //       files: [], // you can handle file uploads later
// //     });

// //     const savedAssignment = await newAssignment.save();

// //     // (Optional) Add assignment to course's assignment list
// //     await Course.findByIdAndUpdate(courseId, {
// //       $push: { assignments: savedAssignment._id },
// //     });

// //     res.status(201).json({ message: 'Assignment uploaded successfully', assignment: savedAssignment });
// //   } catch (err) {
// //     console.error('Error uploading assignment:', err);
// //     res.status(500).json({ error: 'Failed to upload assignment', details: err.message });
// //   }
// // };

// const Course = require('../models/Course');
// const User = require('../models/User');
// const ChatRoom = require('../models/ChatRoom');
// const Assignment = require('../models/Assignment');  // Assuming you have an Assignment model

// const updateChatRoom = async (courseId, instructorId, students = []) => {
//   try {
//     let chatRoom = await ChatRoom.findOne({ courseId });
    
//     if (!chatRoom) {
//       chatRoom = new ChatRoom({
//         courseId,
//         participants: [{ userId: instructorId, role: 'tutor' }]
//       });
//     }

//     const studentParticipants = students.map(studentId => ({
//       userId: studentId,
//       role: 'student'
//     }));

//     chatRoom.participants = [
//       ...new Map([
//         ...chatRoom.participants.map(p => [p.userId.toString(), p]),
//         ...studentParticipants.map(p => [p.userId.toString(), p])
//       ]).values()
//     ];

//     await chatRoom.save();

//     return chatRoom;
//   } catch (err) {
//     console.error('Error updating chat room:', err);
//     throw err;
//   }
// };

// // 1. Get ALL public courses (no auth required)
// exports.getAllCourses = async (req, res) => {
//   try {
//     const courses = await Course.find({}, 'title description instructorId')
//       .populate('instructorId', 'name email')
//       .populate('studentsEnrolled', 'name email');
//     res.status(200).json(courses);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch courses' });
//   }
// };

// // 2. Create a course (Instructor/Admin only)
// exports.createCourse = async (req, res) => {
//   try {
//     const { title, description, instructorId } = req.body;
//     const newCourse = await Course.create({ title, description, instructorId });
    
//     // Create chat room for the course
//     await updateChatRoom(newCourse._id, instructorId);
    
//     res.status(201).json(newCourse);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: 'Failed to create course' });
//   }
// };

// // Get courses a student is enrolled in (students only)
// exports.getMyEnrolledCourses = async (req, res) => {
//   try {
//     if (req.user.role !== 'student') {
//       console.error('User is not a student, role:', req.user.role);
//       return res.status(403).json({ error: 'Only students can fetch enrolled courses' });
//     }
//     const courses = await Course.find({ studentsEnrolled: req.user.id })
//       .populate('instructorId', 'name email');
//     console.log('Courses fetched for student:', req.user.id);
//     res.status(200).json(courses);
//   } catch (err) {
//     console.error('Error fetching courses for student:', err);
//     res.status(500).json({ error: 'Failed to fetch your courses', details: err.message });
//   }
// };

// // Get courses a tutor is teaching (tutors only)
// exports.getTutorCourses = async (req, res) => {
//   try {
//     if (req.user.role !== 'tutor') {
//       console.error('User is not a tutor, role:', req.user.role);
//       return res.status(403).json({ error: 'Only tutors can fetch their teaching courses' });
//     }

//     const tutorId = req.user.id;
//     const courses = await Course.find({ instructorId: tutorId })
//       .populate('studentsEnrolled', 'name email');

//     if (!courses.length) {
//       console.log(`No courses found for tutor: ${tutorId}`);
//       return res.status(200).json({ message: 'You are not teaching any courses yet.', courses: [] });
//     }

//     console.log(`Courses fetched for tutor: ${tutorId}`, courses.length);
//     res.status(200).json(courses);
//   } catch (err) {
//     console.error('Error fetching courses for tutor:', err);
//     res.status(500).json({ error: 'Failed to fetch your teaching courses', details: err.message });
//   }
// };

// // Enroll student
// exports.enrollStudent = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { studentId } = req.body;

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ error: 'Course not found' });
//     }

//     if (course.studentsEnrolled.includes(studentId)) {
//       return res.status(400).json({ error: 'Student already enrolled' });
//     }

//     course.studentsEnrolled.push(studentId);
//     await course.save();

//     // Update chat room with new student
//     await updateChatRoom(courseId, course.instructorId, course.studentsEnrolled);

//     res.status(200).json({ message: 'Student enrolled successfully', course });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to enroll student', details: err.message });
//   }
// };

// // Remove student
// exports.removeStudent = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { studentId } = req.body;

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ error: 'Course not found' });
//     }

//     const index = course.studentsEnrolled.indexOf(studentId);
//     if (index === -1) {
//       return res.status(400).json({ error: 'Student not enrolled' });
//     }

//     course.studentsEnrolled.splice(index, 1);
//     await course.save();

//     // Update chat room by removing student
//     const chatRoom = await ChatRoom.findOne({ courseId });
//     if (chatRoom) {
//       chatRoom.participants = chatRoom.participants.filter(
//         p => p.userId.toString() !== studentId
//       );
//       await chatRoom.save();
//     }

//     res.status(200).json({ message: 'Student removed successfully', course });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to remove student', details: err.message });
//   }
// };

// // Update course status (added missing function)
// exports.updateCourseStatus = async (req, res) => {
//   try {
//     const courseId = req.params.id;
//     const { status } = req.body;

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ error: 'Course not found' });
//     }

//     course.status = status;
//     await course.save();

//     res.status(200).json(course);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update course status', details: err.message });
//   }
// };

// // Upload assignment
// exports.uploadAssignment = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { title, description, dueDate, maxScore } = req.body;
//     const tutorId = req.user.id;

//     const newAssignment = new Assignment({
//       course: courseId,
//       tutor: tutorId,
//       title,
//       description,
//       dueDate,
//       maxScore,
//       files: [],
//     });

//     const savedAssignment = await newAssignment.save();

//     // (Optional) Add assignment to course's assignment list
//     await Course.findByIdAndUpdate(courseId, {
//       $push: { assignments: savedAssignment._id },
//     });

//     res.status(201).json({ message: 'Assignment uploaded successfully', assignment: savedAssignment });
//   } catch (err) {
//     console.error('Error uploading assignment:', err);
//     res.status(500).json({ error: 'Failed to upload assignment', details: err.message });
//   }
// };

const Course = require('../models/Course');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');

// const updateChatRoom = async (courseId, instructorId, students = []) => {
//   try {
//     let chatRoom = await ChatRoom.findOne({ courseId });
    
//     if (!chatRoom) {
//       chatRoom = new ChatRoom({
//         courseId,
//         participants: [{ userId: instructorId, role: 'tutor' }]
//       });
//     }

//     // Add students to chat room
//     const studentParticipants = students.map(studentId => ({
//       userId: studentId,
//       role: 'student'
//     }));

//     // Combine and remove duplicates
//     chatRoom.participants = [
//       ...new Map([
//         ...chatRoom.participants.map(p => [p.userId.toString(), p]),
//         ...studentParticipants.map(p => [p.userId.toString(), p])
//       ]).values()
//     ];

//     await chatRoom.save();
//     return chatRoom;
//   } catch (err) {
//     console.error('Error updating chat room:', err);
//     throw err;
//   }
// };
const updateChatRoom = async (courseId, instructorId, students = []) => {
  try {
    console.log('🔧 Checking/creating chat room for course:', courseId);

    // Check if the chat room already exists for this course
    let chatRoom = await ChatRoom.findOne({ courseId });

    // If no chat room exists for the course, create a new one
    if (!chatRoom) {
      console.log('🆕 Creating new chat room for course:', courseId);
      
      chatRoom = new ChatRoom({
        courseId,  // Use courseId to link the chat room to the course
        participants: [{ userId: instructorId, role: 'tutor' }] // Add the instructor
      });

      // Add students to the chat room
      const studentParticipants = students.map(studentId => ({
        userId: studentId,
        role: 'student'
      }));

      chatRoom.participants = [
        ...new Map([
          ...chatRoom.participants.map(p => [p.userId.toString(), p]),
          ...studentParticipants.map(p => [p.userId.toString(), p])
        ]).values()
      ];

      // Save the new chat room
      await chatRoom.save();
      console.log('✅ New chat room created and saved:', chatRoom._id);
    } else {
      console.log('✅ Chat room already exists for course:', courseId);
    }

    return chatRoom;
  } catch (err) {
    console.error('Error updating or creating chat room:', err);
    throw err;
  }
};

// const updateChatRoom = async (courseId, instructorId, students = []) => {
//   try {
//     console.log('New course ID:', newCourse._id);

//     console.log('🔧 Checking/creating chat room for course:', courseId);
//     let chatRoom = await ChatRoom.findOne({ courseId });
    
//     if (!chatRoom) {
//       console.log('🆕 Creating new chat room');

//       chatRoom = new ChatRoom({
//         courseId,
//         participants: [{ userId: instructorId, role: 'tutor' }]
//       });
      
//     }

//     const studentParticipants = students.map(studentId => ({
//       userId: studentId,
//       role: 'student'
//     }));

//     chatRoom.participants = [
//       ...new Map([
//         ...chatRoom.participants.map(p => [p.userId.toString(), p]),
//         ...studentParticipants.map(p => [p.userId.toString(), p])
//       ]).values()
//     ];

//     // ✅ Always save chatRoom
//     await chatRoom.save();
//     console.log('✅ Chat room saved:', chatRoom._id);


//     return chatRoom;
//   } catch (err) {
//     console.error('Error updating chat room:', err);
//     throw err;
//   }
// };



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


// // 2. Create a course (Instructor/Admin only)
// exports.createCourse = async (req, res) => {
//   try {
//     const { title, description, instructorId } = req.body;
//     const newCourse = await Course.create({ title, description, instructorId });
//     res.status(201).json(newCourse);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: 'Failed to create course' });
//   }
// };
exports.createCourse = async (req, res) => {
  try {
    const { title, description, instructorId } = req.body;
    const newCourse = await Course.create({ title, description, instructorId });
    
    // Create chat room for the course
    console.log('Calling updateChatRoom with:', newCourse._id, instructorId);
    
    res.status(201).json(newCourse);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create course' });
  }

  await updateChatRoom(newCourse._id, instructorId);
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
      .populate('studentsEnrolled', 'name email'); // Optional: populate enrolled students

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

// Enroll student (adds to chat room)
exports.enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.studentsEnrolled.includes(studentId)) {
      return res.status(400).json({ error: 'Student already enrolled' });
    }

    course.studentsEnrolled.push(studentId);

    // Update chat room with new student
    res.status(200).json({ message: 'Student enrolled successfully', course });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enroll student', details: err.message });
  }

  await course.save();
  await updateChatRoom(courseId, course.instructorId, course.studentsEnrolled);

};

// Enroll a student in a course
// exports.enrollStudent = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { studentId } = req.body;

//     const course = await Course.findById(courseId);
//     if (!course) {
//       console.error(`Course not found with ID: ${courseId}`);
//       return res.status(404).json({ error: 'Course not found' });
//     }


    // const student = await User.findById(studentId);
    // if (!student || student.role !== 'student') {
    //   console.error(`Invalid student ID or not a student: ${studentId}`);
    //   return res.status(400).json({ error: 'Invalid student ID or user is not a student' });
    // }

//     if (course.studentsEnrolled.includes(studentId)) {
//       console.warn(`Student ${studentId} is already enrolled in course ${courseId}`);
//       return res.status(400).json({ error: 'Student already enrolled in this course' });
//     }

//     course.studentsEnrolled.push(studentId);
//     await course.save();

//     console.log(`Student ${studentId} successfully enrolled in course ${courseId}`);
//     res.status(200).json({ message: 'Student enrolled successfully', course });
//   } catch (err) {
//     console.error('Error enrolling student in course:', err);
//     res.status(500).json({ error: 'Failed to enroll student', details: err.message });
//   }
// };
exports.removeStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const index = course.studentsEnrolled.indexOf(studentId);
    if (index === -1) {
      return res.status(400).json({ error: 'Student not enrolled' });
    }

    course.studentsEnrolled.splice(index, 1);
    await course.save();

    // Update chat room by removing student
    const chatRoom = await ChatRoom.findOne({ courseId });
    if (chatRoom) {
      chatRoom.participants = chatRoom.participants.filter(
        p => p.userId.toString() !== studentId
      );
      await chatRoom.save();
    }

    res.status(200).json({ message: 'Student removed successfully', course });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove student', details: err.message });
  }
};

// exports.removeStudent = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { studentId } = req.body;

//     console.log("🧾 Remove request received:");
//     console.log("➡️  Course ID:", courseId);
//     console.log("➡️  Student ID:", studentId);

//     const course = await Course.findById(courseId);
//     if (!course) {
//       console.log("❌ Course not found");
//       return res.status(404).json({ error: 'Course not found' });
//     }

//     console.log("📚 Course found:", course.title);
//     console.log("👥 Enrolled students:", course.studentsEnrolled);

//     const index = course.studentsEnrolled.indexOf(studentId);
//     if (index === -1) {
//       console.log("❗ Student not found in enrolled list");
//       return res.status(400).json({ error: 'Student not enrolled in this course' });
//     }

//     console.log("✅ Student found at index", index, "- removing...");
//     course.studentsEnrolled.splice(index, 1); // remove student
//     await course.save();

//     console.log("💾 Course updated successfully");
//     res.status(200).json({ message: 'Student removed from course', course });
//   } catch (err) {
//     console.error("🚨 Error removing student:", err);
//     res.status(500).json({ error: 'Failed to remove student', details: err.message });
//   }
// };

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