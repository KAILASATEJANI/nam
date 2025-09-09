const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*', methods: ['GET','POST','PUT','DELETE'] }
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const MONGO_URL = process.env.MONGO_URL || '';

// Simple storage for uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ----- Mongoose Models (kept inline for brevity) -----
const models = {};

const connectMongo = async () => {
  if (!MONGO_URL) return false;
  try {
    await mongoose.connect(MONGO_URL, { dbName: 'smart_classroom' });
    const studentSchema = new mongoose.Schema({
      studentId: { type: String, unique: true },
      name: String,
      email: String,
      department: String,
      semester: String
    });

    const timetableSchema = new mongoose.Schema({
      studentId: String,
      week: Object // { monday: [...], tuesday: [...], ... }
    });

    const attendanceSchema = new mongoose.Schema({
      studentId: String,
      total: Number,
      present: Number,
      subjects: [
        { name: String, present: Number, total: Number, percentage: Number }
      ]
    });

    const assignmentSchema = new mongoose.Schema({
      studentId: String,
      title: String,
      dueDate: Date,
      status: { type: String, default: 'pending' },
      submittedAt: Date,
      fileName: String
    });

    const notificationSchema = new mongoose.Schema({
      studentId: String,
      message: String,
      createdAt: { type: Date, default: Date.now },
      unread: { type: Boolean, default: true }
    });

    const bookingSchema = new mongoose.Schema({
      studentId: String,
      resourceType: String,
      room: String,
      date: Date,
      timeSlot: String,
      status: { type: String, default: 'pending' }
    });

    const logSchema = new mongoose.Schema({
      studentId: String,
      action: String,
      createdAt: { type: Date, default: Date.now }
    });

    // Fee Management Schemas
    const feeStructureSchema = new mongoose.Schema({
      program: String,
      semester: String,
      feeType: String,
      amount: Number,
      academicYear: String
    });

    const transactionSchema = new mongoose.Schema({
      studentId: String,
      amountPaid: Number,
      date: { type: Date, default: Date.now },
      mode: String,
      receiptUrl: String,
      status: { type: String, default: 'completed' },
      feeType: String,
      transactionId: String
    });

    const scholarshipSchema = new mongoose.Schema({
      studentId: String,
      discountType: String,
      amount: Number,
      approvedBy: String,
      status: { type: String, default: 'pending' },
      createdAt: { type: Date, default: Date.now }
    });

    const dueReminderSchema = new mongoose.Schema({
      studentId: String,
      dueDate: Date,
      reminderSent: { type: Boolean, default: false },
      amount: Number,
      feeType: String
    });

    models.Student = mongoose.model('Student', studentSchema);
    models.Timetable = mongoose.model('Timetable', timetableSchema);
    models.Attendance = mongoose.model('Attendance', attendanceSchema);
    models.Assignment = mongoose.model('Assignment', assignmentSchema);
    models.Notification = mongoose.model('Notification', notificationSchema);
    models.Booking = mongoose.model('Booking', bookingSchema);
    models.Log = mongoose.model('Log', logSchema);
    models.FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);
    models.Transaction = mongoose.model('Transaction', transactionSchema);
    models.Scholarship = mongoose.model('Scholarship', scholarshipSchema);
    models.DueReminder = mongoose.model('DueReminder', dueReminderSchema);

    return true;
  } catch (err) {
    console.error('Mongo connection failed:', err.message);
    return false;
  }
};

let useMemoryStore = true;
const memoryStore = {
  students: [],
  timetables: {},
  attendance: {},
  assignments: [],
  notifications: [],
  bookings: [],
  logs: [],
  materials: [],
  exams: [],
  feedbacks: [],
  faculty: [],
  facultySchedules: {},
  facultyLeaves: {},
  facultyWorkload: {},
  // Fee Management Data
  feeStructures: [],
  transactions: [],
  scholarships: [],
  dueReminders: []
};

