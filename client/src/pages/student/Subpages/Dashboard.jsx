import React from 'react';
import { Clock, BookOpen, Calendar, ChevronRight } from 'lucide-react';

const availableExams = [
  { id: 'exam_01', title: 'Quantitative Analysis Exam', subject: 'MT-402', duration: '45 mins', questions: 50, date: 'Oct 24, 2026', status: 'Scheduled' },
  { id: 'exam_02', title: 'Advanced Mathematics', subject: 'MT-505', duration: '90 mins', questions: 100, date: 'Oct 26, 2026', status: 'Available' }
];

const Dashboard = ({ user, onSelectExam }) => {
  return (
    <div className="student-dashboard-app">
      <main className="container" style={styles.main}>
        <div style={styles.welcomeSection}>
          <h1 style={{fontSize: '3.2rem', fontWeight: 700}}>Welcome back, {user?.name.split('@')[0]}</h1>
          <p className="text-muted">You have 2 upcoming exams scheduled for this week.</p>
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
