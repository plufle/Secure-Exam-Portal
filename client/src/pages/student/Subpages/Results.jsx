import React from 'react';
import { Download, Check, X, TrendingUp, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const topicData = [
  { name: 'Algebra', value: 32, color: '#0A6E7C' },
  { name: 'Calculus', value: 24, color: '#7B2CBF' },
  { name: 'Geometry', value: 20, color: '#F39C12' }
];

const timeData = [
  { name: 'Q1', you: 45, avg: 60 }, { name: 'Q2', you: 30, avg: 45 }, { name: 'Q3', you: 60, avg: 55 },
  { name: 'Q4', you: 40, avg: 65 }, { name: 'Q5', you: 50, avg: 50 }, { name: 'Q6', you: 35, avg: 70 },
  { name: 'Q7', you: 55, avg: 60 }
];

const Results = ({ results, onBack }) => {
  const score = results?.score || '450/500';
  const accuracy = results?.accuracy || '90%';
  const percentile = results?.percentile || '98.5th';
  const examTitle = results?.examTitle || 'Advanced Mathematics (MT-402)';

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
              Score: {typeof score === 'string' ? score : `${score}/500`}
            </h1>
            <p style={{fontSize: '1.6rem', color: 'rgba(255,255,255,0.8)', maxWidth: '400px', lineHeight: 1.5, marginBottom: '3.2rem'}}>
              {percentile} Percentile. Excellent performance! You've outperformed most students globally in this module.
            </p>
            <div className="flex gap-4">
              <button style={styles.btnWhite}><Download size={18} /> Download PDF Report</button>
              <button style={styles.btnTransparent}>Share Results</button>
            </div>
          </div>
          
          <div style={styles.heroRight}>
            <div style={{textAlign: 'center', position: 'relative'}}>
              <div style={styles.circleOutline}>
                <div style={{fontSize: '2.4rem', fontWeight: 700}}>{accuracy}</div>
                <div style={{fontSize: '0.96rem', letterSpacing: '1px'}}>ACCURACY</div>
              </div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3.2rem', fontWeight: 700}}>#124</div>
              <div style={{fontSize: '0.96rem', letterSpacing: '1px', opacity: 0.8}}>GLOBAL RANK</div>
              <div style={{fontSize: '1.2rem', color: '#6EE7B7', fontWeight: 600, marginTop: '0.48rem'}}>+15 Pos</div>
            </div>
          </div>
        </div>

        <div style={styles.tabsContainer}>
          <span style={styles.tabActive}>OVERVIEW</span>
          <span style={styles.tabItem}>TOPIC PROFICIENCY</span>
          <span style={styles.tabItem}>TIME ANALYSIS</span>
          <span style={styles.tabItem}>ANSWER KEY</span>
        </div>

        <div style={styles.chartsRow}>
          <div className="card flex-col" style={styles.chartCard}>
            <h3 style={{fontSize: '1.76rem', fontWeight: 600, padding: '2.4rem 2.4rem 0', margin: 0}}>Topic Proficiency</h3>
            <div style={{height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={topicData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{position: 'absolute', textAlign: 'center'}}>
                <div style={{fontSize: '2.4rem', fontWeight: 700}}>78%</div>
                <div style={{fontSize: '0.96rem', color: 'var(--text-muted)'}}>AVG MASTERY</div>
              </div>
            </div>
            <div style={styles.legendWrapper}>
              {topicData.map(topic => (
                <div key={topic.name} className="flex justify-between" style={{fontSize: '1.36rem', marginBottom: '0.8rem', fontWeight: 500}}>
                  <div className="flex items-center gap-2">
                    <div style={{width: '8px', height: '8px', borderRadius: '50%', background: topic.color}}/> {topic.name}
                  </div>
                  <div>{topic.value}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card flex-col" style={{...styles.chartCard, flex: 2}}>
            <h3 style={{fontSize: '1.76rem', fontWeight: 600, padding: '2.4rem 2.4rem 0', margin: 0}}>Time Spent vs. Average</h3>
            <p className="text-muted" style={{padding: '0 2.4rem', margin: '0.8rem 0', fontSize: '1.36rem'}}>Seconds spent per question compared to global avg</p>
            <div style={{height: '220px', padding: '1.6rem'}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#A0AEC0'}} />
                  <YAxis hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="you" stroke="var(--primary)" strokeWidth={3} dot={{r: 4}} />
                  <Line type="monotone" dataKey="avg" stroke="#E2E8F0" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{padding: '0 2.4rem 2.4rem'}}>
              <div style={{padding: '1.6rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '1.6rem'}}>
                 <div style={{background: 'var(--primary)', color: 'white', padding: '0.8rem', borderRadius: '8px'}}><TrendingUp size={16}/></div>
                 <div>
                   <div style={{fontSize: '1.12rem', fontWeight: 700, color: 'var(--primary-dark)'}}>PACE ANALYSIS</div>
                   <div style={{fontWeight: 600, color: 'var(--primary-dark)'}}>You are 13% faster than average</div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{marginTop: '3.2rem'}}>
          <div className="flex justify-between items-center" style={{marginBottom: '1.6rem'}}>
            <div>
              <h3 style={{fontSize: '1.92rem', fontWeight: 600, margin: 0}}>Detailed Answer Review</h3>
              <p className="text-muted" style={{fontSize: '1.44rem', margin: '0.48rem 0 0 0'}}>Review your choices and understand concepts.</p>
            </div>
            <div style={{display: 'flex', background: 'var(--border)', padding: '0.48rem', borderRadius: 'var(--radius-md)'}}>
              <button style={{background: 'white', padding: '0.64rem 1.6rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '1.36rem', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', border: 'none'}}>All (50)</button>
              <button style={{padding: '0.64rem 1.6rem', borderRadius: 'var(--radius-sm)', fontWeight: 500, fontSize: '1.36rem', color: 'var(--text-muted)', background: 'none', border: 'none'}}>Correct (45)</button>
              <button style={{padding: '0.64rem 1.6rem', borderRadius: 'var(--radius-sm)', fontWeight: 500, fontSize: '1.36rem', color: 'var(--text-muted)', background: 'none', border: 'none'}}>Incorrect (5)</button>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '1.6rem'}}>
            <ReviewItem correct={true} qNum="01" subject="ALGEBRA" points="+10 POINTS" question="Solve the system of equations for x and y: 3x + 2y = 12 and x - y = 1." yourAns="x=2.8, y=1.8" correctAns="x=2.8, y=1.8" explanation="Substitute x = y + 1 from the second equation into the first: 3(y + 1) + 2y = 12..." />
            <ReviewItem correct={false} qNum="14" subject="CALCULUS" points="0 POINTS" question="What is the derivative of f(x) = x³ ln(x)?" yourAns="3x² ln(x)" correctAns="3x² ln(x) + x²" explanation="Use the Product Rule: (uv)' = u'v + uv'. Let u = x³ and v = ln(x). Then u' = 3x² and v' = 1/x..." />
          </div>
        </div>
      </main>
    </div>
  );
};

const ReviewItem = ({ correct, qNum, subject, points, question, yourAns, correctAns, explanation }) => (
  <div style={{display: 'flex', gap: '2.4rem', background: 'white', padding: '2.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'}}>
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0, background: correct ? 'var(--success-bg)' : 'var(--danger-bg)', color: correct ? 'var(--success)' : 'var(--danger)' }}>
      {correct ? <Check size={18} /> : <X size={18} />}
    </div>
    <div style={{flex: 1}}>
      <div className="flex justify-between items-center" style={{marginBottom: '0.8rem'}}>
        <div style={{fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px'}}>QUESTION {qNum} - {subject}</div>
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
        <span style={{fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', display: 'block', marginBottom: '0.8rem'}}>EXPLANATION</span>
        <p style={{fontSize: '1.44rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0}}>{explanation}</p>
      </div>
    </div>
  </div>
);

const styles = {
  main: { paddingTop: '3.2rem', paddingBottom: '4.8rem', flex: 1 },
  heroCard: { background: 'linear-gradient(135deg, #0A6E7C 0%, #064049 100%)', color: 'white', borderRadius: '2.4rem', padding: '4.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.6rem', marginBottom: '2.4rem', border: 'none' },
  heroLeft: { flex: 1 },
  completedBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.48rem', background: 'rgba(255,255,255,0.2)', padding: '0.64rem 1.28rem', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '1px' },
  btnWhite: { background: 'white', color: '#0A6E7C', padding: '1.28rem 2.4rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.8rem', border: 'none', cursor: 'pointer' },
  btnTransparent: { background: 'rgba(255,255,255,0.1)', color: 'white', padding: '1.28rem 2.4rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' },
  heroRight: { display: 'flex', gap: '4.8rem', padding: '3.2rem', background: 'rgba(0,0,0,0.15)', borderRadius: '1.6rem' },
  circleOutline: { width: '120px', height: '120px', borderRadius: '50%', border: '8px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTopColor: 'white' },
  tabsContainer: { display: 'flex', gap: '3.2rem', borderBottom: '1px solid var(--border)', marginBottom: '3.2rem' },
  tabActive: { fontSize: '1.36rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.5px', paddingBottom: '1.6rem', borderBottom: '3px solid var(--primary)', cursor: 'pointer' },
  tabItem: { fontSize: '1.36rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', paddingBottom: '1.6rem', cursor: 'pointer' },
  chartsRow: { display: 'flex', gap: '2.4rem' },
  chartCard: { flex: 1, padding: 0 },
  legendWrapper: { padding: '0 2.4rem 2.4rem' }
};

export default Results;
