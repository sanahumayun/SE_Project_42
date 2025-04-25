// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import './DashboardSideBar.css';

// export default function DashboardSidebar() {
//   const role = localStorage.getItem('role');
//   const navigate = useNavigate();

//   const getRoleLinks = () => {
//     switch(role) {
//       case 'student':
//         return (
//           <>
//             <NavLink to="courses" className={({ isActive }) => isActive ? "active" : ""}>
//               My Courses
//             </NavLink>
//             <NavLink to="progress" className={({ isActive }) => isActive ? "active" : ""}>
//               Progress
//             </NavLink>
//             <NavLink to="assignments" className={({ isActive }) => isActive ? "active" : ""}>
//               Assignments
//             </NavLink>
//             <NavLink to="reviews" className={({ isActive }) => isActive ? "active" : ""}>
//               Reviews
//             </NavLink>
//             <NavLink to="chat" className={({ isActive }) => isActive ? "active" : ""}>
//               Chat
//             </NavLink>
//           </>
//         );
//       case 'tutor':
//         return (
//           <>
//             <NavLink to="manage-courses" className={({ isActive }) => isActive ? "active" : ""}>
//               Manage Courses
//             </NavLink>
//             <NavLink to="student-progress" className={({ isActive }) => isActive ? "active" : ""}>
//               Student Progress
//             </NavLink>
//             <NavLink to="create-assignment" className={({ isActive }) => isActive ? "active" : ""}>
//               Create Assignments
//             </NavLink>
//             <NavLink to="reviews" className={({ isActive }) => isActive ? "active" : ""}>
//               View Feedback
//             </NavLink>
//             <NavLink to="chat" className={({ isActive }) => isActive ? "active" : ""}>
//               Chat
//             </NavLink>
//           </>
//         );
//       case 'admin':
//         return (
//           <>
//             <NavLink to="course-management" className={({ isActive }) => isActive ? "active" : ""}>
//               Create Courses
//             </NavLink>
//             <NavLink to="analytics" className={({ isActive }) => isActive ? "active" : ""}>
//               System Analytics
//             </NavLink>
//             <NavLink to="reviews" className={({ isActive }) => isActive ? "active" : ""}>
//               All Feedback
//             </NavLink>
//             <NavLink to="users" className={({ isActive }) => isActive ? "active" : ""}>
//               User Management
//             </NavLink>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('userId');
//     localStorage.removeItem('userName');
//     navigate('/login', { replace: true });
//   };

//   return (
//     <div className="dashboard-sidebar" data-role={role}>
//       <div className="sidebar-header">
//         <h2>{role?.charAt(0).toUpperCase() + role?.slice(1)} Dashboard</h2>
//         <span className="user-role">{role}</span>
//       </div>
//       <div className="sidebar-links">
//         {getRoleLinks()}
//         <NavLink to="./profile" className={({ isActive }) => isActive ? 'active' : ''}>
//           Profile Settings
//         </NavLink>
//       </div>
//       <button className="logout-button" onClick={handleLogout}>
//         Logout
//       </button>
//     </div>
//   );
// }



import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './DashboardSideBar.css';

export default function DashboardSidebar() {
  const role = localStorage.getItem('role');    
  const navigate = useNavigate();
  // const { pathname } = useLocation();
  const base = `/dashboard/${role}`

  // pathname = "/dashboard/student/…", so split and grab role
  // const [, , role] = pathname.split('/');

  const links = {
    student: [
      { to: `${base}/courses`,     label: 'My Courses' },
      { to: `${base}/progress`,    label: 'Progress' },
      { to: `${base}/assignments`, label: 'Assignments' },
      { to: `${base}/reviews`,     label: 'Reviews' },
      { to: `${base}/chat`,        label: 'Chat' },
    ],
    tutor: [
      { to: `${base}/manage-courses`,   label: 'Manage Courses' },
      { to: `${base}/student-progress`, label: 'Student Progress' },
      { to: `${base}/create-assignment`,label: 'Create Assignments' },
      { to: `${base}/reviews`,          label: 'View Feedback' },
      { to: `${base}/chat`,             label: 'Chat' },
    ],
    admin: [
      // { to: `${base}/course-management`, label: 'Create Courses' },
      // { to: `${base}/analytics`,         label: 'System Analytics' },
      // { to: `${base}/reviews`,           label: 'All Feedback' },
      { to: `${base}/users`,             label: 'User Management' },
    ]
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  if (!role) return null; 

  return (
    <div className="dashboard-sidebar" data-role={role}>
      <div className="sidebar-header">
        <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h2>
        <span className="user-role">{role}</span>
      </div>

      <div className="sidebar-links">
        {links[role].map(({ to, label }) => (
          <NavLink 
            key={to}
            to={to}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {label}
          </NavLink>
        ))}
        {/* <NavLink to="profile" className={({ isActive }) => isActive ? 'active' : ''}>
          Profile Settings
        </NavLink> */}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