const ensureSeed = (studentId) => {
  if (memoryStore.students.find(s => s.studentId === studentId)) return;
  const name = 'Student ' + studentId;
  memoryStore.students.push({
    studentId,
    name,
    email: `${studentId.toLowerCase()}@example.com`,
    department: 'Computer Science',
    semester: '5'
  });
  memoryStore.timetables[studentId] = {
    monday: [
      { time: '09:00-10:00', subject: 'Data Structures', faculty: 'Dr. Jane Smith', room: 'CS-101', type: 'Lecture' },
      { time: '10:00-11:00', subject: 'Algorithms', faculty: 'Prof. Mike Johnson', room: 'CS-102', type: 'Lecture' }
    ],
    tuesday: [
      { time: '11:00-12:00', subject: 'Software Engineering', faculty: 'Dr. Lisa Anderson', room: 'CS-106', type: 'Lecture' }
    ],
    wednesday: [],
    thursday: [],
    friday: []
  };
  const subjects = [
    { name: 'Data Structures', present: 20, total: 22 },
    { name: 'Algorithms', present: 18, total: 20 },
    { name: 'Database Systems', present: 19, total: 20 }
  ].map(s => ({ ...s, percentage: Math.round((s.present / s.total) * 1000) / 10 }));
  const total = subjects.reduce((a, s) => a + s.total, 0);
  const present = subjects.reduce((a, s) => a + s.present, 0);
  memoryStore.attendance[studentId] = { total, present, percentage: Math.round((present / total) * 1000) / 10, subjects };
  memoryStore.assignments.push(
    { studentId, title: 'DS Lab Report', dueDate: new Date(Date.now() + 3*24*3600*1000), status: 'pending' },
    { studentId, title: 'Algorithms Homework 4', dueDate: new Date(Date.now() + 6*24*3600*1000), status: 'pending' }
  );
  memoryStore.notifications.push(
    { studentId, message: 'Classroom 204 shifted to 206 at 10 AM', createdAt: new Date(), unread: true },
    { studentId, message: 'Midterm schedule released', createdAt: new Date(Date.now() - 86400000), unread: false }
  );
  memoryStore.logs.push(
    { studentId, action: 'Faculty updated DS Lab timing', createdAt: new Date() },
    { studentId, action: 'New assignment posted: Algorithms HW4', createdAt: new Date() }
  );
  memoryStore.materials.push(
    { studentId, title: 'Data Structures Notes', type: 'PDF', url: '#' },
    { studentId, title: 'Algorithms Cheat Sheet', type: 'PDF', url: '#' }
  );
  memoryStore.exams.push(
    { studentId, subject: 'Data Structures', date: new Date(Date.now() + 5*24*3600*1000) },
    { studentId, subject: 'Algorithms', date: new Date(Date.now() + 9*24*3600*1000) }
  );
  
  // Fee Management Data
  memoryStore.feeStructures.push(
    { program: 'B.Tech', semester: '5', feeType: 'Tuition', amount: 50000, academicYear: '2024-25' },
    { program: 'B.Tech', semester: '5', feeType: 'Library', amount: 2000, academicYear: '2024-25' },
    { program: 'B.Tech', semester: '5', feeType: 'Lab', amount: 5000, academicYear: '2024-25' },
    { program: 'B.Tech', semester: '5', feeType: 'Exam', amount: 3000, academicYear: '2024-25' }
  );
  
  memoryStore.transactions.push(
    { studentId, amountPaid: 50000, date: new Date(Date.now() - 30*24*3600*1000), mode: 'UPI', receiptUrl: '#', status: 'completed', feeType: 'Tuition', transactionId: 'TXN001' },
    { studentId, amountPaid: 2000, date: new Date(Date.now() - 15*24*3600*1000), mode: 'Card', receiptUrl: '#', status: 'completed', feeType: 'Library', transactionId: 'TXN002' }
  );
  
  memoryStore.scholarships.push(
    { studentId, discountType: 'Merit', amount: 10000, approvedBy: 'HOD', status: 'approved', createdAt: new Date(Date.now() - 20*24*3600*1000) }
  );
  
  memoryStore.dueReminders.push(
    { studentId, dueDate: new Date(Date.now() + 7*24*3600*1000), reminderSent: false, amount: 5000, feeType: 'Lab' },
    { studentId, dueDate: new Date(Date.now() + 15*24*3600*1000), reminderSent: false, amount: 3000, feeType: 'Exam' }
  );
};

