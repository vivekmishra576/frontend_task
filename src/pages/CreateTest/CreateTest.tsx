import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import testService from '../../services/test';
import { Subject, Topic, SubTopic, CreateTestPayload } from '../../types';
import './CreateTest.css';

export const CreateTest: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [testTypeTab, setTestTypeTab] = useState('chapterwise');

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubTopic, setSelectedSubTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Difficult'>('Easy');
  const [duration, setDuration] = useState<number | ''>('');
  const [correctMarks, setCorrectMarks] = useState<number>(5);
  const [wrongMarks, setWrongMarks] = useState<number>(-1);
  const [unattemptMarks, setUnattemptMarks] = useState<number>(0);
  const [noOfQuestions, setNoOfQuestions] = useState<number | ''>('');
  const [totalMarks, setTotalMarks] = useState<number | ''>('');

  const [subjectsList, setSubjectsList] = useState<Subject[]>([]);
  const [topicsList, setTopicsList] = useState<Topic[]>([]);
  const [subTopicsList, setSubTopicsList] = useState<SubTopic[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const subs = await testService.getSubjects();
        setSubjectsList(subs);

        if (isEditMode && id) {
          const testData = await testService.getTestById(id);
          if (testData) {
            setName(testData.name || '');
            setSubject(testData.subject || '');
            setTestTypeTab(testData.type || 'chapterwise');
            if (testData.topics && testData.topics.length > 0) {
              setSelectedTopic(testData.topics[0]);
            }
            if (testData.sub_topics && testData.sub_topics.length > 0) {
              setSelectedSubTopic(testData.sub_topics[0]);
            }
            if (testData.difficulty) {
              const diffStr = testData.difficulty.toLowerCase();
              if (diffStr === 'easy') setDifficulty('Easy');
              else if (diffStr === 'medium') setDifficulty('Medium');
              else setDifficulty('Difficult');
            }
            setDuration(testData.total_time || '');
            setCorrectMarks(testData.correct_marks ?? 5);
            setWrongMarks(testData.wrong_marks ?? -1);
            setUnattemptMarks(testData.unattempt_marks ?? 0);
            setNoOfQuestions(testData.total_questions || '');
            setTotalMarks(testData.total_marks || '');
          }
        }
      } catch (err: any) {
        setErrorMessage('Failed to load subject options or test details.');
      }
    };
    fetchInitialData();
  }, [id, isEditMode]);

  useEffect(() => {
    if (!subject) {
      setTopicsList([]);
      setSelectedTopic('');
      return;
    }
    const fetchTopics = async () => {
      try {
        const topics = await testService.getTopicsBySubject(subject);
        setTopicsList(topics);
      } catch {
        setTopicsList([]);
      }
    };
    fetchTopics();
  }, [subject]);

  useEffect(() => {
    if (!selectedTopic) {
      setSubTopicsList([]);
      setSelectedSubTopic('');
      return;
    }
    const fetchSubTopics = async () => {
      try {
        const subTopics = await testService.getSubTopicsByTopic(selectedTopic);
        setSubTopicsList(subTopics);
      } catch {
        setSubTopicsList([]);
      }
    };
    fetchSubTopics();
  }, [selectedTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!subject) {
      setErrorMessage('Please choose a Subject');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Please enter Test Name');
      return;
    }

    const payload: CreateTestPayload = {
      name: name.trim(),
      type: testTypeTab.toLowerCase(),
      subject,
      topics: selectedTopic ? [selectedTopic] : [],
      sub_topics: selectedSubTopic ? [selectedSubTopic] : [],
      correct_marks: Number(correctMarks),
      wrong_marks: Number(wrongMarks),
      unattempt_marks: Number(unattemptMarks),
      difficulty: difficulty.toLowerCase(),
      total_time: Number(duration) || 60,
      total_marks: Number(totalMarks) || 250,
      total_questions: Number(noOfQuestions) || 50,
      status: "draft",
    };

    try {
      setIsSaving(true);
      let res;
      if (isEditMode && id) {
        res = await testService.updateTest(id, payload);
      } else {
        res = await testService.createTest(payload);
      }

      const testId = res?.id || id;
      navigate(`/tests/${testId}/questions`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Error saving test');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="layout-root">
      <Sidebar />

      <div className="layout-body">
        <Navbar />

        <main className="page-content">
          <div className="breadcrumb-bar">
            <span>Test Creation</span> / <span>Create Test</span> / <span className="active-breadcrumb">{testTypeTab}</span>
          </div>

          <div className="form-card">
            <div className="tab-pill-bar">
              {['Chapterwise', 'PYQ', 'Mock Test'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`tab-btn ${testTypeTab === tab ? 'active' : ''}`}
                  onClick={() => setTestTypeTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {errorMessage && <div className="error-alert-banner">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="create-test-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="">Choose from Drop-down</option>
                    {subjectsList.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Name of Test</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter name of Test"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Topic</label>
                  <select
                    className="form-select"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    disabled={!subject}
                  >
                    <option value="">Choose from Drop-down</option>
                    {topicsList.map((top) => (
                      <option key={top.id} value={top.id}>
                        {top.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Sub Topic</label>
                  <select
                    className="form-select"
                    value={selectedSubTopic}
                    onChange={(e) => setSelectedSubTopic(e.target.value)}
                    disabled={!selectedTopic}
                  >
                    <option value="">Choose from Drop-down</option>
                    {subTopicsList.map((subTop) => (
                      <option key={subTop.id} value={subTop.id}>
                        {subTop.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Enter the time"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Test Difficulty Level</label>
                  <div className="radio-group-row">
                    {(['Easy', 'Medium', 'Difficult'] as const).map((lvl) => (
                      <label key={lvl} className="radio-label">
                        <input
                          type="radio"
                          name="difficultyGroup"
                          checked={difficulty === lvl}
                          onChange={() => setDifficulty(lvl)}
                        />
                        <span>{lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="marking-scheme-section">
                <span className="section-subtitle">Marking Scheme:</span>

                <div className="marking-inputs-grid">
                  <div className="small-input-group">
                    <label className="small-label">Wrong Answer</label>
                    <input
                      type="number"
                      className="form-input text-center"
                      value={wrongMarks}
                      onChange={(e) => setWrongMarks(Number(e.target.value))}
                    />
                  </div>

                  <div className="small-input-group">
                    <label className="small-label">Unattempted</label>
                    <input
                      type="number"
                      className="form-input text-center"
                      value={unattemptMarks}
                      onChange={(e) => setUnattemptMarks(Number(e.target.value))}
                    />
                  </div>

                  <div className="small-input-group">
                    <label className="small-label">Correct Answer</label>
                    <input
                      type="number"
                      className="form-input text-center"
                      value={correctMarks}
                      onChange={(e) => setCorrectMarks(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="small-label">No of Questions</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Ex:250 Marks"
                      value={noOfQuestions}
                      onChange={(e) => setNoOfQuestions(e.target.value ? Number(e.target.value) : '')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="small-label">Total Marks</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Ex:250 Marks"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(e.target.value ? Number(e.target.value) : '')}
                    />
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
                  type="submit"
                  className="btn-next"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : isEditMode ? 'Save' : 'Next'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateTest;
