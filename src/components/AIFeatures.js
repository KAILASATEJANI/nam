import React, { useState } from 'react';
import { Brain, TrendingUp, Lightbulb, Target, BarChart3, Clock, Users, BookOpen } from 'lucide-react';

const AIFeatures = () => {
  const [activeFeature, setActiveFeature] = useState('study-gaps');

  const studyGapSuggestions = [
    {
      time: '12:00-14:00',
      suggestion: 'Perfect time for self-study: Review Data Structures concepts',
      priority: 'high',
      confidence: 95,
      reasoning: 'Based on your learning pattern and upcoming exam schedule'
    },
    {
      time: '15:00-17:00',
      suggestion: 'Group study session: Practice algorithms with classmates',
      priority: 'medium',
      confidence: 87,
      reasoning: 'Your performance improves with collaborative learning'
    },
    {
      time: '18:00-20:00',
      suggestion: 'Complete assignments: Database Systems lab report due tomorrow',
      priority: 'high',
      confidence: 92,
      reasoning: 'Deadline approaching and you work best in evening hours'
    }
  ];

  const optimizationSuggestions = [
    {
      type: 'Timetable Optimization',
      suggestion: 'Move Data Structures Lab to Tuesday 2-4 PM to reduce back-to-back classes',
      impact: 'High',
      effort: 'Low',
      confidence: 89,
      benefits: ['Reduces faculty fatigue', 'Improves student focus', 'Better room utilization']
    },
    {
      type: 'Workload Distribution',
      suggestion: 'Distribute Dr. Sarah Wilson\'s workload by assigning Web Dev to Dr. Emily Davis',
      impact: 'High',
      effort: 'Medium',
      confidence: 94,
      benefits: ['Balances faculty workload', 'Prevents burnout', 'Maintains quality']
    },
    {
      type: 'Room Utilization',
      suggestion: 'Add new elective slot on Friday afternoon to improve room utilization',
      impact: 'Medium',
      effort: 'High',
      confidence: 76,
      benefits: ['Increases room usage', 'Provides more options', 'Better resource allocation']
    }
  ];

  const predictiveAnalytics = [
    {
      metric: 'Classroom Demand',
      current: 78,
      predicted: 85,
      trend: 'increasing',
      timeframe: 'Next Month',
      factors: ['New semester starting', 'Increased enrollment', 'New courses added']
    },
    {
      metric: 'Faculty Workload',
      current: 18,
      predicted: 20,
      trend: 'increasing',
      timeframe: 'Next Quarter',
      factors: ['New faculty needed', 'Course expansion', 'Research commitments']
    },
    {
      metric: 'Student Performance',
      current: 85,
      predicted: 88,
      trend: 'improving',
      timeframe: 'End of Semester',
      factors: ['Better time management', 'Improved study gaps', 'Enhanced teaching methods']
    }
  ];

  const renderStudyGapSuggestions = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <Brain className="me-2" />
          AI Study Gap Suggestions
        </h5>
      </div>
      <div className="card-body">
        {studyGapSuggestions.map((gap, index) => (
          <div key={index} className="alert alert-warning d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <div className="fw-bold">{gap.time}</div>
              <div className="mb-2">{gap.suggestion}</div>
              <div className="small text-muted mb-2">{gap.reasoning}</div>
              <div className="d-flex gap-2">
                <span className={`badge ${gap.priority === 'high' ? 'bg-danger' : 'bg-warning'}`}>
                  {gap.priority} priority
                </span>
                <span className="badge bg-info">
                  {gap.confidence}% confidence
                </span>
              </div>
            </div>
            <div className="d-flex flex-column gap-1">
              <button className="btn btn-sm btn-outline-primary">Accept</button>
              <button className="btn btn-sm btn-outline-secondary">Modify</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOptimizationEngine = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <TrendingUp className="me-2" />
          AI Optimization Engine
        </h5>
      </div>
      <div className="card-body">
        {optimizationSuggestions.map((suggestion, index) => (
          <div key={index} className="alert alert-info d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <div className="fw-bold">{suggestion.type}</div>
              <div className="mb-2">{suggestion.suggestion}</div>
              <div className="small mb-2">
                <strong>Benefits:</strong> {suggestion.benefits.join(', ')}
              </div>
              <div className="d-flex gap-2">
                <span className={`badge ${suggestion.impact === 'High' ? 'bg-danger' : suggestion.impact === 'Medium' ? 'bg-warning' : 'bg-success'}`}>
                  {suggestion.impact} Impact
                </span>
                <span className={`badge ${suggestion.effort === 'Low' ? 'bg-success' : suggestion.effort === 'Medium' ? 'bg-warning' : 'bg-danger'}`}>
                  {suggestion.effort} Effort
                </span>
                <span className="badge bg-info">
                  {suggestion.confidence}% confidence
                </span>
              </div>
            </div>
            <div className="d-flex flex-column gap-1">
              <button className="btn btn-sm btn-outline-primary">Apply</button>
              <button className="btn btn-sm btn-outline-secondary">Simulate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPredictiveAnalytics = () => (
    <div className="row">
      {predictiveAnalytics.map((analytic, index) => (
        <div key={index} className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <div className="fw-bold mb-2">{analytic.metric}</div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Current: {analytic.current}%</span>
                <span className="text-success">Predicted: {analytic.predicted}%</span>
              </div>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div 
                  className={`progress-bar ${analytic.trend === 'increasing' ? 'bg-warning' : 'bg-success'}`}
                  style={{ width: `${analytic.predicted}%` }}
                ></div>
              </div>
              <div className="small text-muted mb-2">
                <strong>Trend:</strong> {analytic.trend} ({analytic.timeframe})
              </div>
              <div className="small">
                <strong>Key Factors:</strong>
                <ul className="list-unstyled mt-1">
                  {analytic.factors.map((factor, idx) => (
                    <li key={idx}>• {factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSmartReminders = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <Clock className="me-2" />
          Smart Reminders
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="alert alert-info">
              <div className="fw-bold">Next class in 15 minutes</div>
              <div>Data Structures Lab - CS-103</div>
              <div className="small">Equipment needed: Laptop, Lab manual</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="alert alert-warning">
              <div className="fw-bold">Assignment due tomorrow</div>
              <div>Database Systems Lab Report</div>
              <div className="small">Estimated time: 2 hours</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="alert alert-success">
              <div className="fw-bold">Study session recommended</div>
              <div>Algorithms - Practice problems</div>
              <div className="small">Based on your performance trends</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="alert alert-primary">
              <div className="fw-bold">Room change notification</div>
              <div>CS-101 → CS-201 (Capacity: 50)</div>
              <div className="small">Updated 5 minutes ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeedbackLoop = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <Target className="me-2" />
          Feedback Loop & Learning
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6>Student Feedback</h6>
            <div className="alert alert-success">
              <div className="fw-bold">Timetable optimization suggestion accepted</div>
              <div className="small">Moving lab to Tuesday improved focus by 15%</div>
            </div>
            <div className="alert alert-info">
              <div className="fw-bold">Study gap recommendation followed</div>
              <div className="small">Evening study sessions increased performance by 12%</div>
            </div>
          </div>
          <div className="col-md-6">
            <h6>Faculty Feedback</h6>
            <div className="alert alert-warning">
              <div className="fw-bold">Workload distribution applied</div>
              <div className="small">Faculty satisfaction improved by 20%</div>
            </div>
            <div className="alert alert-primary">
              <div className="fw-bold">Room utilization optimization</div>
              <div className="small">Efficiency increased by 8% across all departments</div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-outline-primary me-2">
            <Lightbulb size={16} className="me-1" />
            Suggest Improvement
          </button>
          <button className="btn btn-outline-success">
            <BarChart3 size={16} className="me-1" />
            View Learning Analytics
          </button>
        </div>
      </div>
    </div>
  );

  const features = [
    { id: 'study-gaps', label: 'Study Gap Suggestions', icon: Brain },
    { id: 'optimization', label: 'Optimization Engine', icon: TrendingUp },
    { id: 'predictive', label: 'Predictive Analytics', icon: BarChart3 },
    { id: 'reminders', label: 'Smart Reminders', icon: Clock },
    { id: 'feedback', label: 'Feedback Loop', icon: Target }
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>AI-Powered Features</h2>
              <p className="text-muted">Intelligent automation and optimization for educational management</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary">
                <Brain size={16} className="me-1" />
                AI Settings
              </button>
              <button className="btn btn-primary">
                <TrendingUp size={16} className="me-1" />
                Run Optimization
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="card mb-4">
            <div className="card-body">
              <ul className="nav nav-tabs" style={{ borderBottom: 'none' }}>
                {features.map(feature => {
                  const IconComponent = feature.icon;
                  return (
                    <li key={feature.id} className="nav-item">
                      <button
                        className={`nav-link ${activeFeature === feature.id ? 'active' : ''}`}
                        onClick={() => setActiveFeature(feature.id)}
                        style={{ border: 'none', background: 'none' }}
                      >
                        <IconComponent size={16} className="me-1" />
                        {feature.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Tab Content */}
          <div className="row">
            <div className="col-12">
              {activeFeature === 'study-gaps' && renderStudyGapSuggestions()}
              {activeFeature === 'optimization' && renderOptimizationEngine()}
              {activeFeature === 'predictive' && renderPredictiveAnalytics()}
              {activeFeature === 'reminders' && renderSmartReminders()}
              {activeFeature === 'feedback' && renderFeedbackLoop()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;
