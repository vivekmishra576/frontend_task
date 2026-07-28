import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import testService from '../../services/test';
import questionService from '../../services/question';
import { Question } from '../../types';
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Edit2,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  List,
  ListOrdered,
  Image as ImageIcon,
  Code
} from 'lucide-react';
import './Questions.css';

export const Questions: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [testData, setTestData] = useState<any>(null);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const [questionText, setQuestionText] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [correctOption, setCorrectOption] = useState<'option1' | 'option2' | 'option3' | 'option4'>('option1');
  const [solution, setSolution] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [topic, setTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchTestData = async () => {
      try {
        const fetchedTest = await testService.getTestById(id);
        setTestData(fetchedTest);

        if (fetchedTest.questions && Array.isArray(fetchedTest.questions) && fetchedTest.questions.length > 0) {
          if (typeof fetchedTest.questions[0] === 'string') {
            const fetchedQ = await questionService.fetchBulkQuestions(fetchedTest.questions as string[]);
            setQuestionsList(fetchedQ);
            if (fetchedQ.length > 0) loadQuestionIntoForm(fetchedQ[0]);
          } else {
            const qArr = fetchedTest.questions as Question[];
            setQuestionsList(qArr);
            if (qArr.length > 0) loadQuestionIntoForm(qArr[0]);
          }
        }
      } catch {
        setErrorMessage('Failed to load test questions.');
      }
    };
    fetchTestData();
  }, [id]);

  const loadQuestionIntoForm = (q: Question) => {
    setQuestionText(q.question || '');
    setOption1(q.option1 || '');
    setOption2(q.option2 || '');
    setOption3(q.option3 || '');
    setOption4(q.option4 || '');
    setCorrectOption((q.correct_option as any) || 'option1');
    setSolution(q.explanation || '');
    setDifficulty(q.difficulty || 'Easy');
  };

  const saveCurrentQuestion = () => {
    const currentQ: Question = {
      type: 'mcq',
      question: questionText || `Question ${currentIndex + 1}`,
      option1,
      option2,
      option3,
      option4,
      correct_option: correctOption,
      explanation: solution,
      difficulty,
      test_id: id,
    };

    const updated = [...questionsList];
    updated[currentIndex] = currentQ;
    setQuestionsList(updated);
    return updated;
  };

  const handlePrev = () => {
    saveCurrentQuestion();
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      loadQuestionIntoForm(questionsList[prevIdx]);
    }
  };

  const handleNextQuestion = () => {
    const updated = saveCurrentQuestion();
    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);
    if (updated[nextIdx]) {
      loadQuestionIntoForm(updated[nextIdx]);
    } else {
      setQuestionText('');
      setOption1('');
      setOption2('');
      setOption3('');
      setOption4('');
      setCorrectOption('option1');
      setSolution('');
    }
  };

  const handleDeleteAllEdits = () => {
    setQuestionText('');
    setOption1('');
    setOption2('');
    setOption3('');
    setOption4('');
    setCorrectOption('option1');
    setSolution('');
  };

  const handlePublishClick = async () => {
    const finalQuestions = saveCurrentQuestion();
    if (!id) return;

    try {
      setIsSaving(true);
      if (finalQuestions.length > 0) {
        const createdQ = await questionService.bulkCreateQuestions(finalQuestions);
        const qIds = createdQ.map((q) => q.id!).filter(Boolean);
        await testService.updateTest(id, {
          questions: qIds.length > 0 ? qIds : finalQuestions as any,
          total_questions: finalQuestions.length,
        });
      }
      await testService.publishTest(id);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Error publishing test');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextButtonClick = async () => {
    const finalQuestions = saveCurrentQuestion();
    if (!id) return;

    try {
      setIsSaving(true);
      if (finalQuestions.length > 0) {
        const createdQ = await questionService.bulkCreateQuestions(finalQuestions);
        const qIds = createdQ.map((q) => q.id!).filter(Boolean);
        await testService.updateTest(id, {
          questions: qIds.length > 0 ? qIds : finalQuestions as any,
          total_questions: finalQuestions.length,
        });
      }
      navigate(`/tests/${id}/preview`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Error saving questions');
    } finally {
      setIsSaving(false);
    }
  };

  const totalQCount = Math.max(testData?.total_questions || 50, questionsList.length);

  return (
    <div className="layout-root">
      {/* 1. Main Navigation Sidebar */}
      <Sidebar />

      {/* 2. Inner Question Creation Drawer */}
      <div className={`questions-drawer ${isDrawerOpen ? 'open' : 'closed'}`}>
        <div className="drawer-header">
          <span className="drawer-title">Question creation</span>
          <button
            className="toggle-drawer-btn"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            {isDrawerOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {isDrawerOpen && (
          <div className="drawer-content">
            <span className="total-q-label">Total Questions . {totalQCount}</span>

            <div className="drawer-q-list">
              {Array.from({ length: 6 }).map((_, idx) => {
                const isAdded = idx < Math.max(questionsList.length, currentIndex + 1);
                return (
                  <div
                    key={idx}
                    className={`drawer-q-item ${isAdded ? 'active-q' : 'empty-q'}`}
                    onClick={() => {
                      saveCurrentQuestion();
                      setCurrentIndex(idx);
                      if (questionsList[idx]) loadQuestionIntoForm(questionsList[idx]);
                    }}
                  >
                    <div className="q-item-left">
                      {isAdded ? (
                        <CheckCircle2 size={14} color="#10b981" />
                      ) : (
                        <span className="q-gray-dot"></span>
                      )}
                      <span>Question {idx + 1}</span>
                    </div>
                    <ChevronRight size={14} color="#94a3b8" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Body Content */}
      <div className="layout-body">
        <Navbar hideLogo />

        <main className="page-content">
          <div className="questions-page-top-bar">
            <div className="breadcrumb-bar">
              <span>Test Creation</span> / <span>Create Test</span> / <span className="active-breadcrumb">Chapter Wise</span>
            </div>

            <button
              className="btn-publish-header"
              onClick={handlePublishClick}
              disabled={isSaving}
            >
              Publish
            </button>
          </div>

          {errorMessage && <div className="error-alert-banner">{errorMessage}</div>}

          {/* Test Overview Card */}
          <div className="test-details-card margin-bottom-24">
            <div className="details-card-top">
              <span className="chapter-pill">{testData?.type || 'Chapter Wise'}</span>
              <button
                className="edit-pencil-btn"
                onClick={() => navigate(`/tests/${id}/edit`)}
              >
                <Edit2 size={16} color="#64748b" />
              </button>
            </div>

            <div className="chapter-header-row">
              <h3 className="chapter-name">{testData?.name || 'Chapter 1'}</h3>
              <span className="easy-badge">{testData?.difficulty || 'Easy'}</span>
            </div>

            <div className="meta-details-grid">
              <div className="meta-left-col">
                <div className="meta-line">
                  <span className="meta-key">Subject</span>
                  <span className="meta-colon">:</span>
                  <span className="meta-val">{testData?.subject || 'English'}</span>
                </div>

                <div className="meta-line">
                  <span className="meta-key">Topic</span>
                  <span className="meta-colon">:</span>
                  <div className="tag-pills-row">
                    {(testData?.topics || ['Grammar', 'Writing']).map((top: string, idx: number) => (
                      <span key={idx} className="yellow-tag">{top}</span>
                    ))}
                  </div>
                </div>

                <div className="meta-line">
                  <span className="meta-key">Sub Topic</span>
                  <span className="meta-colon">:</span>
                  <div className="tag-pills-row">
                    {(testData?.sub_topics || ['Application']).map((subTop: string, idx: number) => (
                      <span key={idx} className="yellow-tag">{subTop}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="meta-right-box">
                <div className="metric-cell">
                  <Clock size={15} color="#64748b" />
                  <span>{testData?.total_time || 60} Min</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-cell">
                  <BookOpen size={15} color="#64748b" />
                  <span>{totalQCount} Q's</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-cell">
                  <Award size={15} color="#64748b" />
                  <span>{testData?.total_marks || 250} Marks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Index Bar */}
          <div className="question-index-row">
            <h2 className="question-count-title">
              Question {currentIndex + 1}<span className="total-slash">/{totalQCount}</span>
            </h2>

            <div className="question-action-btns">
              <button className="btn-action-outline">
                <Plus size={14} /> <span>MCQ</span>
              </button>
              <button className="btn-action-outline">
                <Download size={14} /> <span>CSV</span>
              </button>
            </div>
          </div>

          <button
            className="delete-edits-link"
            onClick={handleDeleteAllEdits}
          >
            <Trash2 size={15} color="#ef4444" />
            <span>Delete All Edits</span>
          </button>

          {/* Question Form Card */}
          <div className="form-card">
            {/* Formatting Toolbar */}
            <div className="editor-toolbar">
              <button className="toolbar-btn"><Italic size={14} /></button>
              <button className="toolbar-btn"><Bold size={14} /></button>
              <button className="toolbar-btn"><Underline size={14} /></button>
              <button className="toolbar-btn"><Strikethrough size={14} /></button>
              <button className="toolbar-btn"><Link2 size={14} /></button>
              <span className="toolbar-separator"></span>
              <button className="toolbar-btn"><List size={14} /></button>
              <button className="toolbar-btn"><ListOrdered size={14} /></button>
              <span className="toolbar-separator"></span>
              <button className="toolbar-btn"><ImageIcon size={14} /></button>
              <button className="toolbar-btn"><Code size={14} /></button>
            </div>

            <div className="solution-box-wrapper margin-bottom-24">
              <textarea
                className="form-textarea editor-textarea"
                rows={4}
                placeholder="Type here"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
              <button
                type="button"
                className="trash-icon-btn position-trash"
                onClick={() => setQuestionText('')}
              >
                <Trash2 size={16} color="#cbd5e1" />
              </button>
            </div>

            <span className="section-title-label">Type the options below</span>

            <div className="options-list">
              {[
                { key: 'option1', val: option1, setVal: setOption1 },
                { key: 'option2', val: option2, setVal: setOption2 },
                { key: 'option3', val: option3, setVal: setOption3 },
                { key: 'option4', val: option4, setVal: setOption4 },
              ].map((opt) => {
                const isSelected = correctOption === opt.key;
                return (
                  <div key={opt.key} className="option-item-row">
                    <label className="radio-circle-wrapper">
                      <input
                        type="radio"
                        name="correctOptGroup"
                        checked={isSelected}
                        onChange={() => setCorrectOption(opt.key as any)}
                      />
                    </label>

                    <input
                      type="text"
                      className="form-input flex-1"
                      placeholder="Type Option here"
                      value={opt.val}
                      onChange={(e) => opt.setVal(e.target.value)}
                    />

                    <button
                      type="button"
                      className="trash-icon-btn"
                      onClick={() => opt.setVal('')}
                    >
                      <Trash2 size={16} color="#cbd5e1" />
                    </button>
                  </div>
                );
              })}
            </div>

            <span className="section-title-label margin-top-24">Add Solution</span>

            <div className="solution-box-wrapper">
              <textarea
                className="form-textarea solution-textarea"
                rows={3}
                placeholder="Type here"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />
              <button
                type="button"
                className="trash-icon-btn position-trash"
                onClick={() => setSolution('')}
              >
                <Trash2 size={16} color="#cbd5e1" />
              </button>
            </div>

            <div className="pagination-arrows-row">
              <button
                type="button"
                className="arrow-nav-btn"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="arrow-nav-btn"
                onClick={handleNextQuestion}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="question-settings-section">
              <h4 className="settings-heading">Question settings</h4>

              <div className="form-group margin-bottom-16">
                <label className="form-label">Level of Difficulty</label>
                <select
                  className="form-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="Easy">Select from Drop-down</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Difficult">Difficult</option>
                </select>
              </div>

              <div className="form-group margin-bottom-16">
                <label className="form-label">Topic</label>
                <select
                  className="form-select"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="">Select from Drop-down</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sub-topic</label>
                <select
                  className="form-select"
                  value={subTopic}
                  onChange={(e) => setSubTopic(e.target.value)}
                >
                  <option value="">Select from Drop-down</option>
                </select>
              </div>
            </div>

            <div className="form-bottom-actions space-between">
              <button
                type="button"
                className="btn-exit-danger"
                onClick={() => navigate('/dashboard')}
              >
                Exit Test Creation
              </button>

              <button
                type="button"
                className="btn-next"
                disabled={isSaving}
                onClick={handleNextButtonClick}
              >
                {isSaving ? 'Saving...' : 'Next'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Questions;
