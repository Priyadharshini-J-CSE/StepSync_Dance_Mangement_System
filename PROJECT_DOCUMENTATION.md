# 🕺 Dance Management System - Complete Documentation

## 📋 Project Overview

A comprehensive MERN stack web application for managing dance classes, student registrations, payments, attendance tracking, and video call functionality. The system supports both online and offline classes with role-based access control.

### 🎯 Key Features
- **User Management**: Registration, authentication, profile management
- **Class Management**: Create, update, delete dance classes
- **Payment System**: Secure payment processing with receipt generation
- **Attendance Tracking**: Mark and monitor student attendance
- **Video Calls**: Integrated video calling for online classes
- **Notification System**: Real-time notifications for all activities
- **Mobile Responsive**: Fully responsive design for all devices

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: React.js, Context API, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS3 with responsive design
- **Icons**: Font Awesome

### Project Structure
```
Dance_Management_System_individual/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── dbContext.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Class.js
│   │   ├── ClassRequest.js
│   │   ├── Payment.js
│   │   ├── Attendance.js
│   │   ├── Notification.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── classes.js
│   │   ├── payments.js
│   │   ├── attendance.js
│   │   ├── notifications.js
│   │   ├── feedback.js
│   │   └── meetingLinks.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── [background images]
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── user/
│   │   ├── utils/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: ['admin', 'user'] (default: 'user'),
  status: ['inactive', 'pending', 'active'] (default: 'inactive'),
  phone: String (unique),
  address: String,
  membershipExpiry: Date,
  createdAt: Date
}
```

### Class Schema
```javascript
{
  name: String (required),
  description: String,
  instructor: String,
  schedule: {
    days: [String],
    time: String (restricted to morning/evening),
    duration: Number
  },
  capacity: Number (max: 50),
  enrolled: [ObjectId] (ref: User),
  packages: [{
    type: ['3month', '1year'],
    price: Number
  }],
  mode: ['online', 'offline'],
  meetingLink: String (auto-generated for online),
  isActive: Boolean,
  createdBy: ObjectId (ref: User)
}
```

### Payment Schema
```javascript
{
  user: ObjectId (ref: User),
  class: ObjectId (ref: Class),
  amount: Number,
  package: ['3month', '1year'],
  status: ['pending', 'completed', 'refunded'],
  receiptNumber: String (auto-generated),
  transactionId: String,
  validFrom: Date,
  validUntil: Date
}
```

## 🔗 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | User registration | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Protected |
| PUT | `/profile` | Update profile | Protected |
| PUT | `/change-password` | Change password | Protected |
| DELETE | `/delete-account` | Delete account | Protected |

### Classes (`/api/classes`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all classes | Protected |
| POST | `/` | Create class | Admin |
| PUT | `/:id` | Update class | Admin |
| DELETE | `/:id` | Delete class | Admin |
| POST | `/:id/request` | Request to join | User |
| GET | `/requests` | Get requests | Admin |
| GET | `/my-requests` | Get user requests | User |

### Payments (`/api/payments`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/` | Process payment | Protected |
| GET | `/history` | Payment history | Protected |
| GET | `/receipt/:id` | Get receipt | Protected |

### Attendance (`/api/attendance`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/` | Mark attendance | Admin |
| GET | `/class/:classId` | Class attendance | Admin |
| GET | `/user` | User attendance | User |
| GET | `/user/stats` | User statistics | User |

## 👥 User Roles & Permissions

### Admin Role
- **Class Management**: Create, update, delete classes
- **Attendance**: Mark student attendance
- **Requests**: Accept/reject class registrations
- **Video Calls**: Host online classes
- **Notifications**: Send meeting links to students
- **Analytics**: View class statistics

### User Role
- **Registration**: Register for classes
- **Payments**: Make payments for packages
- **Attendance**: View personal attendance
- **Video Calls**: Join online classes
- **Profile**: Manage personal profile
- **Feedback**: Submit class feedback

## 🎨 User Interface

### Key Pages

#### Landing Page
- Hero section with call-to-action
- Features showcase
- Testimonials
- Contact information
- Login/Register buttons

#### Admin Dashboard
- Class statistics overview
- Quick actions (Create Class, View Requests)
- Recent notifications
- System status

#### User Dashboard
- Enrolled classes
- Attendance statistics
- Payment history
- Upcoming classes

#### Class Management (Admin)
- Create/Edit class form
- Time restrictions (Morning: 6-11 AM, Evening: 5-9 PM)
- Capacity limits (Max: 50 students)
- Online/Offline mode selection
- Meeting link generation

