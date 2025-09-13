import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import StudentSidebar from './StudentSidebar';
import { useNavigate } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import AIChatbot from './AIChatbot';
import Card from './ui/Card';
import { Download, TrendingUp } from 'lucide-react';

const StudentFees = () => {
  const { user } = useAuth();
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;
  const { typography, spacing, borderRadius } = useTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const [fees, setFees] = useState({ feeStructure: [], transactions: [], scholarships: [], dueReminders: [], summary: { totalFee: 0, totalPaid: 0, totalScholarship: 0, pendingAmount: 0, paidPercentage: 0 } });
  const [paymentForm, setPaymentForm] = useState({ amount: '', mode: 'UPI', feeType: 'Tuition' });

  const API_BASE = 'http://localhost:5001/api';
  const studentId = user?.studentId || 'CS1234';

  useEffect(() => {
    const loadFees = async () => {
      try {
        const feesRes = await axios.get(`${API_BASE}/student/${studentId}/fees`);
        setFees(feesRes.data || { feeStructure: [], transactions: [], scholarships: [], dueReminders: [], summary: { totalFee: 0, totalPaid: 0, totalScholarship: 0, pendingAmount: 0, paidPercentage: 0 } });
      } catch (e) {
        console.error(e);
      }
    };
    loadFees();
  }, [studentId]);

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

  const renderHeaderBar = () => (
    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>My Fees</div>
      <div style={{ fontSize: '14px', color: '#374151' }}>{user?.email}</div>
    </div>
  );

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .fees-main {
            margin-left: 0 !important;
            padding-top: 64px !important;
          }
          .fees-content {
            padding: 16px !important;
          }
          .fees-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .fees-summary-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 480px) {
          .fees-content {
            padding: 12px !important;
          }
          .fees-summary-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
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
        activeTab={'fees'} 
        setActiveTab={(tabId) => {
          if (tabId === 'fees') {
            navigate('/student/fees');
          } else {
            navigate(`/student/dashboard?tab=${tabId}`);
          }
        }} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      <div className="fees-main" style={{ 
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
        <div className="fees-content" style={{ 
          padding: `${spacing['3xl']} ${spacing.xl} ${spacing.xl} ${spacing.xl}`,
          minHeight: 'calc(100vh - 64px)',
          position: 'relative',
          zIndex: 1
        }}>
          {renderHeaderBar()}
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
                <span>Paid: ₹{fees.summary.totalPaid.toLocaleString()}</span>
                <span>Pending: ₹{fees.summary.pendingAmount.toLocaleString()}</span>
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
                  onChange={(e) => setPaymentForm({...paymentForm, feeType: e.target.value})}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                >
                  {fees.feeStructure.map((fee, idx) => (
                    <option key={idx} value={fee.feeType}>{fee.feeType} - ₹{fee.amount}</option>
                  ))}
                </select>
                <select
                  value={paymentForm.mode}
                  onChange={(e) => setPaymentForm({...paymentForm, mode: e.target.value})}
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
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
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
                  value={`PAYMENT:${studentId}:${fees.summary.pendingAmount}`}
                  size={120}
                  style={{ margin: '0 auto' }}
                />
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                Scan with UPI app to pay ₹{fees.summary.pendingAmount.toLocaleString()}
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button style={{
                padding: '10px 20px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto'
              }}>
                <Download size={16} />
                Download Fee Receipt
              </button>
            </div>
          </Card>
        </div>
      </div>
      <AIChatbot />
    </div>
    </>
  );
};

export default StudentFees;


