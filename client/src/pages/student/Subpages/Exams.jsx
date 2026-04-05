import React from 'react';
import { Clock, BookOpen, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';

const availableExams = [
  { id: 'exam_01', title: 'Quantitative Analysis Exam', subject: 'MT-402', duration: '45 mins', questions: 50, date: 'Oct 24, 2026', status: 'Scheduled' },
  { id: 'exam_02', title: 'Advanced Mathematics', subject: 'MT-505', duration: '90 mins', questions: 100, date: 'Oct 26, 2026', status: 'Available' }
];

const completedExams = [
  { id: 'exam_prev_01', title: 'Introduction to Algorithms', subject: 'CS-101', score: '85/100', date: 'Aug 15, 2026' },
  { id: 'exam_prev_02', title: 'Data Structures Practicum', subject: 'CS-201', score: '92/100', date: 'Sep 10, 2026' }
];

const Exams = ({ onSelectExam }) => {
  return (
    <div className="student-dashboard-app">
      <main className="container" style={styles.main}>
        <div style={{ marginBottom: '3.2rem' }}>
          <h1 style={{ fontSize: '3.2rem', fontWeight: 700, margin: 0 }}>My Exams</h1>
          <p className="text-muted">Manage your upcoming and past examinations.</p>
        </div>

        <h2 style={{ fontSize: '1.92rem', fontWeight: 600, marginBottom: '1.6rem' }}>Available & Scheduled Exams</h2>
        <div style={styles.examGrid}>
          {availableExams.map(exam => (
            <div key={exam.id} className="card" style={styles.examCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={{ fontSize: '1.76rem', fontWeight: 600, margin: 0 }}>{exam.title}</h3>
                  <span className="text-muted" style={{ fontSize: '1.36rem' }}>{exam.subject}</span>
                </div>
                <span style={{
                  padding: '0.32rem 0.96rem', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 600,
                  background: exam.status === 'Available' ? 'var(--success-bg)' : 'var(--primary-light)',
                  color: exam.status === 'Available' ? 'var(--success)' : 'var(--primary)'
                }}>
                  {exam.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div className="flex items-center gap-2 text-muted" style={{ fontSize: '1.44rem' }}><Clock size={16}/> {exam.duration}</div>
                <div className="flex items-center gap-2 text-muted" style={{ fontSize: '1.44rem' }}><BookOpen size={16}/> {exam.questions} Questions</div>
                <div className="flex items-center gap-2 text-muted" style={{ fontSize: '1.44rem' }}><Calendar size={16}/> {exam.date}</div>
              </div>
              
              <button 
                className="btn-primary w-full" 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
                onClick={() => onSelectExam(exam)}>
                Proceed to Details <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.92rem', fontWeight: 600, marginTop: '4.8rem', marginBottom: '1.6rem' }}>Previously Completed</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          {completedExams.map(exam => (
            <div key={exam.id} className="card" style={styles.completedRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <CheckCircle2 size={24} />
               </div>
               <div>
                 <h3 style={{ fontSize: '1.68rem', fontWeight: 600, margin: 0 }}>{exam.title}</h3>
                 <span className="text-muted" style={{ fontSize: '1.36rem' }}>{exam.subject} • Completed on {exam.date}</span>
               </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--text-muted)' }}>SCORE</div>
                <div style={{ fontSize: '1.92rem', fontWeight: 700, color: 'var(--primary)' }}>{exam.score}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  main: { paddingTop: '1.6rem', paddingBottom: '4.8rem', flex: 1 },
  examGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.4rem' },
  examCard: { padding: '2.4rem', display: 'flex', flexDirection: 'column', gap: '2.4rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  completedRow: { padding: '2rem 2.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
};

export default Exams;
