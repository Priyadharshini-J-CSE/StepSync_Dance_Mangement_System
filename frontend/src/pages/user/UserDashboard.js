import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ClassRegister from './ClassRegister';
import PaymentHistory from './PaymentHistory';
import Calendar from './Calendar';
import Notifications from './Notifications';
import Profile from './Profile';
import Settings from './Settings';
import Payment from './Payment';

const UserDashboard = () => {
  const navLinks = [
    { path: '/user', label: 'Class Register' },
    { path: '/user/payment-history', label: 'Payment History' },
    { path: '/user/calendar', label: 'Calendar' },
    { path: '/user/notifications', label: 'Notifications' },
    { path: '/user/profile', label: 'Profile' },
    { path: '/user/settings', label: 'Settings' }
  ];

  return (
    <div>
      <Navbar links={navLinks} />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<ClassRegister />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/payment/:classId" element={<Payment />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;