import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AdminSidebar from './AdminSidebar';
import TopNavbar from './TopNavbar';
import AIChatbot from './AIChatbot';
import {
  Users,
  Building,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Battery,
  Zap,
  Calendar,
  MapPin,
  UserPlus,
  Pencil,
  Trash,
  Clock,
  CheckCircle,
  AlertTriangle,
  CreditCard
} from 'lucide-react';

const AdminDashboard = () => {
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

  const [activeTab, setActiveTab] = useState('users');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [usersData, setUsersData] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [systemAnalytics, setSystemAnalytics] = useState({});
  const [energyStats, setEnergyStats] = useState({});
  const [collaboration, setCollaboration] = useState([]);
  const [feeManagement, setFeeManagement] = useState({ feeStructures: [], allTransactions: [], analytics: {} });
  const [invoiceLanguage, setInvoiceLanguage] = useState('english');

  useEffect(() => {
    // Mock users list
    setUsersData([
      { id: 1, name: 'John Doe', email: 'john@student.com', role: 'student', department: 'CSE', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@faculty.com', role: 'faculty', department: 'CSE', status: 'active' },
      { id: 3, name: 'Mike Johnson', email: 'mike@hod.com', role: 'hod', department: 'CSE', status: 'active' },
      { id: 4, name: 'Admin User', email: 'admin@admin.com', role: 'admin', department: 'System', status: 'active' }
    ]);

    // Mock classrooms
    setClassrooms([
      { id: 'CS-101', capacity: 50, occupied: 42, floor: '1', building: 'A', utilization: 84 },
      { id: 'CS-102', capacity: 30, occupied: 18, floor: '1', building: 'A', utilization: 60 },
      { id: 'LAB-201', capacity: 35, occupied: 28, floor: '2', building: 'B', utilization: 80 },
      { id: 'SEMINAR-301', capacity: 60, occupied: 54, floor: '3', building: 'C', utilization: 90 }
    ]);

    // Mock system analytics
    setSystemAnalytics({
      roomUtilization: 76,
      peakHours: '10:00 - 13:00',
      facultyWorkloadBalanced: 68,
      weeklyLectures: 420,
      charts: {
        utilization: [70, 74, 78, 76, 80, 79, 81],
        workload: [60, 62, 64, 66, 68, 69, 70],
        peak: [20, 35, 55, 75, 90, 80, 50]
      }
    });

    // Mock energy widget
    setEnergyStats({
      currentUsageKw: 125,
      weeklySavingsPercent: 18,
      suggestion: 'Shift 2 labs to off-peak hours to save additional 6% energy.'
    });

    // Mock collaboration timeline
    setCollaboration([
      { id: 1, user: 'Admin', action: 'Published new institute timetable', time: '2h ago' },
      { id: 2, user: 'HOD (CSE)', action: 'Approved 3 leave requests', time: '5h ago' },
      { id: 3, user: 'Faculty (Jane)', action: 'Rescheduled Algorithms Lab', time: '1d ago' },
      { id: 4, user: 'System', action: 'Conflict detected and resolved for CS-101', time: '2d ago' }
    ]);

    // Load fee management data
    const loadFeeManagement = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/admin/fee-management');
        const data = await response.json();
        setFeeManagement(data);
      } catch (error) {
        console.error('Error loading fee management data:', error);
      }
    };
    loadFeeManagement();
  }, []);

  const renderAnalytics = () => (
    <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <BarChart3 size={20} style={{ marginRight: '8px', color: '#3b82f6' }} />
        System-wide Analytics
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #7dd3fc' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0369a1' }}>{systemAnalytics.roomUtilization}%</div>
          <div style={{ fontSize: '12px', color: '#0369a1' }}>Room Utilization</div>
        </div>
        <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#92400e' }}>{systemAnalytics.peakHours}</div>
          <div style={{ fontSize: '12px', color: '#92400e' }}>Peak Hours</div>
        </div>
        <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534' }}>{systemAnalytics.facultyWorkloadBalanced}%</div>
          <div style={{ fontSize: '12px', color: '#166534' }}>Faculty Workload Balanced</div>
        </div>
        <div style={{ padding: '16px', background: '#fdf2f8', borderRadius: '8px', border: '1px solid #f9a8d4' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#be185d' }}>{systemAnalytics.weeklyLectures}</div>
          <div style={{ fontSize: '12px', color: '#be185d' }}>Lectures This Week</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
            Utilization Trend (Last 7 days)
          </div>
          <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            {systemAnalytics.charts?.utilization.map((v, i) => (
              <div key={i} style={{ width: '16px', height: `${v}px`, background: '#3b82f6', borderRadius: '6px 6px 0 0' }}></div>
            ))}
          </div>
        </div>
        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
            Peak Load Index
          </div>
          <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            {systemAnalytics.charts?.peak.map((v, i) => (
              <div key={i} style={{ width: '10px', height: `${v}px`, background: '#f59e0b', borderRadius: '6px 6px 0 0' }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTable = () => (
    <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
          <Users size={20} style={{ marginRight: '8px', color: '#3b82f6' }} />
          User Management
        </h3>
        <button style={{ padding: '8px 12px', background: '#3b82f6', border: 'none', color: 'white', borderRadius: '6px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <UserPlus size={16} /> Add User
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Role</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Department</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>{u.name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>{u.email}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6', textTransform: 'capitalize' }}>{u.role}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>{u.department}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ padding: '2px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '999px', fontSize: '12px' }}>{u.status}</span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: '1px solid #d1d5db', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px' }}>
                    <Pencil size={14} />
                  </button>
                  <button style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer' }}>
                    <Trash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderClassroomAllocation = () => (
    <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <Building size={20} style={{ marginRight: '8px', color: '#10b981' }} />
        Classroom Allocation
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {classrooms.map((room) => (
          <div key={room.id} style={{ padding: '16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{room.id}</div>
              <span style={{ padding: '2px 8px', background: '#e0f2fe', color: '#075985', borderRadius: '999px', fontSize: '12px' }}>Floor {room.floor}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Building {room.building} • Capacity {room.capacity}</div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#374151' }}>
                <span>Utilization</span>
                <span>{room.utilization}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${room.utilization}%`, height: '100%', background: room.utilization > 85 ? '#ef4444' : room.utilization > 65 ? '#f59e0b' : '#10b981' }}></div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Occupied {room.occupied}/{room.capacity}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEnergyWidget = () => (
    <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <Activity size={20} style={{ marginRight: '8px', color: '#ef4444' }} />
        Energy Efficiency
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ padding: '16px', background: '#f0f9ff', border: '1px solid #7dd3fc', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0369a1' }}>{energyStats.currentUsageKw} kW</div>
          <div style={{ fontSize: '12px', color: '#0369a1' }}>Current Usage</div>
        </div>
        <div style={{ padding: '16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534' }}>{energyStats.weeklySavingsPercent}%</div>
          <div style={{ fontSize: '12px', color: '#166534' }}>Weekly Savings</div>
        </div>
        <div style={{ padding: '16px', background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#92400e' }}>{energyStats.suggestion}</div>
        </div>
      </div>
    </div>
  );

  const renderCollaborationPanel = () => (
    <div className="widget-card" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <Clock size={20} style={{ marginRight: '8px', color: '#8b5cf6' }} />
        Collaboration Timeline
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {collaboration.map((evt) => (
          <div key={evt.id} style={{ padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              <strong>{evt.user}</strong>: {evt.action}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{evt.time}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeeManagement = () => (
    <div className="widget-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
        <CreditCard size={20} style={{ marginRight: '8px', color: '#10b981' }} />
        Fee Management
      </h3>
      
      {/* Fee Structure Management */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          Fee Structure Management
        </h4>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Program (e.g., B.Tech)"
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
          />
          <input
            type="text"
            placeholder="Semester"
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
          />
          <input
            type="text"
            placeholder="Fee Type"
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
          />
          <input
            type="number"
            placeholder="Amount"
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
          />
          <button style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Add Fee
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
          {feeManagement.feeStructures.map((fee, idx) => (
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
                  {fee.program} - {fee.semester} - {fee.feeType}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Academic Year: {fee.academicYear}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  ₹{fee.amount.toLocaleString()}
                </div>
                <button style={{
                  padding: '4px 8px',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}>
                  Edit
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
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Fee Prediction */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          AI Fee Prediction
        </h4>
        <div style={{ 
          padding: '16px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>Payment Risk Analysis</div>
            <div style={{ 
              padding: '4px 8px', 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '12px', 
              fontSize: '12px' 
            }}>
              AI Powered
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>High Risk Students</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>12</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Predicted Delays</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>8</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Success Rate</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>94%</div>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', opacity: 0.9 }}>
            💡 AI suggests sending personalized reminders to 5 students with 85%+ payment probability
          </div>
        </div>
      </div>

      {/* Analytics Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          padding: '16px',
          background: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #7dd3fc'
        }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#0369a1', marginBottom: '4px' }}>
            ₹{feeManagement.analytics?.dailyCollection?.reduce((sum, day) => sum + day.amount, 0)?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#0369a1' }}>
            Total Collection (7 days)
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#fef2f2',
          borderRadius: '8px',
          border: '1px solid #fecaca'
        }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>
            {feeManagement.analytics?.pendingFeesDistribution?.reduce((sum, fee) => sum + fee.count, 0) || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#dc2626' }}>
            Pending Fee Cases
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #86efac'
        }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
            ₹{feeManagement.analytics?.refundsIssued?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#166534' }}>
            Refunds Issued
          </div>
        </div>
        <div style={{
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #fbbf24'
        }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#92400e', marginBottom: '4px' }}>
            ₹{feeManagement.analytics?.bankReconciliation?.pendingDeposits?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#92400e' }}>
            Pending Bank Deposits
          </div>
        </div>
      </div>

      {/* Multi-language Invoice Generation */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          Multi-language Invoice Generation
        </h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <select
            value={invoiceLanguage}
            onChange={(e) => setInvoiceLanguage(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
          >
            <option value="english">English</option>
            <option value="hindi">हिंदी (Hindi)</option>
            <option value="gujarati">ગુજરાતી (Gujarati)</option>
          </select>
          <button style={{
            padding: '8px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Generate Invoice
          </button>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Selected: {invoiceLanguage === 'english' ? 'English' : invoiceLanguage === 'hindi' ? 'हिंदी' : 'ગુજરાતી'}
          </div>
        </div>
      </div>

      {/* Transaction Log */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          Recent Transactions
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
          {feeManagement.allTransactions.slice(0, 10).map((txn, idx) => (
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
                  {txn.studentId} - {txn.feeType}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {new Date(txn.date).toLocaleDateString()} • {txn.mode}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                  ₹{txn.amountPaid.toLocaleString()}
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>
                  {txn.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {renderUsersTable()}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {renderAnalytics()}
              {renderEnergyWidget()}
            </div>
          </div>
        );
      case 'classrooms':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {renderClassroomAllocation()}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {renderAnalytics()}
              {renderCollaborationPanel()}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {renderAnalytics()}
            {renderEnergyWidget()}
          </div>
        );
      case 'energy':
        return renderEnergyWidget();
      case 'collaboration':
        return renderCollaborationPanel();
      case 'fees':
        return renderFeeManagement();
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: currentColors.background }}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div style={{ flex: 1, marginLeft: isCollapsed ? '80px' : '280px', transition: 'margin-left 0.3s ease' }}>
        <TopNavbar isCollapsed={isCollapsed} />
        <div style={{ padding: '100px 30px 30px 30px' }}>
          {renderContent()}
        </div>
      </div>
      <AIChatbot />
    </div>
  );
};

export default AdminDashboard;
