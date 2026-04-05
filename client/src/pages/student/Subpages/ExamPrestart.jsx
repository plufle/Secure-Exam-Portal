import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

const ExamPrestart = ({ exam, onStart, onBack }) => {
  const [canStart, setCanStart] = useState(false);
  const [startTimeStr, setStartTimeStr] = useState("");

  useEffect(() => {
    if (!exam || !exam.rawTest) return;
    
    try {
        const dateStr = new Date(exam.rawTest.date).toISOString().split('T')[0];
        const timeStr = exam.rawTest.time || "00:00";
        // Handle timezone issues generally by constructing Date from ISO string
        const examDateTime = new Date(`${dateStr}T${timeStr}`);
        
        setStartTimeStr(examDateTime.toLocaleString(undefined, {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }));

        const checkTime = () => {
            setCanStart(new Date() >= examDateTime);
        };
        
        checkTime();
        const interval = setInterval(checkTime, 10000); // Check every 10s
        return () => clearInterval(interval);
    } catch (err) {
        console.error("Error parsing exam date:", err);
        setCanStart(true);
    }
  }, [exam]);

  if (!exam) return null;

  return (
    <div className="student-dashboard-app flex-col">
      <header className="card" style={styles.header}>
        <button onClick={onBack} className="btn-outline" style={{display: 'flex', alignItems: 'center', gap: '0.8rem', border: 'none', color: 'var(--text-muted)'}}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </header>

      <main className="container flex-col items-center flex" style={styles.main}>
        <div className="card" style={styles.contentCard}>
          <div style={styles.topSection}>
            <div style={styles.badge}>PROCTORED EXAM <ShieldCheck size={14} /></div>
            <h1 style={styles.title}>{exam.title}</h1>
            <p className="text-muted" style={{margin: 0}}>{exam.subject}</p>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <Clock size={24} color="var(--primary)" />
              <div>
                <div style={{fontWeight: 600}}>Duration</div>
                <div className="text-muted">{exam.duration}</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <CheckCircle2 size={24} color="var(--primary)" />
              <div>
                <div style={{fontWeight: 600}}>Total Questions</div>
                <div className="text-muted">{exam.questions} Multiple Choice</div>
              </div>
            </div>
          </div>

          <div style={styles.instructionsSection}>
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.6rem', marginTop: 0}}>
              <AlertTriangle size={18} color="var(--warning)" /> Important Instructions
            </h3>
            <ul style={styles.list}>
              <li>Ensure you have a stable internet connection before starting.</li>
              <li>Please prepare your physical workspace by clearing your desk of unauthorized materials.</li>
              <li>You may be required to share your screen and webcam to verify exam integrity.</li>
              <li>Any attempt to access unauthorized web resources will result in automatic termination.</li>
              <li>This is a secure browser session. Attempts to switch tabs may be recorded.</li>
              <li>You can flag questions to review them later before final submission.</li>
              <li>Once you click submit, you cannot change your answers.</li>
            </ul>
          </div>

          <div style={styles.actionSection}>
            {canStart ? (
                <button className="btn-primary" style={styles.startButton} onClick={onStart}>
                  Start Exam Now
                </button>
            ) : (
                <div style={{...styles.startButton, background: 'var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'not-allowed', padding: '1.6rem 2.4rem', fontWeight: 600}}>
                    <Lock size={20} /> Opens on {startTimeStr}
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  header: { padding: '1.6rem 3.2rem', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' },
  main: { display: 'flex', justifyContent: 'center', paddingTop: '4.8rem', paddingBottom: '4.8rem', flex: 1 },
  contentCard: { width: '100%', maxWidth: '800px', padding: '0', overflow: 'hidden' },
  topSection: { padding: '4rem 4rem 2.4rem', background: 'var(--primary-light)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  badge: { display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.2rem', fontWeight: 700, padding: '0.48rem 1.28rem', background: 'rgba(10, 110, 124, 0.1)', color: 'var(--primary-dark)', borderRadius: '20px', marginBottom: '1.6rem' },
  title: { fontSize: '3.2rem', fontWeight: 700, color: 'var(--primary-dark)', margin: '0 0 0.8rem 0' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '3.2rem 4rem', borderBottom: '1px solid var(--border)' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '1.6rem', justifyContent: 'center' },
  instructionsSection: { padding: '3.2rem 4rem' },
  list: { listStyleType: 'disc', paddingLeft: '2.4rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.8rem', margin: 0 },
  actionSection: { padding: '3.2rem 4rem', background: 'var(--surface-alt)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' },
  startButton: { fontSize: '1.76rem', padding: '1.6rem 4.8rem', borderRadius: 'var(--radius-md)' }
};

export default ExamPrestart;