#### Video Call System
- Integrated video calling
- Participant list
- Chat functionality
- Automatic attendance marking (5+ minutes)
- Role-based navigation

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes middleware
- Role-based access control

### Data Validation
- Input validation on both frontend and backend
- Email format validation
- Password strength requirements
- Unique constraints on email and phone

### Security Measures
- CORS configuration
- Environment variables for sensitive data
- SQL injection prevention
- XSS protection

## 📱 Mobile Responsiveness

### CSS Media Queries
```css
@media (max-width: 768px) {
  /* Tablet and mobile styles */
  - Grid layouts → Single column
  - Reduced padding and font sizes
  - Full-width modals
  - Stacked navigation
}

@media (max-width: 480px) {
  /* Small mobile styles */
  - Further reduced spacing
  - Smaller buttons and inputs
  - Optimized touch targets
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
# Configure .env file
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dance_management
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🔄 System Workflow

### User Registration Flow
1. User selects role (Admin/User)
2. Fills registration form with validation
3. Accepts Terms & Conditions (scroll required)
4. Account created with appropriate status
5. JWT token generated for authentication

### Class Registration Flow
1. User browses available classes
2. Selects package (3-month/1-year)
3. Proceeds to payment
4. Payment processed with receipt generation
5. Request sent to admin for approval
6. Admin accepts/rejects within 3 days
7. Auto-rejection after 3 days with refund

### Video Call Flow
1. Admin creates online class
2. Meeting link auto-generated
3. Admin sends link to enrolled students
4. Students join via internal video call page
5. Attendance marked automatically (5+ min participation)
6. Role-based navigation on call end

## 📊 Features Implementation

### Time Restrictions
- Morning slots: 6:00 AM - 11:00 AM
- Evening slots: 5:00 PM - 9:00 PM
- Dropdown selection prevents invalid times

### Capacity Management
- Maximum 50 students per class
- Real-time enrollment tracking
- Automatic "Full" status when capacity reached

### Payment System
- Secure payment processing
- Receipt generation with unique numbers
- Payment history tracking
- Refund handling for rejections

### Notification System
- Real-time notifications for all activities
- Type-based notification categorization
- Read/unread status tracking
- Meeting link distribution

## 🎯 Business Logic

### User Status Management
- **Inactive**: New user, no class registrations
- **Pending**: Registered for class, awaiting approval
- **Active**: Approved by admin, can attend classes

### Auto-Rejection System
- Requests auto-rejected after 3 days
- Automatic refund processing
- Notification sent to user

### Attendance Tracking
- Manual marking by admin for offline classes
- Automatic marking for online classes (5+ min participation)
- Statistics calculation and reporting

## 🔧 Technical Specifications

### Performance Optimizations
- Efficient database queries with population
- Pagination for large datasets
- Image optimization for backgrounds
- CSS minification and compression

### Error Handling
- Try-catch blocks for all async operations
- User-friendly error messages
- Validation error reporting
- Graceful fallbacks

### Code Quality
- Consistent naming conventions
- Modular component structure
- Reusable utility functions
- Clean separation of concerns

## 📈 Future Enhancements

### Potential Features
- Real-time chat system
- Advanced analytics dashboard
- Email notification system
- Multi-language support
- Progressive Web App (PWA)
- Payment gateway integration
- Calendar synchronization
- Instructor rating system

### Scalability Considerations
- Database indexing optimization
- Caching implementation
- Load balancing
- CDN integration
- Microservices architecture

## 🐛 Known Issues & Solutions

### Common Issues
1. **CSS Compilation Errors**: Use inline styles for background images
2. **Mobile Responsiveness**: Implemented comprehensive media queries
3. **Video Call Compatibility**: Modern browser requirements
4. **Database Connection**: Proper error handling and reconnection

### Troubleshooting
- Check environment variables
- Verify MongoDB connection
- Ensure proper CORS configuration
- Validate JWT token expiration

## 📝 Conclusion

This Dance Management System provides a complete solution for managing dance classes with modern web technologies. The system is designed to be scalable, secure, and user-friendly, supporting both online and offline class management with comprehensive features for administrators and students.

The project demonstrates proficiency in full-stack development, database design, user authentication, payment processing, and real-time communication systems.

---

**Project Status**: ✅ Complete and Functional
**Last Updated**: December 2024
**Version**: 1.0.0