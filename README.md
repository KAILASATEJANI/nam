# 🎓 Smart Classroom & Timetable Scheduler

A comprehensive educational management system built with React.js and Node.js, featuring role-based dashboards, Material Design UI, and advanced scheduling capabilities.

## 📋 Table of Contents

- [Features Overview](#-features-overview)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Role-Based Dashboards](#-role-based-dashboards)
- [UI/UX Design](#-uiux-design)
- [Installation & Setup](#-installation--setup)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Key Components](#-key-components)
- [Theme System](#-theme-system)
- [Responsive Design](#-responsive-design)
- [Contributing](#-contributing)

## 🚀 Features Overview

### Core Features
- **Multi-Role Authentication System** (Student, Faculty, HOD, Admin)
- **Smart Timetable Management** with drag-and-drop scheduling
- **Real-time Attendance Tracking** with QR code integration
- **Fee Management System** with online payment integration
- **AI-Powered Chatbot** for student assistance
- **Material Design UI** with dark/light mode toggle
- **Responsive Design** for all device sizes
- **Real-time Notifications** system
- **File Management** for study materials
- **Analytics Dashboard** with comprehensive reports

### Advanced Features
- **QR Code Generation** for attendance and payments
- **Multi-language Support** (English, Hindi, Gujarati)
- **Parent Login System** (planned)
- **AI Fee Prediction** algorithms
- **Bank Reconciliation** reports
- **Scholarship Management** workflow
- **Room Booking System** for labs and classrooms

## 🛠 Technology Stack

### Frontend
- **React.js 18** - Main framework
- **React Router DOM** - Navigation
- **Context API** - State management
- **Lucide React** - Icons
- **Chart.js** - Data visualization
- **QRCode React** - QR code generation
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

### UI/UX
- **Material Design** - Design system
- **Custom Theme System** - Light/Dark modes
- **Responsive Design** - Mobile-first approach
- **Ripple Effects** - Interactive feedback
- **Floating Labels** - Form inputs

## 📁 Project Structure

```
STU DE/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Button.js          # Material Design buttons with ripple
│   │   │   ├── Card.js            # Elevated cards with shadows
│   │   │   ├── Input.js           # Floating label inputs
│   │   │   └── Sidebar.js         # Navigation sidebar
│   │   ├── StudentDashboard.js    # Student interface
│   │   ├── FacultyDashboard.js    # Faculty interface
│   │   ├── HODDashboard.js        # HOD interface
│   │   ├── AdminDashboard.js      # Admin interface
│   │   ├── StudentSidebar.js      # Student navigation
│   │   ├── FacultySidebar.js      # Faculty navigation
│   │   ├── HODSidebar.js          # HOD navigation
│   │   ├── AdminSidebar.js        # Admin navigation
│   │   ├── TopNavbar.js           # Top navigation bar
│   │   ├── Login.js               # Authentication
│   │   └── AIChatbot.js           # AI assistant
│   ├── context/
│   │   ├── AuthContext.js         # Authentication state
│   │   └── ThemeContext.js        # Theme management
│   ├── App.js                     # Main app component
│   └── index.js                   # Entry point
├── server/
│   ├── models/                    # Database models
│   ├── routes/                    # API routes
│   ├── middleware/                # Custom middleware
│   └── server.js                  # Server entry point
├── package.json
└── README.md
```

## 👥 Role-Based Dashboards

### 🎓 Student Dashboard
**Location**: `src/components/StudentDashboard.js`
**Features**:
- **Timetable View** - Weekly class schedule with color coding
- **Attendance Tracking** - Real-time attendance status
- **Study Materials** - Download course materials
- **Fee Management** - View fees, make payments, download receipts
- **Notifications** - Class updates and announcements
- **AI Chatbot** - Get instant help and answers
- **Progress Analytics** - Academic performance insights
- **Room Booking** - Reserve study spaces

### 👨‍🏫 Faculty Dashboard
**Location**: `src/components/FacultyDashboard.js`
**Features**:
- **Class Management** - View assigned classes and schedules
- **Attendance Management** - Mark and track student attendance
- **Student Overview** - Class roster with performance metrics
- **Fee Overview** - Summary of student fee status
- **Material Upload** - Share study materials with students
- **Analytics** - Teaching performance insights
- **Notifications** - Schedule changes and updates

### 🏫 HOD Dashboard
**Location**: `src/components/HODDashboard.js`
**Features**:
- **Department Overview** - Complete department statistics
- **Faculty Management** - Monitor faculty performance
- **Student Analytics** - Department-wide student insights
- **Fee Reports** - Department fee collection reports
- **Scholarship Approval** - Review and approve scholarship applications
- **Resource Management** - Manage classrooms and labs
- **Performance Metrics** - Department KPIs and reports

### ⚙️ Admin Dashboard
**Location**: `src/components/AdminDashboard.js`
**Features**:
- **System Overview** - Complete system statistics
- **User Management** - Manage all users and roles
- **Fee Management** - Create fee structures, view transactions
- **Analytics Dashboard** - Comprehensive system analytics
- **Auto-Invoice Generation** - Automated billing system
- **Defaulter Alerts** - Track and manage fee defaulters
- **Bank Reconciliation** - Financial reconciliation reports
- **System Settings** - Configure system parameters

## 🎨 UI/UX Design

### Material Design Implementation
**Theme System**: `src/context/ThemeContext.js`
- **Primary Color**: `#6200EE` (Vibrant Purple)
- **Secondary Color**: `#BB86FC` (Light Purple)
- **Accent Color**: `#03DAC6` (Teal)
- **Background**: `#F5F5F5` (Neutral Gray)
- **Typography**: Roboto font family

### Design Components
**Location**: `src/components/ui/`
- **Button.js** - Material Design buttons with ripple effects
- **Card.js** - Elevated cards with proper shadows
- **Input.js** - Floating label inputs with focus states
- **Sidebar.js** - Navigation sidebar with active states

### Responsive Features
- **Mobile-First Design** - Optimized for all screen sizes
- **Collapsible Sidebar** - Space-efficient navigation
- **Touch-Friendly** - Proper touch targets for mobile
- **Adaptive Layouts** - Content adjusts to screen size

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
cd "STU DE"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Start the backend server** (in a new terminal)
```bash
cd server
npm install
npm start
```

5. **Access the application**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token

### Student APIs
- `GET /api/student/dashboard` - Student dashboard data
- `GET /api/student/timetable` - Student timetable
- `GET /api/student/attendance` - Attendance records
- `GET /api/student/fees` - Fee information
- `POST /api/student/payment` - Make payment

### Faculty APIs
- `GET /api/faculty/dashboard` - Faculty dashboard data
- `GET /api/faculty/classes` - Assigned classes
- `POST /api/faculty/attendance` - Mark attendance
- `GET /api/faculty/students` - Class students

### Admin APIs
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - All users
- `POST /api/admin/fees` - Create fee structure
- `GET /api/admin/analytics` - System analytics

## 🗄️ Database Schema

### Collections/Tables

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  role: String, // 'student', 'faculty', 'hod', 'admin'
  password: String,
  profile: {
    avatar: String,
    phone: String,
    department: String
  }
}
```

#### Timetable Collection
```javascript
{
  _id: ObjectId,
  subject: String,
  teacher: String,
  room: String,
  day: String,
  startTime: String,
  endTime: String,
  class: String
}
```

#### Fee Structure Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  semester: String,
  fees: [{
    feeType: String,
    amount: Number,
    dueDate: Date
  }],
  totalAmount: Number,
  paidAmount: Number,
  status: String
}
```

#### Attendance Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  subject: String,
  date: Date,
  status: String, // 'present', 'absent', 'late'
  markedBy: ObjectId
}
```

## 🧩 Key Components

### Authentication System
**Location**: `src/context/AuthContext.js`
- JWT-based authentication
- Role-based access control
- Persistent login state
- Secure logout functionality

### Theme Management
**Location**: `src/context/ThemeContext.js`
- Light/Dark mode toggle
- Material Design color system
- Typography management
- Responsive spacing system

### Real-time Features
**Location**: `src/components/AIChatbot.js`
- WebSocket integration
- Real-time notifications
- Live updates
- Instant messaging

## 🎨 Theme System

### Color Palette
```javascript
// Light Mode
primary: '#6200EE',        // Vibrant Purple
secondary: '#BB86FC',      // Light Purple
accent: '#03DAC6',         // Teal
background: '#F5F5F5',     // Neutral Gray
text: '#212121',           // Dark Gray

// Dark Mode
primary: '#BB86FC',        // Light Purple
secondary: '#03DAC6',      // Teal
accent: '#FF6B6B',         // Coral
background: '#121212',     // Dark Background
text: '#FFFFFF'            // White Text
```

### Typography Scale
```javascript
fontSizes: {
  caption: '12px',
  body2: '14px',
  body1: '16px',
  h6: '20px',
  h5: '24px',
  h4: '34px',
  h3: '48px',
  h2: '60px',
  h1: '96px'
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Collapsible sidebar navigation
- Touch-optimized buttons and inputs
- Swipe gestures for navigation
- Mobile-friendly forms
- Responsive data tables

## 🔧 Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Code Structure
- **Components**: Reusable UI components
- **Context**: Global state management
- **Utils**: Helper functions and utilities
- **Styles**: CSS and styling files
- **Assets**: Images, icons, and static files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@smartclassroom.com or join our Slack channel.

---

**Built with ❤️ using React.js and Material Design**