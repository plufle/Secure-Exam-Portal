import React from 'react';
import { Check, X, ArrowLeft } from 'lucide-react';

const Results = ({ results, onBack }) => {
  const score = results?.score || '0/100';
  const accuracy = results?.accuracy || '0%';
  const examTitle = results?.examTitle || 'Exam Results';
  
  const rawQuestions = results?.rawTest?.questions || [];
  const answers = results?.answers || {};

  return (
    <div className="student-dashboard-app flex-col">
      <header className="card" style={{ padding: '1.6rem 3.2rem', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <button onClick={onBack} className="btn-outline flex items-center gap-2" style={{border: 'none', color: 'var(--text-muted)'}}>
          <ArrowLeft size={18} /> Return to Reports
        </button>
      </header>

      <main className="container flex-col" style={styles.main}>
        <div style={{marginBottom: '1.6rem', fontSize: '1.36rem', color: 'var(--text-muted)'}}>
          Reports &gt; Test History &gt; <span style={{color: 'var(--text-main)', fontWeight: 600}}>{examTitle}</span>
        </div>

        <div className="card" style={styles.heroCard}>
          <div style={styles.heroLeft}>
            <div style={styles.completedBadge}><Check size={12} /> COMPLETED</div>
            <h1 style={{fontSize: '4.8rem', fontWeight: 800, margin: '0.8rem 0'}}>
              Score: {score}
            </h1>
            <p style={{fontSize: '1.6rem', color: 'rgba(255,255,255,0.8)', maxWidth: '400px', lineHeight: 1.5, marginBottom: '3.2rem'}}>
              This represents your absolute final score evaluated on submission.
            </p>
          </div>
          
          <div style={styles.heroRight}>
            <div style={{textAlign: 'center', position: 'relative'}}>
              <div style={styles.circleOutline}>
                <div style={{fontSize: '2.4rem', fontWeight: 700}}>{accuracy}</div>
                <div style={{fontSize: '0.96rem', letterSpacing: '1px'}}>ACCURACY</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{marginTop: '3.2rem'}}>
          <div className="flex justify-between items-center" style={{marginBottom: '1.6rem'}}>
            <div>
              <h3 style={{fontSize: '1.92rem', fontWeight: 600, margin: 0}}>Detailed Answer Review</h3>
              <p className="text-muted" style={{fontSize: '1.44rem', margin: '0.48rem 0 0 0'}}>Review your choices against the correct variants.</p>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '1.6rem'}}>
            {rawQuestions.map((q, idx) => {
              const yourAnsIdx = answers[idx];
              const yourAns = yourAnsIdx !== undefined && q.options[yourAnsIdx] ? q.options[yourAnsIdx] : "No Answer provided";
              
              const correctAnsStr = q.answer || q.correctAnswer;
              
              let isCorrect = false;
              if (correctAnsStr == yourAnsIdx || (typeof correctAnsStr === 'string' && correctAnsStr === yourAns)) {
                  isCorrect = true;
              }

              let resolvedCorrectAnswer = correctAnsStr;
              if (!isNaN(parseInt(correctAnsStr, 10)) && q.options[parseInt(correctAnsStr, 10)]) {
                  resolvedCorrectAnswer = q.options[parseInt(correctAnsStr, 10)];
              }

              return (
                  <ReviewItem 
                    key={idx}
                    correct={isCorrect} 
                    qNum={(idx + 1).toString().padStart(2, '0')} 
                    subject="QUESTION" 
                    points={isCorrect ? `+${q.marks || 10} POINTS` : "0 POINTS"} 
                    question={q.question || q.text} 
                    yourAns={yourAns} 
                    correctAns={resolvedCorrectAnswer} 
                    explanation={"Explanations are generally provided by proctors post-evaluation."}
                  />
              );
            })}
             {rawQuestions.length === 0 && (
                 <div className="card text-center text-muted" style={{padding: '4rem'}}>No detailed question data retrieved.</div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

const ReviewItem = ({ correct, qNum, subject, points, question, yourAns, correctAns, explanation }) => (
  <div style={{display: 'flex', gap: '2.4rem', background: 'white', padding: '2.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'}}>
    <div style={{ ...styles.iconBadge, background: correct ? 'var(--success-bg)' : 'var(--danger-bg)', color: correct ? 'var(--success)' : 'var(--danger)' }}>
      {correct ? <Check size={18} /> : <X size={18} />}
    </div>
    <div style={{flex: 1}}>
      <div className="flex justify-between items-center" style={{marginBottom: '0.8rem'}}>
        <div style={{fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px'}}>{subject} {qNum}</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, padding: '0.32rem 0.96rem', borderRadius: '12px', background: correct ? 'var(--success-bg)' : 'var(--danger-bg)', color: correct ? 'var(--success)' : 'var(--danger)' }}>{points}</div>
      </div>
      <h4 style={{fontSize: '1.76rem', fontWeight: 600, marginBottom: '1.6rem', marginTop: 0}}>{question}</h4>
      <div style={{display: 'flex', gap: '1.6rem', marginBottom: '1.6rem'}}>
        <div style={{ flex: 1, padding: '1.6rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${correct ? 'var(--success)' : 'var(--danger)'}`, background: correct ? 'rgba(46, 204, 113, 0.05)' : 'rgba(231, 76, 60, 0.05)' }}>
          <span style={{fontSize: '1.36rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.48rem'}}>Your Answer:</span>
          {yourAns}
        </div>
        {!correct && (
          <div style={{ flex: 1, padding: '1.6rem', borderRadius: 'var(--radius-sm)', border: `1px solid var(--primary)`, background: 'var(--primary-light)' }}>
            <span style={{fontSize: '1.36rem', fontWeight: 600, color: 'var(--primary)', display: 'block', marginBottom: '0.48rem'}}>Correct Answer:</span>
            {correctAns}
          </div>
        )}
      </div>
      <div style={{padding: '2.4rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', marginTop: '1.6rem'}}>
        <span style={{fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', display: 'block', marginBottom: '0.8rem'}}>NOTES</span>
        <p style={{fontSize: '1.44rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0}}>{explanation}</p>
      </div>
    </div>
  </div>
);

const styles = {
  main: { paddingTop: '3.2rem', paddingBottom: '4.8rem', flex: 1 },
  heroCard: { background: 'linear-gradient(135deg, #0A6E7C 0%, #064049 100%)', color: 'white', borderRadius: '2.4rem', padding: '4.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.6rem', marginBottom: '2.4rem', border: 'none' },
  heroLeft: { flex: 1 },
  completedBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.48rem', background: 'rgba(255,255,255,0.2)', padding: '0.64rem 1.28rem', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '1.6rem' },
  heroRight: { display: 'flex', gap: '4.8rem', padding: '3.2rem', background: 'rgba(0,0,0,0.15)', borderRadius: '1.6rem' },
  circleOutline: { width: '120px', height: '120px', borderRadius: '50%', border: '8px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTopColor: 'white' },
  iconBadge: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }
};

export default Results;
