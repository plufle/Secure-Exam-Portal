import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Calendar, ChevronRight } from 'lucide-react';

const Dashboard = ({ user, onSelectExam }) => {
  const [availableExams, setAvailableExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token");
        const examRes = await fetch("http://localhost:5000/api/student/exams", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const examData = await examRes.json();
        
        const resultRes = await fetch("http://localhost:5000/api/student/results", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const resultData = await resultRes.json();
        const completedTestIds = new Set(resultData.results?.map(r => r.testId?._id) || []);

        if (examData.tests) {
            const formatted = examData.tests
                .filter(test => !completedTestIds.has(test._id))
                .map(test => ({
                    id: test._id,
                    title: test.testName || 'Untitled Exam',
                    subject: test.classroomId?.name || 'Subject',
                    duration: test.duration ? `${test.duration} mins` : 'N/A',
                    questions: test.questions ? test.questions.length : 0,
                    date: test.date ? new Date(test.date).toLocaleDateString() : 'N/A',
                    status: 'Available',
                    rawTest: test
                }));
            setAvailableExams(formatted);
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
      }
    };
    fetchExams();
  }, []);

  return (
    <div className="student-dashboard-app">
      <main className="container" style={styles.main}>
        <div style={styles.welcomeSection}>
          <h1 style={{fontSize: '3.2rem', fontWeight: 700}}>Welcome back, {user?.name.split('@')[0]}</h1>
          <p className="text-muted">You have {availableExams.length} upcoming exams scheduled.</p>
        </div>

        <h2 style={{fontSize: '1.92rem', fontWeight: 600, marginBottom: '1.6rem'}}>Available Exams</h2>
        
        <div style={styles.examGrid}>
          {availableExams.map(exam => (
            <div key={exam.id} className="card" style={styles.examCard}>
              <div style={styles.examCardTop}>
                <div>
                  <h3 style={{fontSize: '1.76rem', fontWeight: 600, margin: 0}}>{exam.title}</h3>
                  <span className="text-muted" style={{fontSize: '1.36rem'}}>{exam.subject}</span>
                </div>
                <span style={{
                  padding: '0.32rem 0.96rem', 
                  borderRadius: '12px', 
                  fontSize: '1.2rem', 
                  fontWeight: 600, 
                  background: exam.status === 'Available' ? 'var(--success-bg)' : 'var(--primary-light)',
                  color: exam.status === 'Available' ? 'var(--success)' : 'var(--primary)'
                }}>
                  {exam.status}
                </span>
              </div>
              
              <div style={styles.examCardDetails}>
                <div className="flex items-center gap-2 text-muted" style={{fontSize: '1.44rem'}}><Clock size={16}/> {exam.duration}</div>
                <div className="flex items-center gap-2 text-muted" style={{fontSize: '1.44rem'}}><BookOpen size={16}/> {exam.questions} Questions</div>
                <div className="flex items-center gap-2 text-muted" style={{fontSize: '1.44rem'}}><Calendar size={16}/> {exam.date}</div>
              </div>
              
              <button 
                className="btn-primary w-full" 
                style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                onClick={() => onSelectExam(exam)}
              >
                Proceed to Details <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  main: { paddingTop: '1.6rem', paddingBottom: '4.8rem', flex: 1 },
  welcomeSection: { marginBottom: '4rem' },
  examGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.4rem' },
  examCard: { padding: '2.4rem', display: 'flex', flexDirection: 'column', gap: '2.4rem', transition: 'transform 0.2s', cursor: 'pointer' },
  examCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  examCardDetails: { display: 'flex', flexDirection: 'column', gap: '0.8rem' }
};

export default Dashboard;
