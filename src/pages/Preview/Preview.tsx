import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Toast from '../../components/Toast/Toast';
import testService from '../../services/test';
import { Test } from '../../types';
import {
  CheckCircle2,
  Edit2,
  Clock,
  BookOpen,
  Award,
  Calendar,
  ChevronLeft,
  ChevronDown,
  ChevronsRight,
  ChevronsLeft
} from 'lucide-react';
import './Preview.css';

export const Preview: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [test, setTest] = useState<Test | null>(null);
  const [publishTab, setPublishTab] = useState<'now' | 'schedule'>('now');

  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const [liveDuration, setLiveDuration] = useState('Custom Duration');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchTestData = async () => {
      try {
        const data = await testService.getTestById(id);
        setTest(data);
      } catch {
        setErrorMessage('Failed to load test details.');
      }
    };
    fetchTestData();
  }, [id]);

  const handleConfirmPublish = async () => {
    if (!id) return;
    try {
      setIsPublishing(true);
      await testService.publishTest(id);
      setToastMessage('Test published successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Publishing failed');
    } finally {
      setIsPublishing(false);
    }
  };

  const questionCount = test?.total_questions || (test && Array.isArray(test.questions) ? test.questions.length : 50);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minute.toString().padStart(2, '0');
        times.push(`${hourStr}:${minuteStr}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="layout-root">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
      <Sidebar collapsed={true} />
      <div className={`questions-drawer ${isDrawerOpen ? 'open' : 'closed'}`}>
        <div className="drawer-header">
          <span className="drawer-title">Question creation</span>
          <button
            className="toggle-drawer-btn"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            {isDrawerOpen ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>
        </div>

        {isDrawerOpen && (
          <div className="drawer-content">
            <span className="total-q-label">Total Questions . {questionCount}</span>

            <div className="drawer-q-list">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="drawer-q-item">
                  <div className="q-item-left">
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>Question {idx + 1}</span>
                  </div>
                  <ChevronsRight size={14} color="#94a3b8" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="layout-body">
        <Navbar showLogo={true} />

        <main className="page-content">
          <div className="breadcrumb-bar">
            <span>Test creation</span>
          </div>

          {errorMessage && <div className="error-alert-banner">{errorMessage}</div>}

          <div className="confirmation-header-row">
            <h2 className="confirmation-title">Test created</h2>
            <span className="all-done-badge">
              <CheckCircle2 size={14} color="#10b981" /> All {questionCount} Questions done
            </span>
          </div>
          <div className="test-details-card">
            <div className="details-card-top">
              <span className="chapter-pill">{test?.type || 'Chapter Wise'}</span>
              <button
                className="edit-pencil-btn"
                onClick={() => navigate(`/tests/${id}/edit`)}
              >
                <Edit2 size={16} color="#64748b" />
              </button>
            </div>

            <div className="chapter-header-row">
              <h3 className="chapter-name">{test?.name || 'Chapter 1'}</h3>
              <span className="easy-badge">Easy</span>
            </div>

            <div className="meta-details-grid">
              <div className="meta-left-col">
                <div className="meta-line">
                  <span className="meta-key">Subject</span>
                  <span className="meta-colon">:</span>
                  <span className="meta-val">{test?.subject || 'English'}</span>
                </div>

                <div className="meta-line">
                  <span className="meta-key">Topic</span>
                  <span className="meta-colon">:</span>
                  <div className="tag-pills-row">
                    {(test?.topics || ['Grammar', 'Writing']).map((top, idx) => (
                      <span key={idx} className="yellow-tag">{top}</span>
                    ))}
                  </div>
                </div>

                <div className="meta-line">
                  <span className="meta-key">Sub Topic</span>
                  <span className="meta-colon">:</span>
                  <div className="tag-pills-row">
                    {(test?.sub_topics || ['Application']).map((subTop, idx) => (
                      <span key={idx} className="yellow-tag">{subTop}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="meta-right-box">
                <div className="metric-cell">
                  <Clock size={15} color="#64748b" />
                  <span>{test?.total_time || 60} Min</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-cell">
                  <BookOpen size={15} color="#64748b" />
                  <span>{questionCount} Q's</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-cell">
                  <Award size={15} color="#64748b" />
                  <span>{test?.total_marks || 250} Marks</span>
                </div>
              </div>
            </div>
          </div>
          <div className="publish-tabs-bar">
            <button
              className={`publish-tab-btn ${publishTab === 'now' ? 'active' : ''}`}
              onClick={() => setPublishTab('now')}
            >
              Publish Now
            </button>
            <button
              className={`publish-tab-btn ${publishTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setPublishTab('schedule')}
            >
              Schedule Publish
            </button>
          </div>
          {publishTab === 'schedule' && (
            <div className="schedule-section margin-bottom-24">
              <h4 className="section-heading-title">Select Date and Time</h4>
              <div className="date-time-pickers-row">
                <div className="picker-input-wrapper">
                  <input
                    type="date"
                    className="form-input"
                    placeholder="Select End Date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                  <Calendar size={16} className="picker-icon" color="#94a3b8" />
                </div>

                <div className="picker-input-wrapper">
                  <select
                    className="form-input"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  >
                    <option value="">Select Time</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="picker-icon" color="#94a3b8" />
                </div>
              </div>
            </div>
          )}
          <div className="live-until-section">
            <h4 className="live-until-title">Live Until</h4>
            <p className="live-until-sub">Choose how long this test should remain available on the platform.</p>

            <div className="duration-radios-grid">
              {[
                'Always Available',
                '3 Weeks',
                '1 Week',
                '1 Month',
                '2 Weeks',
                'Custom Duration'
              ].map((item) => (
                <label key={item} className="duration-radio-label">
                  <input
                    type="radio"
                    name="durationGroup"
                    checked={liveDuration === item}
                    onChange={() => setLiveDuration(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <div className="date-time-pickers-row">
              <div className="picker-input-wrapper">
                <input
                  type="date"
                  className="form-input"
                  placeholder="Select End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Calendar size={16} className="picker-icon" color="#94a3b8" />
              </div>

              <div className="picker-input-wrapper">
                <select
                  className="form-input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  <option value="">Select End Time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="picker-icon" color="#94a3b8" />
              </div>
            </div>
          </div>
          <div className="form-bottom-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-next"
              disabled={isPublishing}
              onClick={handleConfirmPublish}
            >
              {isPublishing ? 'Publishing...' : 'Confirm'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Preview;
