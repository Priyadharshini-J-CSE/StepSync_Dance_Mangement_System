import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Classes from './Classes';
import Attendance from './Attendance';
import Acceptance from './Acceptance';
import Notifications from './Notifications';
import Profile from './Profile';
import Settings from './Settings';
import VideoCall from '../VideoCall';

const AdminDashboard = () => {
  const navLinks = [
    { path: '/admin', label: 'Classes' },
    { path: '/admin/attendance', label: 'Attendance' },
    { path: '/admin/acceptance', label: 'Acceptance' },
    { path: '/admin/notifications', label: 'Notifications' },
    { path: '/admin/profile', label: 'Profile' },
    { path: '/admin/settings', label: 'Settings' }
  ];

  return (
    <div>
      <Navbar links={navLinks} />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Classes />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/acceptance" element={<Acceptance />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/video-call/:classId" element={<VideoCall />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;