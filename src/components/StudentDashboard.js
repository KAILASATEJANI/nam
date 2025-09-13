import React, { useState, useEffect, useMemo, useCallback, useRef, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import StudentSidebar from './StudentSidebar';
import TopNavbar from './TopNavbar';
import AIChatbot from './AIChatbot';
import Card from './ui/Card';
import Button from './ui/Button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  Bell, 
  Download, 
  Brain,
  BarChart3,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;
  const { typography, spacing, borderRadius } = useTheme();

  const [activeTab, setActiveTab] = useState('timetable');
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [attendance, setAttendance] = useState({ total: 0, present: 0, percentage: 0, subjects: [] });
  const [studyGaps, setStudyGaps] = useState([]);
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
  const [timetableData, setTimetableData] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [nextExam, setNextExam] = useState(null);
  const [bookingForm, setBookingForm] = useState({ resourceType: 'Lab', room: '', date: '', timeSlot: '' });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [idCard, setIdCard] = useState({ studentId: '', name: '', department: '', qrData: '' });
  const [analytics, setAnalytics] = useState({ attendancePercent: 0, distribution: [], performance: [], progressMessage: '' });
  const [timeline, setTimeline] = useState([]);
  const [resources, setResources] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [fees, setFees] = useState({ feeStructure: [], transactions: [], scholarships: [], dueReminders: [], summary: { totalFee: 0, totalPaid: 0, totalScholarship: 0, pendingAmount: 0, paidPercentage: 0 } });
  const [paymentForm, setPaymentForm] = useState({ amount: '', mode: 'UPI', feeType: 'Tuition' });
  

  const API_BASE = 'http://localhost:5001/api';
  const studentId = user?.studentId || 'CS1234';

  

  // Optimized tab switching with debouncing to prevent blinking
  const setTabSmooth = useCallback((tab) => {
    if (tab === activeTab || isTabSwitching) return; // Prevent unnecessary updates
    
    setIsTabSwitching(true);
    
    // Use requestAnimationFrame to ensure smooth transitions
    requestAnimationFrame(() => {
      setActiveTab(tab);
      
      // Update URL without causing re-renders
      const params = new URLSearchParams(location.search);
      params.set('tab', tab);
      const newUrl = `${location.pathname}?${params.toString()}`;
      
      // Use replace to avoid adding to history stack
      window.history.replaceState(null, '', newUrl);
      
      // Reset switching state after a brief delay
      setTimeout(() => setIsTabSwitching(false), 100);
    });
  }, [activeTab, isTabSwitching, location.pathname, location.search]);

  // Sync active tab with URL query on initial load only
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabFromQuery = params.get('tab');
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, []); // Only run on mount

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [tt, att, asg, noti, id, ana, tl, mats, exs, feesData] = await Promise.all([
          axios.get(`${API_BASE}/student/${studentId}/timetable`),
          axios.get(`${API_BASE}/student/${studentId}/attendance`),
          axios.get(`${API_BASE}/student/${studentId}/assignments`),
          axios.get(`${API_BASE}/student/${studentId}/notifications`),
          axios.get(`${API_BASE}/student/${studentId}/id`),
          axios.get(`${API_BASE}/student/${studentId}/analytics`),
          axios.get(`${API_BASE}/student/${studentId}/timeline`),
          axios.get(`${API_BASE}/student/${studentId}/materials`),
          axios.get(`${API_BASE}/student/${studentId}/exams`),
          axios.get(`${API_BASE}/student/${studentId}/fees`)
        ]);
        setTimetableData(tt.data.week || {});
        setAttendance(att.data || { total: 0, present: 0, percentage: 0, subjects: [] });
        setAssignments(asg.data || []);
        setNotifications((noti.data || []).map((n, idx) => ({ id: idx + 1, message: n.message, time: new Date(n.createdAt).toLocaleString(), unread: n.unread })));
        setIdCard(id.data || {});
        setAnalytics(ana.data || {});
        setTimeline(tl.data || []);
        setResources((mats.data || []).map(m => ({ title: m.title, type: m.type, link: m.url })));
        setUpcomingExams((exs.data || []).map(e => ({ subject: e.subject, date: new Date(e.date) })));
        setFees(feesData.data || { feeStructure: [], transactions: [], scholarships: [], dueReminders: [], summary: { totalFee: 0, totalPaid: 0, totalScholarship: 0, pendingAmount: 0, paidPercentage: 0 } });
        
      } catch (e) {
        console.error(e);
      }
    };
    loadAll();

    const socket = io('http://localhost:5001');
    socket.emit('join-student', studentId);
    // Debounce timeline events to reduce render frequency
    const bufferRef = { current: [] };
    const flushTimerRef = { current: null };
    socket.on(`student:${studentId}:timeline`, (event) => {
      bufferRef.current.push({ ...event });
      if (!flushTimerRef.current) {
        flushTimerRef.current = setTimeout(() => {
          const batch = bufferRef.current;
          bufferRef.current = [];
          flushTimerRef.current = null;
          setTimeline((prev) => [...batch, ...prev]);
        }, 250);
      }
    });
    return () => socket.disconnect();
  }, [studentId]);

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('title', file.name);
      await axios.post(`${API_BASE}/student/${studentId}/assignments/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      const res = await axios.get(`${API_BASE}/student/${studentId}/assignments`);
      setAssignments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const submitBooking = async () => {
    if (!bookingForm.room || !bookingForm.date || !bookingForm.timeSlot) return;
    setBookingSubmitting(true);
    try {
      await axios.post(`${API_BASE}/student/${studentId}/bookings`, bookingForm);
      setBookingForm({ resourceType: 'Lab', room: '', date: '', timeSlot: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentForm.amount || !paymentForm.feeType) return;
    try {
      await axios.post(`${API_BASE}/student/${studentId}/fees/payment`, paymentForm);
      const feesRes = await axios.get(`${API_BASE}/student/${studentId}/fees`);
      setFees(feesRes.data || { feeStructure: [], transactions: [], scholarships: [], dueReminders: [], summary: { totalFee: 0, totalPaid: 0, totalScholarship: 0, pendingAmount: 0, paidPercentage: 0 } });
      setPaymentForm({ amount: '', mode: 'UPI', feeType: 'Tuition' });
    } catch (err) {
      console.error(err);
    }
  };

  

  const renderTimetableCard = () => (
    <Card className="timetable-card" padding="xl" hover>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: spacing.lg 
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: typography.fontSizes['2xl'], 
          fontWeight: typography.fontWeights.semibold,
          color: currentColors.text,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm
        }}>
          <Calendar size={24} style={{ color: currentColors.primary }} />
          My Timetable
        </h3>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <Button 
            variant="ghost" 
            size="sm"
            style={{ fontSize: typography.fontSizes.sm }}
          >
            Daily
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            style={{ fontSize: typography.fontSizes.sm }}
          >
            Weekly
          </Button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: spacing.md 
      }}>
        {Object.entries(timetableData).map(([day, classes]) => (
          <div key={day} style={{
            background: currentColors.background,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            border: `1px solid ${currentColors.border}`,
            transition: 'all 0.2s ease'
          }}>
            <h4 style={{ 
              margin: `0 0 ${spacing.md} 0`, 
              fontSize: typography.fontSizes.lg, 
              fontWeight: typography.fontWeights.semibold, 
              color: currentColors.text,
              textTransform: 'capitalize'
            }}>
              {day}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {classes.map((cls, index) => (
                <div key={index} style={{
                  background: currentColors.card,
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                  border: `1px solid ${currentColors.border}`,
                  fontSize: typography.fontSizes.sm,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = currentColors.primary;
                  el.style.boxShadow = currentColors.shadowCard;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = currentColors.border;
                  el.style.boxShadow = 'none';
                }}
                >
                  <div style={{ 
                    fontWeight: typography.fontWeights.semibold, 
                    color: currentColors.text, 
                    marginBottom: spacing.xs 
                  }}>
                    {cls.subject}
                  </div>
                  <div style={{ 
                    color: currentColors.textSecondary, 
                    fontSize: typography.fontSizes.xs,
                    marginBottom: '2px'
                  }}>
                    {cls.time}
                  </div>
                  <div style={{ 
                    color: currentColors.textMuted, 
                    fontSize: typography.fontSizes.xs 
                  }}>
                    {cls.room} • {cls.faculty}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderNotificationsPanel = () => (
    <Card padding="xl" hover>
      <h3 style={{ 
        margin: `0 0 ${spacing.lg} 0`, 
        fontSize: typography.fontSizes['2xl'], 
        fontWeight: typography.fontWeights.semibold,
        color: currentColors.text,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm
      }}>
        <Bell size={24} style={{ color: currentColors.danger }} />
        Notifications
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            padding: spacing.md,
            background: notification.unread ? currentColors.dangerLight : currentColors.background,
            borderRadius: borderRadius.lg,
            border: `1px solid ${notification.unread ? currentColors.danger : currentColors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = notification.unread ? currentColors.dangerLight : currentColors.borderLight;
            el.style.borderColor = notification.unread ? currentColors.danger : currentColors.primary;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = notification.unread ? currentColors.dangerLight : currentColors.background;
            el.style.borderColor = notification.unread ? currentColors.danger : currentColors.border;
          }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: typography.fontWeights.medium, 
                color: currentColors.text, 
                marginBottom: spacing.xs,
                fontSize: typography.fontSizes.sm
              }}>
                {notification.message}
              </div>
              <div style={{ fontSize: typography.fontSizes.xs, color: currentColors.textMuted }}>
                {notification.time}
              </div>
            </div>
            {notification.unread && (
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: borderRadius.full,
                background: currentColors.danger,
                marginTop: spacing.xs
              }}></div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );

  const renderStudyMaterials = () => (
    <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <Download size={20} style={{ marginRight: '8px', color: '#3b82f6' }} /> Study Materials
      </h3>
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {resources.map((r, i) => (
          <a key={i} href={r.link} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', textDecoration: 'none' }}>
            <span>{r.title}</span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{r.type}</span>
          </a>
        ))}
        </div>
      </div>
  );

  const renderRightSidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {renderNotificationsPanel()}
      <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
          <Calendar size={20} style={{ marginRight: '8px', color: '#f59e0b' }} /> Upcoming Exams
        </h3>
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {upcomingExams.map((ex, i) => (
            <div key={i} style={{ padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600, color: '#111827' }}>{ex.subject}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{ex.date.toLocaleString()}</div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );

  const renderAttendanceTracker = () => (
    <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <CheckCircle size={20} style={{ marginRight: '8px', color: '#10b981' }} /> Attendance Tracker
      </h3>
      <div className="dashboard-grid-3fr" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {attendance.subjects.map((subject, idx) => {
          const pct = Math.round(subject.percentage);
          const color = pct >= 90 ? '#10b981' : pct >= 75 ? '#f59e0b' : '#ef4444';
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '12px' }}>
        <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `conic-gradient(${color} ${pct * 3.6}deg, #e5e7eb 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ width: '62px', height: '62px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#111827', fontWeight: 600 }}>{pct}%</div>
        </div>
              <div style={{ fontSize: '12px', color: '#374151', textAlign: 'center' }}>{subject.name}</div>
      </div>
          );
        })}
            </div>
      <div style={{ marginTop: '12px', fontSize: '12px', color: attendance.percentage < 75 ? '#ef4444' : '#6b7280' }}>
        Overall: {attendance.present}/{attendance.total} ({attendance.percentage}%)
      </div>
    </div>
  );

  const renderGapTimeViewer = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <Clock size={20} style={{ marginRight: '8px', color: '#f59e0b' }} />
        Study Gap Time
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {studyGaps.map((gap, index) => (
          <div key={index} style={{
            padding: '16px',
            background: gap.priority === 'high' ? '#fef3c7' : '#f0f9ff',
            borderRadius: '8px',
            border: `1px solid ${gap.priority === 'high' ? '#fbbf24' : '#7dd3fc'}`,
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                {gap.time}
              </div>
              <div style={{
                padding: '2px 8px',
                background: gap.priority === 'high' ? '#f59e0b' : '#3b82f6',
                color: 'white',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                {gap.priority} priority
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
              {gap.suggestion}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                AI Confidence: {gap.confidence}%
              </div>
              <button style={{
                padding: '4px 12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeedbackWidget = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <Star size={20} style={{ marginRight: '8px', color: '#f59e0b' }} />
        Feedback & Rating
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>
          Rate your current timetable experience:
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setFeedback({...feedback, rating: star})}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <Star 
                size={24} 
                color={star <= feedback.rating ? '#f59e0b' : '#d1d5db'}
                fill={star <= feedback.rating ? '#f59e0b' : 'none'}
              />
            </button>
          ))}
        </div>
        <textarea
          placeholder="Share your feedback about the timetable system..."
          value={feedback.comment}
          onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            resize: 'vertical',
            minHeight: '80px',
            outline: 'none'
          }}
        />
        <button onClick={async () => {
          try {
            await axios.post(`${API_BASE}/student/${studentId}/feedback`, { rating: feedback.rating, comment: feedback.comment });
            setFeedback({ rating: 0, comment: '' });
          } catch (e) { console.error(e); }
        }} style={{
          marginTop: '12px',
          padding: '8px 16px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          Submit Feedback
        </button>
      </div>
    </div>
  );

  const pieData = useMemo(() => ({
    labels: analytics.distribution.map(d => d.label),
    datasets: [{ data: analytics.distribution.map(d => d.value), backgroundColor: ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6'] }]
  }), [analytics.distribution]);

  const lineData = useMemo(() => ({
    labels: analytics.performance.map(p => p.label),
    datasets: [{ label: 'Marks', data: analytics.performance.map(p => p.marks), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.2)' }]
  }), [analytics.performance]);

  const renderAnalytics = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <BarChart3 size={20} style={{ marginRight: '8px', color: '#06b6d4' }} />
        My Analytics
      </h3>
      <div className="dashboard-grid-2fr" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px' }}>
          <Pie data={pieData} />
          </div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px' }}>
          <Line data={lineData} options={{ scales: { y: { beginAtZero: true, max: 100 } } }} />
        </div>
      </div>
      <div style={{ marginTop: '12px', fontSize: '14px', color: '#374151' }}>
        {analytics.progressMessage}
      </div>
    </div>
  );

  const renderFeesCard = () => (
    <Card padding="xl" hover>
      <h3 style={{ 
        margin: `0 0 ${spacing.lg} 0`, 
        fontSize: typography.fontSizes['2xl'], 
        fontWeight: typography.fontWeights.semibold,
        color: currentColors.text,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm
      }}>
        <TrendingUp size={24} style={{ color: currentColors.success }} />
        My Fees
      </h3>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <span style={{ fontSize: typography.fontSizes.sm, color: currentColors.textSecondary }}>Payment Progress</span>
          <span style={{ fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.semibold, color: currentColors.text }}>{fees.summary.paidPercentage}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: currentColors.border, borderRadius: borderRadius.sm, overflow: 'hidden' }}>
          <div style={{
            width: `${fees.summary.paidPercentage}%`,
            height: '100%',
            background: fees.summary.paidPercentage >= 100 ? currentColors.success : currentColors.primary,
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: spacing.sm, fontSize: typography.fontSizes.xs, color: currentColors.textMuted }}>
          <span>Paid: ₹{(fees.summary.totalPaid || 0).toLocaleString()}</span>
          <span>Pending: ₹{(fees.summary.pendingAmount || 0).toLocaleString()}</span>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: `0 0 ${spacing.md} 0`, fontSize: typography.fontSizes.lg, fontWeight: typography.fontWeights.semibold, color: currentColors.text }}>Fee Structure</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {fees.feeStructure.map((fee, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: `${spacing.sm} ${spacing.md}`, background: currentColors.background, borderRadius: borderRadius.md }}>
              <span style={{ fontSize: typography.fontSizes.sm, color: currentColors.textSecondary }}>{fee.feeType}</span>
              <span style={{ fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.semibold, color: currentColors.text }}>₹{fee.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Make Payment</h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <select
            value={paymentForm.feeType}
            onChange={(e) => setPaymentForm({ ...paymentForm, feeType: e.target.value })}
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
          >
            {fees.feeStructure.map((fee, idx) => (
              <option key={idx} value={fee.feeType}>{fee.feeType} - ₹{fee.amount}</option>
            ))}
          </select>
          <select
            value={paymentForm.mode}
            onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
            style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
          >
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="NetBanking">NetBanking</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Amount"
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
          />
          <button
            onClick={handlePayment}
            style={{
              padding: '8px 16px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Pay Now
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Recent Payments</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
          {fees.transactions.map((txn, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f9fafb', borderRadius: '6px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#374151' }}>{txn.feeType}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(txn.date).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>₹{txn.amountPaid.toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{txn.mode}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {fees.scholarships.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Scholarships</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {fees.scholarships.map((scholarship, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #0ea5e9' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>{scholarship.discountType}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0ea5e9' }}>₹{scholarship.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
          Quick Payment QR Code
        </h4>
        <div style={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <QRCodeCanvas 
            value={`PAYMENT:${studentId}:${fees.summary.pendingAmount || 0}`}
            size={120}
            style={{ margin: '0 auto' }}
          />
        </div>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
          Scan with UPI app to pay ₹{(fees.summary.pendingAmount || 0).toLocaleString()}
        </p>
      </div>
    </Card>
  );

  const renderAssignmentsPanel = () => (
    <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <BookOpen size={20} style={{ marginRight: '8px', color: '#3b82f6' }} /> Assignments & Exams
      </h3>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} />
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {assignments.map((a, i) => (
          <div key={i} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#111827' }}>{a.title}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Due: {a.dueDate ? new Date(a.dueDate).toLocaleString() : '-'}</div>
            </div>
            <div style={{ fontSize: '12px', color: a.status === 'pending' ? '#f59e0b' : '#10b981' }}>{a.status}</div>
          </div>
        ))}
          </div>
        </div>
  );

  const renderBookingPanel = () => (
    <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <MapPin size={20} style={{ marginRight: '8px', color: '#10b981' }} /> Classroom & Resource Booking
      </h3>
      <div className="dashboard-grid-2fr" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        <select value={bookingForm.resourceType} onChange={(e) => setBookingForm({ ...bookingForm, resourceType: e.target.value })}>
          <option>Lab</option>
          <option>Project Room</option>
        </select>
        <input placeholder="Room" value={bookingForm.room} onChange={(e) => setBookingForm({ ...bookingForm, room: e.target.value })} />
        <input type="date" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
        <input placeholder="Time Slot (e.g., 10:00-12:00)" value={bookingForm.timeSlot} onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })} />
      </div>
      <button onClick={submitBooking} disabled={bookingSubmitting} style={{ marginTop: '10px', padding: '8px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Request Booking</button>
    </div>
  );

  const renderIdPanel = () => (
    <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Digital ID</div>
        <div style={{ fontSize: '14px', color: '#374151' }}>{idCard.name} • {idCard.studentId}</div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>{idCard.department}</div>
          </div>
      <div>
        {idCard.qrData ? <QRCodeCanvas value={idCard.qrData} size={96} /> : null}
          </div>
        </div>
  );

  const renderTimeline = () => (
    <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <Clock size={20} style={{ marginRight: '8px', color: '#f59e0b' }} /> Collaboration Timeline
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {timeline.map((event, idx) => (
          <div key={idx} style={{ padding: '10px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '14px', color: '#111827' }}>{event.action}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{event.createdAt ? new Date(event.createdAt).toLocaleString() : ''}</div>
          </div>
        ))}
          </div>
        </div>
  );

  

  const renderHeaderBar = () => (
    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Welcome back, {user?.name || 'Student'}!</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e5e7eb' }}></div>
        <div style={{ fontSize: '14px', color: '#374151' }}>{user?.email}</div>
      </div>
    </div>
  );

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case 'timetable':
        return (
          <div>
            {renderHeaderBar()}
          <div className="dashboard-grid-2fr-1fr" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {renderTimetableCard()}
                <div className="dashboard-grid-1fr-1fr" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {renderAttendanceTracker()}
                  {renderStudyMaterials()}
                </div>
                {renderAnalytics()}
                {renderTimeline()}
                {renderFeedbackWidget()}
              </div>
              {renderRightSidebar()}
            </div>
          </div>
        );
      case 'notifications':
        return renderNotificationsPanel();
      case 'attendance':
        return (
          <div>
            {renderHeaderBar()}
            {renderAttendanceTracker()}
          </div>
        );
      case 'gaps':
        return renderGapTimeViewer();
      case 'feedback':
        return (
          <div>
            {renderHeaderBar()}
            {renderFeedbackWidget()}
          </div>
        );
      case 'analytics':
        return (
          <div>
            {renderHeaderBar()}
            {renderAnalytics()}
          </div>
        );
      case 'fees':
        return (
          <div>
            {renderHeaderBar()}
            {renderFeesCard()}
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, user, fees, paymentForm, handlePayment, renderHeaderBar, renderTimetableCard, renderAttendanceTracker, renderStudyMaterials, renderAnalytics, renderTimeline, renderFeedbackWidget, renderRightSidebar, renderFeesCard]);

  return (
    <>
      <style>{`
        /* Enhanced Dashboard Responsive Styles */
        @media (max-width: 991px) {
          .dashboard-main {
            margin-left: 0 !important;
            padding-top: 64px !important;
          }
          .dashboard-content {
            padding: 16px !important;
          }
          .dashboard-grid-2fr-1fr {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .dashboard-grid-1fr-1fr {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .dashboard-grid-3fr {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .dashboard-grid-2fr {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .card {
            padding: 16px !important;
          }
          .timetable-card {
            overflow-x: auto !important;
          }
          .timetable-grid {
            min-width: 600px !important;
          }
        }
        
        @media (max-width: 768px) {
          .dashboard-content {
            padding: 14px !important;
          }
          .card {
            padding: 14px !important;
          }
          .timetable-grid {
            min-width: 550px !important;
          }
        }
        
        @media (max-width: 576px) {
          .dashboard-content {
            padding: 12px !important;
          }
          .card {
            padding: 12px !important;
          }
          .timetable-grid {
            min-width: 500px !important;
          }
        }
        
        @media (max-width: 480px) {
          .dashboard-content {
            padding: 10px !important;
          }
          .card {
            padding: 10px !important;
          }
          .timetable-grid {
            min-width: 450px !important;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .card {
            border-radius: 12px !important;
          }
          .timetable-cell {
            min-height: 60px !important;
          }
          button {
            min-height: 44px !important;
            min-width: 44px !important;
          }
        }
        
        /* Landscape orientation for mobile */
        @media (orientation: landscape) and (max-height: 500px) {
          .dashboard-content {
            padding: 8px !important;
          }
          .card {
            padding: 8px !important;
            margin-bottom: 8px !important;
          }
        }
        
        /* Performance optimizations */
        .dashboard-main {
          will-change: margin-left;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .dashboard-content {
          will-change: padding;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .card {
          will-change: transform, box-shadow;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        /* Fix for iOS Safari */
        @supports (-webkit-touch-callout: none) {
          .card {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        }
        
        /* Smooth scrolling for timetable */
        .timetable-card {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        /* Fix for layout shift */
        .dashboard-grid-2fr-1fr,
        .dashboard-grid-1fr-1fr,
        .dashboard-grid-3fr,
        .dashboard-grid-2fr {
          will-change: grid-template-columns;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
      <div style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        background: currentColors.background,
        fontFamily: typography.fontFamily,
        position: 'relative'
      }}>
      <StudentSidebar 
        activeTab={activeTab} 
        setActiveTab={setTabSmooth} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      <div className="dashboard-main" style={{ 
        flex: 1, 
        marginLeft: isCollapsed ? '80px' : '280px', 
        transition: 'margin-left 0.3s ease',
        background: currentColors.background,
        position: 'relative'
      }}>
        <TopNavbar 
          isCollapsed={isCollapsed} 
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />
        <div className="dashboard-content" style={{ 
          padding: `${spacing['3xl']} ${spacing.xl} ${spacing.xl} ${spacing.xl}`,
          minHeight: 'calc(100vh - 64px)',
          position: 'relative',
          zIndex: 1
        }}>
          {isTabSwitching ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
              opacity: 0.7
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : (
            renderContent
          )}
        </div>
      </div>
      <AIChatbot />
    </div>
    </>
  );
};

export default StudentDashboard;