const ensureFacultySeed = (facultyId) => {
  if (memoryStore.faculty.find(f => f.facultyId === facultyId)) return;
  memoryStore.faculty.push({ facultyId, name: 'Prof. Smith', email: 'smith@example.com', department: 'Computer Science' });
  memoryStore.facultySchedules[facultyId] = [
    { id: 1, subject: 'Data Structures', time: '09:00-10:00', room: 'CS-201', students: 48, type: 'Lecture', status: 'upcoming', date: new Date().toISOString().slice(0,10) },
    { id: 2, subject: 'Algorithms Lab', time: '11:00-12:00', room: 'Lab-3', students: 28, type: 'Lab', status: 'upcoming', date: new Date().toISOString().slice(0,10) },
    { id: 3, subject: 'Database Systems', time: '14:00-15:00', room: 'CS-103', students: 40, type: 'Lecture', status: 'completed', date: new Date(Date.now()-86400000).toISOString().slice(0,10) }
  ];
  memoryStore.facultyLeaves[facultyId] = [
    { id: 1, date: new Date(Date.now()+5*86400000).toISOString().slice(0,10), reason: 'Conference', status: 'pending', type: 'professional' }
  ];
  memoryStore.facultyWorkload[facultyId] = {
    weeklyHours: 16,
    monthlyHours: 64,
    subjects: 4,
    students: 160,
    distribution: [
      { subject: 'Data Structures', hours: 6, color: '#3b82f6' },
      { subject: 'Algorithms', hours: 4, color: '#10b981' },
      { subject: 'Database Systems', hours: 4, color: '#f59e0b' },
      { subject: 'Software Engineering', hours: 2, color: '#ef4444' }
    ]
  };
};

(async () => {
  const connected = await connectMongo();
  useMemoryStore = !connected;
})();

// ----- Helpers -----
const getStudentId = (req) => req.params.studentId;

// ----- Routes -----
app.get('/api/health', (req, res) => {
  res.json({ ok: true, store: useMemoryStore ? 'memory' : 'mongo' });
});

app.get('/api/student/:studentId/timetable', async (req, res) => {
  const studentId = getStudentId(req);
  if (useMemoryStore) {
    ensureSeed(studentId);
    return res.json({ week: memoryStore.timetables[studentId] || {} });
  }
  const doc = await models.Timetable.findOne({ studentId });
  res.json({ week: doc?.week || {} });
});

app.get('/api/student/:studentId/attendance', async (req, res) => {
  const studentId = getStudentId(req);
  if (useMemoryStore) {
    ensureSeed(studentId);
    return res.json(memoryStore.attendance[studentId] || { total: 0, present: 0, percentage: 0, subjects: [] });
  }
  const doc = await models.Attendance.findOne({ studentId });
  res.json(doc || { total: 0, present: 0, percentage: 0, subjects: [] });
});

app.get('/api/student/:studentId/assignments', async (req, res) => {
  const studentId = getStudentId(req);
  if (useMemoryStore) {
    ensureSeed(studentId);
    return res.json(memoryStore.assignments.filter(a => a.studentId === studentId));
  }
  const docs = await models.Assignment.find({ studentId }).sort({ dueDate: 1 });
  res.json(docs);
});

