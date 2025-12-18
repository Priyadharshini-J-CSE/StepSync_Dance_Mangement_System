import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Home from './Home';
import ClassRegister from './ClassRegister';
import PaymentHistory from './PaymentHistory';
import Calendar from './Calendar';
import Notifications from './Notifications';
import Profile from './Profile';
import Settings from './Settings';
import Payment from './Payment';
import VideoCall from '../VideoCall';

const UserDashboard = () => {
  const navLinks = [
    { path: '/user', label: 'Home' },
    { path: '/user/class-register', label: 'Class Register' },
    { path: '/user/payment-history', label: 'Payment History' },
    { path: '/user/calendar', label: 'Calendar' },
    { path: '/user/notifications', label: 'Notifications' },
    { path: '/user/profile', label: 'Profile' },
    { path: '/user/settings', label: 'Settings' }
  ];

  return (
    <div style={{ backgroundImage: 'url(/background3.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh' }}>
      <Navbar links={navLinks} />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/class-register" element={<ClassRegister />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/payment/:classId" element={<Payment />} />
          <Route path="/video-call/:classId" element={<VideoCall />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;