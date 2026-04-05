import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Flag, Clock, CheckSquare } from 'lucide-react';

const mockQuestions = Array.from({ length: 50 }, (_, i) => ({
  id: `q${i + 1}`,
  text: i === 13 ? "Which of the following best describes the principle of least astonishment in UI design?" : `Sample question ${i + 1} text goes here?`,
  options: [
    `A) Systems should behave in a way that is consistent with user expectations`,
    `B) UI elements should be as visually complex as possible to engage power users`,
    `C) Placement of navigation elements should be randomized to test user recall`,
    `D) Documentation should be kept minimal to encourage exploratory learning`
  ],
  correctAnswer: 0
}));

const ActiveExam = ({ exam, onSubmit }) => {
  const [currentIdx, setCurrentIdx] = useState(13);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set([0]));
  const [timeLeft, setTimeLeft] = useState(45 * 60 + 22);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}s`;
  };

  const handleSelectOption = (optIdx) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentIdx)) next.delete(currentIdx);
      else next.add(currentIdx);
      return next;
    });
  };

  const prevQuestion = () => setCurrentIdx(p => Math.max(0, p - 1));
  const nextQuestion = () => setCurrentIdx(p => Math.min(mockQuestions.length - 1, p + 1));

  const getStatusColor = (idx) => {
    if (idx === currentIdx) return 'var(--primary)';
    if (flagged.has(idx)) return '#F39C12';
    if (answers[idx] !== undefined) return '#10B981';
    return '#E2E8F0';
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / mockQuestions.length) * 100);

  const handleSubmitClicked = () => {
    const score = Object.keys(answers).length * 10;
    onSubmit({ score, answers, flagged: Array.from(flagged) });
  };

  return (
    <div className="student-dashboard-app flex-col">
      <header className="card" style={styles.topBar}>
        <div className="flex items-center gap-4">
          <div style={styles.appIcon}><CheckSquare size={20} color="var(--primary-dark)" /></div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{exam?.title || 'Quantitative Analysis Exam'}</div>
            <div style={{ fontSize: '1.28rem', color: 'var(--text-muted)' }}>Section 2: Advanced Logic</div>
          </div>
        </div>

        <div style={styles.progressSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.32rem' }}>
            <span>Overall Progress</span>
            <span style={{ color: 'var(--text-muted)' }}>{answeredCount}/{mockQuestions.length}</span>
          </div>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }} />
          </div>
        </div>

        <div style={styles.timerBox}>
          <Clock size={16} /> <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '1.76rem' }}>{formatTime(timeLeft)}</span>
        </div>

        <div className="flex gap-4 items-center">
          <button style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Save Progress</button>
          <button className="btn-primary" onClick={handleSubmitClicked}>Submit Exam</button>
        </div>
      </header>

      <main style={styles.mainContainer}>
        <div style={styles.questionArea}>
          <div className="flex items-center gap-2" style={{ marginBottom: '2.4rem' }}>
            <span style={styles.activeLabel}>● ACTIVE QUESTION</span>
          </div>
          <h2 style={{ fontSize: '2.88rem', fontWeight: 700, marginBottom: '2.4rem', marginTop: 0 }}>Question {currentIdx + 1}</h2>
          <p style={{ fontSize: '1.76rem', marginBottom: '4rem', color: 'var(--text-main)', margin: 0 }}>
            {mockQuestions[currentIdx].text}
          </p>

          <div style={styles.optionsList}>
            {mockQuestions[currentIdx].options.map((option, idx) => (
              <div 
                key={idx} 
                style={{
                  ...styles.optionBox,
                  borderColor: answers[currentIdx] === idx ? 'var(--primary)' : 'var(--border)',
                  background: answers[currentIdx] === idx ? 'var(--primary-light)' : 'transparent',
                }}
                onClick={() => handleSelectOption(idx)}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', border: '2px solid',
                  borderColor: answers[currentIdx] === idx ? 'var(--primary)' : 'var(--border-strong)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {answers[currentIdx] === idx && <div style={{width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)'}} />}
                </div>
                <span>{option}</span>
              </div>
            ))}
          </div>

          <div style={styles.bottomNav}>
            <button onClick={prevQuestion} className="btn-outline flex items-center gap-2" style={{ border: 'none' }} disabled={currentIdx === 0}>
              <ArrowLeft size={18} /> Previous Question
            </button>
            <div className="flex gap-4">
              <button 
                onClick={toggleFlag}
                style={{...styles.flagBtn, background: flagged.has(currentIdx) ? '#FEF5E7' : 'transparent', color: flagged.has(currentIdx) ? '#F39C12' : 'var(--text-muted)'}}
              >
                <Flag size={18} fill={flagged.has(currentIdx) ? "#F39C12" : "none"} /> Flag for Review
              </button>
              <button onClick={nextQuestion} className="btn-primary flex items-center gap-2" disabled={currentIdx === mockQuestions.length - 1}>
                Next Question <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={styles.navigatorArea}>
          <h3 style={{ fontSize: '1.28rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '1.6rem', marginTop: 0 }}>QUESTION NAVIGATOR</h3>
          
          <div style={styles.legend}>
            <div style={styles.legendItem}><div style={{...styles.legendDot, background: '#10B981'}}></div> ANSWERED</div>
            <div style={styles.legendItem}><div style={{...styles.legendDot, background: '#F39C12'}}></div> FLAGGED</div>
            <div style={styles.legendItem}><div style={{...styles.legendDot, background: '#E2E8F0'}}></div> UNVISITED</div>
          </div>

          <div style={styles.grid}>
            {mockQuestions.map((q, idx) => (
              <button 
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                style={{
                  ...styles.gridItem,
                  background: getStatusColor(idx),
                  color: (getStatusColor(idx) === '#10B981' || getStatusColor(idx) === '#F39C12') ? 'white' : 'var(--text-main)',
                  border: idx === currentIdx ? '2px solid var(--primary-dark)' : '1px solid transparent'
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '2.4rem' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '1.36rem'}}>
              <span className="text-muted">Completion Rate</span>
              <span style={{fontWeight: 700}}>{progressPercent}%</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '1.36rem'}}>
              <span className="text-muted">Total Flagged</span>
              <span style={{fontWeight: 700, color: '#F39C12'}}>{flagged.size < 10 ? `0${flagged.size}` : flagged.size}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2.4rem', fontSize: '1.36rem'}}>
              <span className="text-muted">Remaining</span>
              <span style={{fontWeight: 700}}>{mockQuestions.length - answeredCount} Questions</span>
            </div>
            <button className="btn-outline w-full" style={{fontWeight: 600}}>
              Review All Responses
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  topBar: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '1.6rem 3.2rem', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 10 
  },
  appIcon: { width: '40px', height: '40px', background: 'var(--primary-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  progressSection: { width: '300px' },
  progressBarBg: { width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' },
  progressBarFill: { height: '100%', background: 'var(--primary)', transition: 'width 0.3s' },
  timerBox: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1.6rem', background: '#E8F5E9', color: '#2E7D32', borderRadius: 'var(--radius-sm)' },
  mainContainer: { display: 'flex', flex: 1, padding: '3.2rem', gap: '3.2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' },
  questionArea: { flex: 1, paddingBottom: '6.4rem' },
  activeLabel: { fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.48rem 1.28rem', borderRadius: '12px', letterSpacing: '0.5px' },
  optionsList: { display: 'flex', flexDirection: 'column', gap: '1.6rem' },
  optionBox: { 
    display: 'flex', alignItems: 'center', gap: '1.6rem', padding: '2rem 2.4rem', 
    border: '1px solid', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.68rem' 
  },
  bottomNav: { marginTop: '4.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  flagBtn: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.96rem 1.92rem', borderRadius: 'var(--radius-sm)', border: '1px solid currentColor', fontWeight: 500, fontSize: '1.44rem', cursor: 'pointer' },
  navigatorArea: { width: '320px', padding: '2.4rem', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', position: 'sticky', top: '90px' },
  legend: { display: 'flex', gap: '1.6rem', fontSize: '1.12rem', fontWeight: 600, marginBottom: '2.4rem', color: 'var(--text-muted)' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '0.48rem' },
  legendDot: { width: '12px', height: '12px', borderRadius: '2px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.8rem', overflowY: 'auto', paddingBottom: '1.6rem' },
  gridItem: { 
    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', 
    fontWeight: 600, fontSize: '1.36rem', borderRadius: '4px', cursor: 'pointer', transition: 'transform 0.1s' 
  }
};

export default ActiveExam;