app.post('/api/student/:studentId/assignments/upload', upload.single('file'), async (req, res) => {
  const studentId = getStudentId(req);
  const { title } = req.body;
  if (useMemoryStore) {
    ensureSeed(studentId);
    memoryStore.assignments.push({ studentId, title: title || 'Submission', dueDate: new Date(), status: 'submitted', submittedAt: new Date(), fileName: req.file?.originalname });
    memoryStore.logs.push({ studentId, action: `Submitted assignment: ${title || req.file?.originalname || 'Assignment'}`, createdAt: new Date() });
    io.emit(`student:${studentId}:timeline`, { studentId, action: `Submitted assignment: ${title || 'Assignment'}`, createdAt: new Date() });
    return res.json({ ok: true });
  }
  await models.Assignment.create({ studentId, title: title || 'Submission', dueDate: new Date(), status: 'submitted', submittedAt: new Date(), fileName: req.file?.originalname });
  await models.Log.create({ studentId, action: `Submitted assignment: ${title || 'Assignment'}` });
  io.emit(`student:${studentId}:timeline`, { studentId, action: `Submitted assignment: ${title || 'Assignment'}` });
  res.json({ ok: true });
});

app.get('/api/student/:studentId/notifications', async (req, res) => {
  const studentId = getStudentId(req);
  if (useMemoryStore) {
    ensureSeed(studentId);
    return res.json(memoryStore.notifications.filter(n => n.studentId === studentId));
  }
  const docs = await models.Notification.find({ studentId }).sort({ createdAt: -1 });
  res.json(docs);
});

app.post('/api/student/:studentId/bookings', async (req, res) => {
  const studentId = getStudentId(req);
  const { resourceType, room, date, timeSlot } = req.body;
  if (useMemoryStore) {
    ensureSeed(studentId);
    const booking = { studentId, resourceType, room, date, timeSlot, status: 'pending' };
    memoryStore.bookings.push(booking);
    memoryStore.logs.push({ studentId, action: `Requested booking for ${resourceType} ${room} on ${date} ${timeSlot}`, createdAt: new Date() });
    io.emit(`student:${studentId}:timeline`, { studentId, action: `Requested booking for ${resourceType} ${room}`, createdAt: new Date() });
    return res.json({ ok: true, booking });
  }
  const booking = await models.Booking.create({ studentId, resourceType, room, date, timeSlot, status: 'pending' });
  await models.Log.create({ studentId, action: `Requested booking for ${resourceType} ${room} on ${date} ${timeSlot}` });
  io.emit(`student:${studentId}:timeline`, { studentId, action: `Requested booking for ${resourceType} ${room}` });
  res.json({ ok: true, booking });
});

app.get('/api/student/:studentId/id', async (req, res) => {
  const studentId = getStudentId(req);
  if (useMemoryStore) ensureSeed(studentId);
  const student = useMemoryStore ? memoryStore.students.find(s => s.studentId === studentId) : await models.Student.findOne({ studentId });
  const payload = student || { studentId, name: 'Student', department: 'Computer Science' };
  res.json({ ...payload, qrData: `ATTEND:${studentId}` });
});

app.get('/api/student/:studentId/analytics', async (req, res) => {
  const studentId = getStudentId(req);
  if (useMemoryStore) ensureSeed(studentId);
  const att = useMemoryStore ? memoryStore.attendance[studentId] : await models.Attendance.findOne({ studentId });
  const attendancePercent = att?.percentage || 0;
  res.json({
    attendancePercent,
    distribution: att?.subjects?.map(s => ({ label: s.name, value: s.percentage })) || [],
    performance: [
      { label: 'Week 1', marks: 72 },
      { label: 'Week 2', marks: 76 },
      { label: 'Week 3', marks: 81 },
      { label: 'Week 4', marks: 85 }
    ],
    progressMessage: attendancePercent >= 85 ? "You're on track for 85%+ attendance." : 'Attendance needs attention.'
  });
});

app.get('/api/student/:studentId/timeline', async (req, res) => {
  const studentId = getStudentId(req);
  if (useMemoryStore) {
    ensureSeed(studentId);
    return res.json(memoryStore.logs.filter(l => l.studentId === studentId).map(l => ({ ...l, createdAt: l.createdAt || new Date() })));
  }
  const docs = await models.Log.find({ studentId }).sort({ createdAt: -1 });
  res.json(docs);
});

