import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import FacultySidebar from './FacultySidebar';
import TopNavbar from './TopNavbar';
import AIChatbot from './AIChatbot';
import { 
  BookOpen, 
  BarChart3, 
  Clock, 
  Users, 
  Brain,
  TrendingUp,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  ArrowRightLeft,
  Plus,
  Filter,
  Download,
  CreditCard
} from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;
  
  // Helper function to get themed card styles
  const getCardStyles = () => ({
    background: currentColors.card,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: `1px solid ${currentColors.border}`,
    color: currentColors.text
  });

  const getTextStyles = (isSecondary = false) => ({
    color: isSecondary ? currentColors.textSecondary : currentColors.text
  });

  const [activeTab, setActiveTab] = useState('teaching');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [teachingSchedule, setTeachingSchedule] = useState([]);
  const [workloadData, setWorkloadData] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [classManagement, setClassManagement] = useState([]);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [leaveForm, setLeaveForm] = useState({ date: '', reason: '', type: 'personal' });
  const [feeOverview, setFeeOverview] = useState({ totalStudents: 0, studentsWithPendingFees: 0, pendingAmount: 0, collectionRate: 0, recentPayments: [] });
  const API_BASE = 'http://localhost:5001/api';

  useEffect(() => {
    const facultyId = user?.facultyId || 'FAC100';
    const load = async () => {
      try {
        const [schedule, workload, leaves, fees] = await Promise.all([
          axios.get(`${API_BASE}/faculty/${facultyId}/schedule`),
          axios.get(`${API_BASE}/faculty/${facultyId}/workload`),
          axios.get(`${API_BASE}/faculty/${facultyId}/leaves`),
          axios.get(`${API_BASE}/faculty/${facultyId}/fee-overview`)
        ]);
        setTeachingSchedule(schedule.data || []);
        setWorkloadData(workload.data || {});
        setLeaveRequests(leaves.data || []);
        setFeeOverview(fees.data || { totalStudents: 0, studentsWithPendingFees: 0, pendingAmount: 0, collectionRate: 0, recentPayments: [] });
      } catch (e) { console.error(e); }
    };
    load();

    // Mock class management
    setClassManagement([
      { id: 1, subject: 'Data Structures', room: 'CS-101', time: '09:00-10:00', action: 'swap', reason: 'Room conflict' },
      { id: 2, subject: 'Algorithms Lab', room: 'CS-102', time: '11:00-12:00', action: 'reschedule', reason: 'Equipment maintenance' }
    ]);

    // Mock smart suggestions
    setSmartSuggestions([
      { 
        id: 1, 
        type: 'optimization', 
        title: 'Optimal Teaching Slot Found', 
        description: 'Consider moving Data Structures to 10:00-11:00 for better student engagement',
        confidence: 92,
        impact: 'high'
      },
      { 
        id: 2, 
        type: 'workload', 
        title: 'Workload Balance Alert', 
        description: 'Your Tuesday schedule is overloaded. Consider redistributing some classes',
        confidence: 87,
        impact: 'medium'
      },
      { 
        id: 3, 
        type: 'room', 
        title: 'Room Utilization Suggestion', 
        description: 'Room CS-105 is available and better equipped for your Database Systems lab',
        confidence: 95,
        impact: 'low'
      }
    ]);
  }, []);

  const submitLeave = async () => {
    const facultyId = user?.facultyId || 'FAC100';
    if (!leaveForm.date || !leaveForm.reason) return;
    try {
      const res = await axios.post(`${API_BASE}/faculty/${facultyId}/leaves`, leaveForm);
      setLeaveRequests((prev) => [res.data.leave, ...prev]);
      setLeaveForm({ date: '', reason: '', type: 'personal' });
    } catch (e) { console.error(e); }
  };

  const renderTeachingTimetable = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
          <BookOpen size={20} style={{ marginRight: '8px', color: '#3b82f6' }} />
          Teaching Schedule
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            padding: '6px 12px',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Filter size={14} />
            Filter
          </button>
          <button style={{
            padding: '6px 12px',
            background: '#3b82f6',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {teachingSchedule.map((classItem) => (
          <div key={classItem.id} style={{
            padding: '16px',
            background: classItem.status === 'upcoming' ? '#f0f9ff' : '#f9fafb',
            borderRadius: '8px',
            border: `1px solid ${classItem.status === 'upcoming' ? '#7dd3fc' : '#e5e7eb'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  padding: '4px 8px',
                  background: classItem.type === 'Lecture' ? '#3b82f6' : '#10b981',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {classItem.type}
                </div>
                <div style={{
                  padding: '4px 8px',
                  background: classItem.status === 'upcoming' ? '#fef3c7' : '#d1fae5',
                  color: classItem.status === 'upcoming' ? '#92400e' : '#065f46',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {classItem.status}
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                {classItem.subject}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  {classItem.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} />
                  {classItem.room}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={14} />
                  {classItem.students} students
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                padding: '6px 12px',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                View Details
              </button>
              {classItem.status === 'upcoming' && (
                <button style={{
                  padding: '6px 12px',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  Start Class
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkloadAnalytics = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <BarChart3 size={20} style={{ marginRight: '8px', color: '#10b981' }} />
        Workload Analytics
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          padding: '16px',
          background: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #7dd3fc'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0369a1', marginBottom: '4px' }}>
            {workloadData.weeklyHours}h
          </div>
          <div style={{ fontSize: '12px', color: '#0369a1' }}>
            Weekly Hours
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #86efac'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
            {workloadData.monthlyHours}h
          </div>
          <div style={{ fontSize: '12px', color: '#166534' }}>
            Monthly Hours
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #fbbf24'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#92400e', marginBottom: '4px' }}>
            {workloadData.subjects}
          </div>
          <div style={{ fontSize: '12px', color: '#92400e' }}>
            Subjects
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#fdf2f8',
          borderRadius: '8px',
          border: '1px solid #f9a8d4'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#be185d', marginBottom: '4px' }}>
            {workloadData.students}
          </div>
          <div style={{ fontSize: '12px', color: '#be185d' }}>
            Total Students
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
          Subject-wise Distribution
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {workloadData.distribution?.map((subject, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <span style={{ fontSize: '14px', color: '#374151' }}>{subject.subject}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '60px',
                  height: '6px',
                  background: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(subject.hours / 6) * 100}%`,
                    height: '100%',
                    background: subject.color,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                  {subject.hours}h
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLeaveManagement = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
          <Clock size={20} style={{ marginRight: '8px', color: '#f59e0b' }} />
          Leave Management
        </h3>
        <button onClick={submitLeave} style={{
          padding: '8px 16px',
          background: '#3b82f6',
          border: 'none',
          borderRadius: '6px',
          color: 'white',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Plus size={16} />
          Apply Leave
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '8px', marginBottom: '16px' }}>
        <input type="date" value={leaveForm.date} onChange={(e) => setLeaveForm({ ...leaveForm, date: e.target.value })} />
        <input placeholder="Reason" value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} />
        <select value={leaveForm.type} onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}>
          <option value="personal">Personal</option>
          <option value="sick">Sick</option>
          <option value="professional">Professional</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {leaveRequests.map((request) => (
          <div key={request.id} style={{
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  padding: '4px 8px',
                  background: request.type === 'sick' ? '#fef2f2' : request.type === 'professional' ? '#f0f9ff' : '#f9fafb',
                  color: request.type === 'sick' ? '#dc2626' : request.type === 'professional' ? '#2563eb' : '#374151',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {request.type}
                </div>
                <div style={{
                  padding: '4px 8px',
                  background: request.status === 'approved' ? '#d1fae5' : request.status === 'rejected' ? '#fecaca' : '#fef3c7',
                  color: request.status === 'approved' ? '#065f46' : request.status === 'rejected' ? '#dc2626' : '#92400e',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {request.status}
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                {request.reason}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Date: {request.date}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {request.status === 'pending' && (
                <>
                  <button style={{
                    padding: '6px 12px',
                    background: '#10b981',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    Approve
                  </button>
                  <button style={{
                    padding: '6px 12px',
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClassManagement = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <Users size={20} style={{ marginRight: '8px', color: '#8b5cf6' }} />
        Class Management
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {classManagement.map((classItem) => (
          <div key={classItem.id} style={{
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                {classItem.subject}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                {classItem.room} • {classItem.time}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Reason: {classItem.reason}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                padding: '6px 12px',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ArrowRightLeft size={14} />
                {classItem.action}
              </button>
              <button style={{
                padding: '6px 12px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                Process
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSmartSuggestions = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <Brain size={20} style={{ marginRight: '8px', color: '#ef4444' }} />
        Smart Suggestions
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {smartSuggestions.map((suggestion) => (
          <div key={suggestion.id} style={{
            padding: '16px',
            background: suggestion.impact === 'high' ? '#fef2f2' : suggestion.impact === 'medium' ? '#fef3c7' : '#f0f9ff',
            borderRadius: '8px',
            border: `1px solid ${suggestion.impact === 'high' ? '#fecaca' : suggestion.impact === 'medium' ? '#fbbf24' : '#7dd3fc'}`,
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                {suggestion.title}
              </div>
              <div style={{
                padding: '2px 8px',
                background: suggestion.impact === 'high' ? '#ef4444' : suggestion.impact === 'medium' ? '#f59e0b' : '#3b82f6',
                color: 'white',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                {suggestion.impact} impact
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
              {suggestion.description}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                AI Confidence: {suggestion.confidence}%
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '4px 12px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  Apply
                </button>
                <button style={{
                  padding: '4px 12px',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeeOverview = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <CreditCard size={20} style={{ marginRight: '8px', color: '#10b981' }} />
        Class Fee Overview
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          padding: '16px',
          background: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #7dd3fc'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0369a1', marginBottom: '4px' }}>
            {feeOverview.totalStudents}
          </div>
          <div style={{ fontSize: '12px', color: '#0369a1' }}>
            Total Students
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#fef2f2',
          borderRadius: '8px',
          border: '1px solid #fecaca'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>
            {feeOverview.studentsWithPendingFees}
          </div>
          <div style={{ fontSize: '12px', color: '#dc2626' }}>
            Pending Fees
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #fbbf24'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#92400e', marginBottom: '4px' }}>
            ₹{feeOverview.pendingAmount?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#92400e' }}>
            Pending Amount
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #86efac'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
            {feeOverview.collectionRate}%
          </div>
          <div style={{ fontSize: '12px', color: '#166534' }}>
            Collection Rate
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
          Recent Payments
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
          {feeOverview.recentPayments.map((payment, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px', 
              background: '#f9fafb', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {payment.studentId}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {payment.feeType} • {new Date(payment.date).toLocaleDateString()}
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                ₹{payment.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'teaching':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {renderTeachingTimetable()}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {renderWorkloadAnalytics()}
              {renderFeeOverview()}
              {renderLeaveManagement()}
            </div>
          </div>
        );
      case 'workload':
        return renderWorkloadAnalytics();
      case 'leave':
        return renderLeaveManagement();
      case 'classes':
        return renderClassManagement();
      case 'suggestions':
        return renderSmartSuggestions();
      case 'analytics':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {renderWorkloadAnalytics()}
            {renderSmartSuggestions()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: currentColors.background }}>
      <FacultySidebar activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div style={{ flex: 1, marginLeft: isCollapsed ? '80px' : '280px', transition: 'margin-left 0.3s ease' }}>
        <TopNavbar 
          isCollapsed={isCollapsed} 
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)} 
        />
        <div style={{ padding: '100px 30px 30px 30px' }}>
          {renderContent()}
        </div>
      </div>
      <AIChatbot />
    </div>
  );
};

export default FacultyDashboard;