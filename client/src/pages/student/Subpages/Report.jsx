import React, { useState, useEffect } from 'react';
import { FileBarChart2, ChevronRight, TrendingUp } from 'lucide-react';

const Reports = ({ onOpenReport }) => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ avgScore: 0, completed: 0, subjects: 0 });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/student/results", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.results) {
            const formattedResults = data.results.map(res => {
                let dynamicTotal = 0;
                if (res.testId?.questions) {
                    res.testId.questions.forEach(q => dynamicTotal += parseInt(q.marks) || 0);
                }
                const total = dynamicTotal || res.testId?.totalMarks || 100;
                const accuracy = Math.round((res.score / total) * 100) || 0;
                return {
                    id: res._id,
                    examTitle: res.testId?.testName || 'Untitled Exam',
                    subject: res.testId?.classroomId?.name || 'Subject',
                    date: new Date(res.submittedAt).toLocaleDateString(),
                    score: `${res.score != null ? res.score : 0}/${total}`,
                    accuracy: `${accuracy}%`,
                    percentile: 'N/A', // Percentile mock value
                    rawScore: res.score != null ? res.score : 0,
                    rawTotal: total,
                    subjectRaw: res.testId?.classroomId?.name,
                    answers: res.answers,
                    rawTest: res.testId
                };
            });
            setReports(formattedResults.reverse());
            
            // Calculate stats
            if (formattedResults.length > 0) {
                let totalAccuracy = 0;
                const uniqueSubjects = new Set();
                formattedResults.forEach(r => {
                    totalAccuracy += parseInt(r.accuracy);
                    uniqueSubjects.add(r.subjectRaw);
                });
                setStats({
                    avgScore: Math.round(totalAccuracy / formattedResults.length),
                    completed: formattedResults.length,
                    subjects: uniqueSubjects.size
                });
            }
        }
      } catch (err) {
        console.error("Error fetching results:", err);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="student-dashboard-app">
      <main className="container" style={styles.main}>
        <div style={{ marginBottom: '3.2rem' }}>
          <h1 style={{ fontSize: '3.2rem', fontWeight: 700, margin: 0 }}>Performance Reports</h1>
          <p className="text-muted">Review your past scores, accuracy, and detailed analytics.</p>
        </div>

        <div style={{ display: 'flex', gap: '2.4rem', marginBottom: '4rem' }}>
          <div className="card" style={{ flex: 1, padding: '2.4rem', background: 'var(--primary)', color: 'white' }}>
            <div style={{ fontSize: '1.28rem', fontWeight: 600, opacity: 0.8, letterSpacing: '1px' }}>AVERAGE SCORE</div>
            <div style={{ fontSize: '4rem', fontWeight: 700, margin: '0.8rem 0' }}>{stats.avgScore}%</div>
            <div style={{ fontSize: '1.36rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <TrendingUp size={14} /> Analytics based on exams
            </div>
          </div>
          <div className="card" style={{ flex: 1, padding: '2.4rem' }}>
            <div className="text-muted" style={{ fontSize: '1.28rem', fontWeight: 600, letterSpacing: '1px' }}>EXAMS COMPLETED</div>
            <div style={{ fontSize: '4rem', fontWeight: 700, margin: '0.8rem 0', color: 'var(--text-main)' }}>{stats.completed}</div>
            <div className="text-muted" style={{ fontSize: '1.36rem' }}>Across {stats.subjects} Subjects</div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.92rem', fontWeight: 600, marginBottom: '1.6rem' }}>Generated Reports</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          {reports.map(report => (
            <div 
              key={report.id} 
              className="card" 
              style={styles.reportRow}
              onClick={() => onOpenReport(report)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '2.4rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileBarChart2 size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.76rem', fontWeight: 600, marginBottom: '0.32rem', marginTop: 0 }}>{report.examTitle}</h3>
                  <span className="text-muted" style={{ fontSize: '1.36rem' }}>{report.subject} • Generated {report.date}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '4.8rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)' }}>SCORE</div>
                  <div style={{ fontSize: '1.76rem', fontWeight: 700 }}>{report.score}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)' }}>PERCENTILE</div>
                  <div style={{ fontSize: '1.76rem', fontWeight: 700, color: 'var(--primary)' }}>{report.percentile}</div>
                </div>
                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', border: 'none', background: 'var(--bg-app)' }}>
                  View Report <ChevronRight size={16} />
                </button>
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
  reportRow: { 
    padding: '2.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid transparent'
  }
};

export default Reports;