// Study materials
app.get('/api/student/:studentId/materials', async (req, res) => {
  const studentId = getStudentId(req);
  if (useMemoryStore) {
    ensureSeed(studentId);
    return res.json(memoryStore.materials.filter(m => m.studentId === studentId));
  }
  res.json([]);
});

// Upcoming exams
app.get('/api/student/:studentId/exams', async (req, res) => {
  const studentId = getStudentId(req);
  if (useMemoryStore) {
    ensureSeed(studentId);
    return res.json(memoryStore.exams.filter(e => e.studentId === studentId));
  }
  res.json([]);
});

// Feedback submit
app.post('/api/student/:studentId/feedback', async (req, res) => {
  const studentId = getStudentId(req);
  const { rating, comment } = req.body || {};
  if (useMemoryStore) {
    ensureSeed(studentId);
    memoryStore.feedbacks.push({ studentId, rating, comment, createdAt: new Date() });
    return res.json({ ok: true });
  }
  res.json({ ok: true });
});

// -------- Faculty routes (memory-backed) --------
app.get('/api/faculty/:facultyId/schedule', (req, res) => {
  const { facultyId } = req.params;
  ensureFacultySeed(facultyId);
  res.json(memoryStore.facultySchedules[facultyId] || []);
});

app.get('/api/faculty/:facultyId/workload', (req, res) => {
  const { facultyId } = req.params;
  ensureFacultySeed(facultyId);
  res.json(memoryStore.facultyWorkload[facultyId] || { weeklyHours: 0, monthlyHours: 0, subjects: 0, students: 0, distribution: [] });
});

app.get('/api/faculty/:facultyId/leaves', (req, res) => {
  const { facultyId } = req.params;
  ensureFacultySeed(facultyId);
  res.json(memoryStore.facultyLeaves[facultyId] || []);
});

app.post('/api/faculty/:facultyId/leaves', (req, res) => {
  const { facultyId } = req.params;
  const { date, reason, type } = req.body || {};
  ensureFacultySeed(facultyId);
  const newLeave = { id: Date.now(), date, reason, status: 'pending', type: type || 'personal' };
  if (!memoryStore.facultyLeaves[facultyId]) memoryStore.facultyLeaves[facultyId] = [];
  memoryStore.facultyLeaves[facultyId].push(newLeave);
  res.json({ ok: true, leave: newLeave });
});

// ----- Fee Management Routes -----

// Student Fee Routes
app.get('/api/student/:studentId/fees', async (req, res) => {
  const studentId = getStudentId(req);
  if (useMemoryStore) {
    ensureSeed(studentId);
    const student = memoryStore.students.find(s => s.studentId === studentId);
    const program = student?.department === 'Computer Science' ? 'B.Tech' : 'B.Tech';
    const semester = student?.semester || '5';
    
    const feeStructure = memoryStore.feeStructures.filter(f => f.program === program && f.semester === semester);
    const transactions = memoryStore.transactions.filter(t => t.studentId === studentId);
    const scholarships = memoryStore.scholarships.filter(s => s.studentId === studentId);
    const dueReminders = memoryStore.dueReminders.filter(d => d.studentId === studentId);
    
    const totalFee = feeStructure.reduce((sum, f) => sum + f.amount, 0);
    const totalPaid = transactions.reduce((sum, t) => sum + t.amountPaid, 0);
    const totalScholarship = scholarships.filter(s => s.status === 'approved').reduce((sum, s) => sum + s.amount, 0);
    const pendingAmount = totalFee - totalPaid - totalScholarship;
    
    return res.json({
      feeStructure,
      transactions,
      scholarships,
      dueReminders,
      summary: {
        totalFee,
        totalPaid,
        totalScholarship,
        pendingAmount,
        paidPercentage: Math.round((totalPaid / totalFee) * 100)
      }
    });
  }
  res.json({ feeStructure: [], transactions: [], scholarships: [], dueReminders: [], summary: { totalFee: 0, totalPaid: 0, totalScholarship: 0, pendingAmount: 0, paidPercentage: 0 } });
});

