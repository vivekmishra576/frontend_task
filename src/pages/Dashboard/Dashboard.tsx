import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import testService from '../../services/test';
import { Test } from '../../types';
import { formatDate, getStatusBadgeClass } from '../../utils';
import { Plus, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const fetchedTests = await testService.getTests();
        setTests(fetchedTests);
      } catch {
        setErrorMessage('Failed to load tests.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      await testService.deleteTest(id);
      setTests((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (test.subject && test.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="layout-root">
      <Sidebar />

      <div className="layout-body">
        <Navbar />

        <main className="page-content">
          <div className="dashboard-header-row">
            <div>
              <h1 className="dashboard-title">Test Management Dashboard</h1>
              <p className="dashboard-sub">View, edit, create and publish tests</p>
            </div>

            <button
              className="btn-create-test"
              onClick={() => navigate('/tests/create')}
            >
              <Plus size={16} />
              <span>Create New Test</span>
            </button>
          </div>

          <div className="search-filter-card">
            <div className="search-input-box">
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                className="search-input"
                placeholder="Search test by name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {errorMessage && <div className="error-alert-banner">{errorMessage}</div>}

          {isLoading ? (
            <div className="loading-box">Loading tests...</div>
          ) : (
            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>TEST NAME</th>
                    <th>SUBJECT</th>
                    <th>STATUS</th>
                    <th>CREATED DATE</th>
                    <th>QUESTIONS</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map((test) => (
                    <tr key={test.id}>
                      <td className="font-bold">{test.name}</td>
                      <td>
                        <span className="subject-tag">{test.subject || 'General'}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(test.status)}`}>
                          {test.status || 'Draft'}
                        </span>
                      </td>
                      <td className="text-gray">{formatDate(test.created_at)}</td>
                      <td className="font-bold">
                        {Array.isArray(test.questions)
                          ? test.questions.length
                          : test.total_questions || 0}{' '}
                        Q's
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="table-action-btn"
                            onClick={() => navigate(`/tests/${test.id}/preview`)}
                          >
                            <Eye size={15} color="#4f46e5" />
                          </button>
                          <button
                            className="table-action-btn"
                            onClick={() => navigate(`/tests/${test.id}/edit`)}
                          >
                            <Edit2 size={15} color="#d97706" />
                          </button>
                          <button
                            className="table-action-btn"
                            onClick={() => handleDelete(test.id)}
                          >
                            <Trash2 size={15} color="#ef4444" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
