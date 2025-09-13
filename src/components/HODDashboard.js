import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import HODSidebar from './HODSidebar';
import TopNavbar from './TopNavbar';
import AIChatbot from './AIChatbot';
import { 
  BarChart3, 
  Building, 
  CheckCircle, 
  AlertTriangle, 
  Brain,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  Activity,
  Filter,
  Download,
  Eye,
  Check,
  X,
  CreditCard
} from 'lucide-react';

const HODDashboard = () => {
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

  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [departmentOverview, setDepartmentOverview] = useState({});
  const [roomUtilization, setRoomUtilization] = useState([]);
  const [approvalQueue, setApprovalQueue] = useState([]);
  const [conflictDetection, setConflictDetection] = useState([]);
  const [predictiveInsights, setPredictiveInsights] = useState([]);
  const [feeReports, setFeeReports] = useState({ departmentCollection: {}, defaultersList: [], scholarshipRequests: [] });

  useEffect(() => {
    const loadFeeReports = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/hod/fee-reports');
        const data = await response.json();
        setFeeReports(data);
      } catch (error) {
        console.error('Error loading fee reports:', error);
      }
    };
    loadFeeReports();
  }, []);

  useEffect(() => {
    // Mock department overview data
    setDepartmentOverview({
      totalFaculty: 25,
      totalStudents: 450,
      totalRooms: 15,
      activeClasses: 18,
      workloadDistribution: [
        { faculty: 'Dr. Jane Smith', hours: 18, status: 'optimal', color: '#10b981' },
        { faculty: 'Prof. Mike Johnson', hours: 22, status: 'overloaded', color: '#ef4444' },
        { faculty: 'Dr. Sarah Wilson', hours: 16, status: 'optimal', color: '#10b981' },
        { faculty: 'Prof. David Lee', hours: 20, status: 'moderate', color: '#f59e0b' },
        { faculty: 'Dr. Maria Garcia', hours: 15, status: 'optimal', color: '#10b981' }
      ]
    });

    // Mock room utilization data
    setRoomUtilization([
      { room: 'CS-101', capacity: 50, utilization: 85, status: 'high', schedule: '9:00-17:00' },
      { room: 'CS-102', capacity: 30, utilization: 60, status: 'moderate', schedule: '10:00-16:00' },
      { room: 'CS-103', capacity: 40, utilization: 45, status: 'low', schedule: '11:00-15:00' },
      { room: 'CS-104', capacity: 60, utilization: 90, status: 'high', schedule: '8:00-18:00' },
      { room: 'CS-105', capacity: 35, utilization: 70, status: 'moderate', schedule: '9:00-17:00' }
    ]);

    // Mock approval queue
    setApprovalQueue([
      { 
        id: 1, 
        type: 'leave', 
        faculty: 'Dr. Jane Smith', 
        request: 'Medical Leave - 3 days', 
        date: '2024-03-20',
        priority: 'high',
        status: 'pending'
      },
      { 
        id: 2, 
        type: 'timetable', 
        faculty: 'Prof. Mike Johnson', 
        request: 'Room change for Data Structures class', 
        date: '2024-03-18',
        priority: 'medium',
        status: 'pending'
      },
      { 
        id: 3, 
        type: 'leave', 
        faculty: 'Dr. Sarah Wilson', 
        request: 'Conference attendance - 2 days', 
        date: '2024-03-15',
        priority: 'low',
        status: 'pending'
      }
    ]);

    // Mock conflict detection
    setConflictDetection([
      { 
        id: 1, 
        type: 'room', 
        description: 'Room CS-101 double booked at 10:00-11:00', 
        severity: 'high',
        affected: ['Dr. Jane Smith', 'Prof. David Lee'],
        suggested: 'Move Prof. David Lee to CS-102'
      },
      { 
        id: 2, 
        type: 'faculty', 
        description: 'Dr. Mike Johnson scheduled for 3 consecutive classes', 
        severity: 'medium',
        affected: ['Prof. Mike Johnson'],
        suggested: 'Redistribute classes across different time slots'
      },
      { 
        id: 3, 
        type: 'resource', 
        description: 'Lab equipment conflict in CS-103', 
        severity: 'low',
        affected: ['Database Systems Lab', 'Algorithms Lab'],
        suggested: 'Schedule labs on different days'
      }
    ]);

    // Mock predictive insights
    setPredictiveInsights([
      { 
        id: 1, 
        type: 'workload', 
        title: 'Faculty Overload Prediction', 
        description: 'Prof. Mike Johnson will be overloaded next week. Consider redistributing 2 classes.',
        confidence: 92,
        impact: 'high',
        timeframe: 'Next 7 days'
      },
      { 
        id: 2, 
        type: 'room', 
        title: 'Room Utilization Optimization', 
        description: 'Room CS-103 is underutilized. Consider moving more classes there.',
        confidence: 87,
        impact: 'medium',
        timeframe: 'Next 14 days'
      },
      { 
        id: 3, 
        type: 'student', 
        description: 'Student attendance may drop by 15% during exam week', 
        confidence: 78,
        impact: 'low',
        timeframe: 'Next 21 days'
      }
    ]);
  }, []);

  const renderDepartmentOverview = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <BarChart3 size={20} style={{ marginRight: '8px', color: '#3b82f6' }} />
        Department Overview
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          padding: '16px',
          background: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #7dd3fc'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0369a1', marginBottom: '4px' }}>
            {departmentOverview.totalFaculty}
          </div>
          <div style={{ fontSize: '12px', color: '#0369a1' }}>
            Total Faculty
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #86efac'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
            {departmentOverview.totalStudents}
          </div>
          <div style={{ fontSize: '12px', color: '#166534' }}>
            Total Students
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #fbbf24'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#92400e', marginBottom: '4px' }}>
            {departmentOverview.totalRooms}
          </div>
          <div style={{ fontSize: '12px', color: '#92400e' }}>
            Total Rooms
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#fdf2f8',
          borderRadius: '8px',
          border: '1px solid #f9a8d4'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#be185d', marginBottom: '4px' }}>
            {departmentOverview.activeClasses}
          </div>
          <div style={{ fontSize: '12px', color: '#be185d' }}>
            Active Classes
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
          Faculty Workload Distribution
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {departmentOverview.workloadDistribution?.map((faculty, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: faculty.color
                }}></div>
                <span style={{ fontSize: '14px', color: '#374151' }}>{faculty.faculty}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '60px',
                  height: '6px',
                  background: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(faculty.hours / 25) * 100}%`,
                    height: '100%',
                    background: faculty.color,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                  {faculty.hours}h
                </span>
                <div style={{
                  padding: '2px 6px',
                  background: faculty.status === 'optimal' ? '#d1fae5' : faculty.status === 'overloaded' ? '#fecaca' : '#fef3c7',
                  color: faculty.status === 'optimal' ? '#065f46' : faculty.status === 'overloaded' ? '#dc2626' : '#92400e',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {faculty.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRoomUtilization = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
          <Building size={20} style={{ marginRight: '8px', color: '#10b981' }} />
          Room Utilization Heatmap
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {roomUtilization.map((room, index) => (
          <div key={index} style={{
            padding: '16px',
            background: room.status === 'high' ? '#fef2f2' : room.status === 'moderate' ? '#fef3c7' : '#f0fdf4',
            borderRadius: '8px',
            border: `1px solid ${room.status === 'high' ? '#fecaca' : room.status === 'moderate' ? '#fbbf24' : '#86efac'}`,
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                {room.room}
              </div>
              <div style={{
                padding: '2px 6px',
                background: room.status === 'high' ? '#ef4444' : room.status === 'moderate' ? '#f59e0b' : '#10b981',
                color: 'white',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                {room.status}
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Utilization</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>{room.utilization}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${room.utilization}%`,
                  height: '100%',
                  background: room.status === 'high' ? '#ef4444' : room.status === 'moderate' ? '#f59e0b' : '#10b981',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
              Capacity: {room.capacity} students
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>
              Schedule: {room.schedule}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApprovalQueue = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <CheckCircle size={20} style={{ marginRight: '8px', color: '#f59e0b' }} />
        Approval Queue
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {approvalQueue.map((request) => (
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
                  background: request.type === 'leave' ? '#fef2f2' : '#f0f9ff',
                  color: request.type === 'leave' ? '#dc2626' : '#2563eb',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {request.type}
                </div>
                <div style={{
                  padding: '4px 8px',
                  background: request.priority === 'high' ? '#fecaca' : request.priority === 'medium' ? '#fef3c7' : '#d1fae5',
                  color: request.priority === 'high' ? '#dc2626' : request.priority === 'medium' ? '#92400e' : '#065f46',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {request.priority}
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                {request.faculty}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                {request.request}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Date: {request.date}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                padding: '6px 12px',
                background: '#10b981',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Check size={14} />
                Approve
              </button>
              <button style={{
                padding: '6px 12px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <X size={14} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConflictDetection = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <AlertTriangle size={20} style={{ marginRight: '8px', color: '#ef4444' }} />
        Conflict Detection
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {conflictDetection.map((conflict) => (
          <div key={conflict.id} style={{
            padding: '16px',
            background: conflict.severity === 'high' ? '#fef2f2' : conflict.severity === 'medium' ? '#fef3c7' : '#f0f9ff',
            borderRadius: '8px',
            border: `1px solid ${conflict.severity === 'high' ? '#fecaca' : conflict.severity === 'medium' ? '#fbbf24' : '#7dd3fc'}`,
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                {conflict.description}
              </div>
              <div style={{
                padding: '2px 8px',
                background: conflict.severity === 'high' ? '#ef4444' : conflict.severity === 'medium' ? '#f59e0b' : '#3b82f6',
                color: 'white',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                {conflict.severity}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              Affected: {conflict.affected.join(', ')}
            </div>
            <div style={{ fontSize: '12px', color: '#374151', marginBottom: '12px' }}>
              Suggested: {conflict.suggested}
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
                Resolve
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
        ))}
      </div>
    </div>
  );

  const renderPredictiveInsights = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <Brain size={20} style={{ marginRight: '8px', color: '#8b5cf6' }} />
        Predictive Insights
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {predictiveInsights.map((insight) => (
          <div key={insight.id} style={{
            padding: '16px',
            background: insight.impact === 'high' ? '#fef2f2' : insight.impact === 'medium' ? '#fef3c7' : '#f0f9ff',
            borderRadius: '8px',
            border: `1px solid ${insight.impact === 'high' ? '#fecaca' : insight.impact === 'medium' ? '#fbbf24' : '#7dd3fc'}`,
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                {insight.title}
              </div>
              <div style={{
                padding: '2px 8px',
                background: insight.impact === 'high' ? '#ef4444' : insight.impact === 'medium' ? '#f59e0b' : '#3b82f6',
                color: 'white',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                {insight.impact} impact
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
              {insight.description}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                Confidence: {insight.confidence}% • {insight.timeframe}
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
                  View Details
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

  const renderFeeReports = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <CreditCard size={20} style={{ marginRight: '8px', color: '#10b981' }} />
        Fee Reports
      </h3>
      
      {/* Department Collection Summary */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          Department Collection Summary
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{
            padding: '16px',
            background: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #7dd3fc'
          }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0369a1', marginBottom: '4px' }}>
              ₹{feeReports.departmentCollection?.currentMonth?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '12px', color: '#0369a1' }}>
              Current Month
            </div>
          </div>
          <div style={{
            padding: '16px',
            background: '#f0fdf4',
            borderRadius: '8px',
            border: '1px solid #86efac'
          }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
              ₹{feeReports.departmentCollection?.lastMonth?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '12px', color: '#166534' }}>
              Last Month
            </div>
          </div>
          <div style={{
            padding: '16px',
            background: '#fef3c7',
            borderRadius: '8px',
            border: '1px solid #fbbf24'
          }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#92400e', marginBottom: '4px' }}>
              {feeReports.departmentCollection?.growth || 0}%
            </div>
            <div style={{ fontSize: '12px', color: '#92400e' }}>
              Growth Rate
            </div>
          </div>
        </div>
      </div>

      {/* Defaulters List */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          Defaulters List
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
          {feeReports.defaultersList.map((defaulter, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px', 
              background: '#fef2f2', 
              borderRadius: '8px',
              border: '1px solid #fecaca'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {defaulter.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {defaulter.studentId} • {defaulter.daysOverdue} days overdue
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>
                  ₹{defaulter.pendingAmount.toLocaleString()}
                </div>
                <button style={{
                  padding: '4px 8px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  marginTop: '4px'
                }}>
                  Send Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scholarship Requests */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          Scholarship Approval Requests
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
          {feeReports.scholarshipRequests.map((request, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px', 
              background: '#f0f9ff', 
              borderRadius: '8px',
              border: '1px solid #7dd3fc'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {request.studentId}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {request.discountType} • {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0369a1' }}>
                  ₹{request.amount.toLocaleString()}
                </div>
                <button style={{
                  padding: '4px 8px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}>
                  Approve
                </button>
                <button style={{
                  padding: '4px 8px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {renderDepartmentOverview()}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {renderApprovalQueue()}
              {renderConflictDetection()}
            </div>
          </div>
        );
      case 'rooms':
        return renderRoomUtilization();
      case 'approvals':
        return renderApprovalQueue();
      case 'conflicts':
        return renderConflictDetection();
      case 'insights':
        return renderPredictiveInsights();
      case 'analytics':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {renderDepartmentOverview()}
            {renderRoomUtilization()}
          </div>
        );
      case 'fees':
        return renderFeeReports();
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: currentColors.background }}>
      <HODSidebar activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
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

export default HODDashboard;