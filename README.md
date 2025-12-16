# Zumba Class Management System

A comprehensive MERN stack application for managing Zumba classes, student registrations, payments, and attendance tracking.

## Features

### Dashboard
- Simple landing page with Login and Register buttons
- Role-based redirection (Admin/User)

### Authentication
- User registration with role selection (Admin/User)
- Password strength validation
- Terms and conditions acceptance
- Secure login system

### Admin Features
- **Classes Management**: Create, update, delete Zumba classes
- **Attendance Tracking**: Mark and manage student attendance
- **Acceptance System**: Approve/reject student class registrations
- **Notifications**: Receive notifications for new registrations
- **Profile & Settings**: Manage admin profile and system settings

### User Features
- **Class Registration**: View and register for available classes
- **Payment System**: Secure payment processing with receipt generation
- **Payment History**: View all payment transactions and download receipts
- **Calendar**: Track attendance and membership validity
- **Notifications**: Receive updates on registration status
- **Profile Management**: Track profile status (inactive → pending → active)

### Key Functionalities
- **Profile Status System**:
  - Inactive: New user, not registered for any class
  - Pending: Registered for class, waiting for admin approval
  - Active: Approved by admin, can attend classes

- **Auto-rejection**: Requests automatically rejected after 3 days with payment refund
- **Package Options**: 3-month and 1-year membership packages
- **Real-time Notifications**: System-wide notification system
- **Receipt Generation**: Automatic receipt creation for payments

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email notifications

### Frontend
- **React.js** with functional components
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Update .env file with your MongoDB URI and JWT secret
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zumba_management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

### Database Setup

The application will automatically create the necessary collections when you start using it. No manual database setup required.

## Usage

### Getting Started

1. **Access the Application**: Open http://localhost:3000
2. **Register**: Create an account (choose Admin or User role)
3. **Login**: Use your credentials to access the dashboard

### Admin Workflow

1. **Create Classes**: Add new Zumba classes with schedules and pricing
2. **Manage Requests**: Review and approve/reject user registrations
3. **Track Attendance**: Mark student attendance for each class
4. **Monitor System**: View notifications and manage settings

### User Workflow

1. **Browse Classes**: View available Zumba classes
2. **Register**: Select a package and complete payment
3. **Wait for Approval**: Admin will review within 3 days
4. **Attend Classes**: Once approved, attend scheduled classes
5. **Track Progress**: Monitor attendance in the calendar

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class (Admin)
- `PUT /api/classes/:id` - Update class (Admin)
- `DELETE /api/classes/:id` - Delete class (Admin)
- `POST /api/classes/:id/request` - Request to join class

### Attendance
- `POST /api/attendance` - Mark attendance (Admin)
- `GET /api/attendance/class/:classId` - Get class attendance
- `GET /api/attendance/user` - Get user attendance

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/accept-request/:id` - Accept request
- `POST /api/notifications/reject-request/:id` - Reject request

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/receipt/:id` - Get receipt

## Project Structure

```
zumba-management-system/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── controllers/     # Route controllers
│   ├── config/          # Configuration files
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main app component
│   └── public/          # Static files
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.