app.post('/api/student/:studentId/fees/payment', async (req, res) => {
  const studentId = getStudentId(req);
  const { amount, mode, feeType } = req.body;
  if (useMemoryStore) {
    ensureSeed(studentId);
    const transaction = {
      studentId,
      amountPaid: amount,
      date: new Date(),
      mode,
      receiptUrl: '#',
      status: 'completed',
      feeType,
      transactionId: 'TXN' + Date.now()
    };
    memoryStore.transactions.push(transaction);
    memoryStore.logs.push({ studentId, action: `Payment of ₹${amount} via ${mode} for ${feeType}`, createdAt: new Date() });
    io.emit(`student:${studentId}:timeline`, { studentId, action: `Payment of ₹${amount} via ${mode}`, createdAt: new Date() });
    return res.json({ ok: true, transaction });
  }
  res.json({ ok: true });
});

// Faculty Fee Overview
app.get('/api/faculty/:facultyId/fee-overview', (req, res) => {
  const { facultyId } = req.params;
  ensureFacultySeed(facultyId);
  
  // Mock data for faculty fee overview
  const feeOverview = {
    totalStudents: 160,
    studentsWithPendingFees: 25,
    pendingAmount: 125000,
    collectionRate: 84.4,
    recentPayments: [
      { studentId: 'STU001', amount: 50000, date: new Date(), feeType: 'Tuition' },
      { studentId: 'STU002', amount: 2000, date: new Date(), feeType: 'Library' }
    ]
  };
  res.json(feeOverview);
});

// HOD Fee Reports
app.get('/api/hod/fee-reports', (req, res) => {
  const reports = {
    departmentCollection: {
      currentMonth: 2500000,
      lastMonth: 2300000,
      growth: 8.7
    },
    defaultersList: [
      { studentId: 'STU001', name: 'Student 1', pendingAmount: 15000, daysOverdue: 15 },
      { studentId: 'STU002', name: 'Student 2', pendingAmount: 8000, daysOverdue: 8 }
    ],
    scholarshipRequests: memoryStore.scholarships.filter(s => s.status === 'pending')
  };
  res.json(reports);
});

app.post('/api/hod/scholarships/:scholarshipId/approve', (req, res) => {
  const { scholarshipId } = req.params;
  const { action } = req.body; // 'approve' or 'reject'
  
  if (useMemoryStore) {
    const scholarship = memoryStore.scholarships.find(s => s.studentId === scholarshipId);
    if (scholarship) {
      scholarship.status = action;
      scholarship.approvedBy = 'HOD';
    }
  }
  res.json({ ok: true });
});

// Admin Fee Management
app.get('/api/admin/fee-management', (req, res) => {
  const management = {
    feeStructures: memoryStore.feeStructures,
    allTransactions: memoryStore.transactions,
    analytics: {
      dailyCollection: [
        { date: '2024-01-01', amount: 50000 },
        { date: '2024-01-02', amount: 75000 },
        { date: '2024-01-03', amount: 60000 }
      ],
      pendingFeesDistribution: [
        { feeType: 'Tuition', count: 15, amount: 750000 },
        { feeType: 'Lab', count: 8, amount: 40000 },
        { feeType: 'Exam', count: 12, amount: 36000 }
      ],
      refundsIssued: 25000,
      bankReconciliation: {
        totalCollected: 2500000,
        bankDeposits: 2480000,
        pendingDeposits: 20000
      }
    }
  };
  res.json(management);
});

app.post('/api/admin/fee-structure', (req, res) => {
  const { program, semester, feeType, amount, academicYear } = req.body;
  if (useMemoryStore) {
    const newFeeStructure = { program, semester, feeType, amount, academicYear };
    memoryStore.feeStructures.push(newFeeStructure);
    return res.json({ ok: true, feeStructure: newFeeStructure });
  }
  res.json({ ok: true });
});

// ----- Socket.IO for realtime timeline -----
io.on('connection', (socket) => {
  socket.on('join-student', (studentId) => {
    socket.join(`student-${studentId}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


