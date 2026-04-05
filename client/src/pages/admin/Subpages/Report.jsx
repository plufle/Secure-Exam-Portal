import React, { useState, useEffect } from 'react';
import { getAdminReports } from "../../../services/Admin";
import { Check, X, ArrowLeft } from 'lucide-react';

function Reports() {
    const [reports, setReports] = useState([]);
    const [selectedStudentResult, setSelectedStudentResult] = useState(null);

    useEffect(() => {
        getAdminReports().then(res => {
            if (res.reports) {
                setReports(res.reports);
            }
        }).catch(err => console.error("Failed to load admin reports", err));
    }, []);

    if (selectedStudentResult) {
        return <StudentResultReview 
            result={selectedStudentResult} 
            onBack={() => setSelectedStudentResult(null)} 
        />;
    }

    return (
        <div style={{padding: '2rem'}}>
            <h1 style={{fontSize: '2.4rem', marginBottom: '2rem'}}>Exam Reports</h1>
            {reports.map((reportObj, idx) => {
                const { test, results } = reportObj;
                let dynamicTotal = 0;
                if (test.questions) {
                    test.questions.forEach(q => dynamicTotal += parseInt(q.marks) || 0);
                }
                const totalMarks = dynamicTotal || test.totalMarks || 100;
                let average = 0;
                
                if (results.length > 0) {
                    const sum = results.reduce((acc, r) => acc + (r.score != null ? r.score : 0), 0);
                    average = (sum / results.length).toFixed(1);
                }

                return (
                    <div key={test._id} className="card" style={{marginBottom: '2rem', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white'}}>
                       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                           <div>
                               <h2 style={{fontSize: '1.8rem', margin: 0}}>{test.testName}</h2>
                               <span style={{color: '#666', fontSize: '1.4rem'}}>{test.classroomId?.name || 'Unknown Class'}</span>
                           </div>
                           <div style={{display: 'flex', gap: '2rem'}}>
                               <div style={{textAlign: 'center'}}>
                                   <div style={{fontSize: '1.2rem', color: '#666', fontWeight: 600}}>PARTICIPANTS</div>
                                   <div style={{fontSize: '2rem', fontWeight: 700}}>{results.length}</div>
                               </div>
                               <div style={{textAlign: 'center'}}>
                                   <div style={{fontSize: '1.2rem', color: '#666', fontWeight: 600}}>AVERAGE SCORE</div>
                                   <div style={{fontSize: '2rem', fontWeight: 700, color: '#0A6E7C'}}>{results.length > 0 ? `${average}/${totalMarks}` : 'N/A'}</div>
                               </div>
                           </div>
                       </div>

                       {results.length > 0 ? (
                           <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
                               <thead>
                                   <tr style={{borderBottom: '2px solid #eee', textAlign: 'left'}}>
                                       <th style={{padding: '1rem', color: '#666'}}>Student Name</th>
                                       <th style={{padding: '1rem', color: '#666'}}>Email</th>
                                       <th style={{padding: '1rem', color: '#666'}}>Score</th>
                                       <th style={{padding: '1rem', color: '#666'}}>Accuracy</th>
                                       <th style={{padding: '1rem'}}></th>
                                   </tr>
                               </thead>
                               <tbody>
                                   {results.map(r => {
                                       const rawScore = r.score != null ? r.score : 0;
                                       const accuracy = Math.round((rawScore / totalMarks) * 100);
                                       return (
                                           <tr key={r._id} style={{borderBottom: '1px solid #eee'}}>
                                               <td style={{padding: '1rem', fontWeight: 600, color: 'var(--text-main)'}}>{r.studentId?.name || r.studentId?.regNo || 'Unknown'}</td>
                                               <td style={{padding: '1rem', color: '#666'}}>{r.studentId?.email || 'N/A'}</td>
                                               <td style={{padding: '1rem', fontWeight: 700, color: 'var(--text-main)'}}>{rawScore}/{totalMarks}</td>
                                               <td style={{padding: '1rem', color: 'var(--text-main)'}}>{accuracy}%</td>
                                               <td style={{padding: '1rem', textAlign: 'right'}}>
                                                   <button 
                                                        style={{padding: '0.6rem 1.2rem', background: '#0A6E7C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600}}
                                                        onClick={() => setSelectedStudentResult({ resultObj: r, test, score: `${rawScore}/${totalMarks}`, accuracy: `${accuracy}%` })}
                                                   >
                                                       View Report
                                                   </button>
                                               </td>
                                           </tr>
                                       );
                                   })}
                               </tbody>
                           </table>
                       ) : (
                           <div style={{padding: '2rem', textAlign: 'center', color: '#888', background: '#f9f9f9', borderRadius: '4px'}}>
                               No students have submitted results for this test yet.
                           </div>
                       )}
                    </div>
                )
            })}
            {reports.length === 0 && <p style={{color: '#666'}}>No tests or reports found. Ensure students have submitted results.</p>}
        </div>
    );  
}

const StudentResultReview = ({ result, onBack }) => {
    const { resultObj, test, score, accuracy } = result;
    const rawQuestions = test.questions || [];
    const answers = resultObj.answers || {};
    const studentName = resultObj.studentId?.name || resultObj.studentId?.regNo || "Student";

    return (
        <div style={{padding: '2rem'}}>
            <button onClick={onBack} style={{background: 'none', border: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', marginBottom: '2rem', fontSize: '1.4rem'}}>
              <ArrowLeft size={16} /> Back to Class Reports
            </button>

            <div style={{background: 'linear-gradient(135deg, #0A6E7C 0%, #064049 100%)', color: 'white', padding: '3rem', borderRadius: '12px', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                    <h1 style={{margin: 0, fontSize: '3rem'}}>Report: {studentName}</h1>
                    <p style={{opacity: 0.8, fontSize: '1.4rem', marginTop: '0.5rem'}}>{test.testName}</p>
                </div>
                <div style={{display: 'flex', gap: '3rem', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '12px'}}>
                    <div>
                        <div style={{fontSize: '1.2rem', opacity: 0.8, fontWeight: 600}}>SCORE</div>
                        <div style={{fontSize: '2.4rem', fontWeight: 700}}>{score}</div>
                    </div>
                    <div>
                        <div style={{fontSize: '1.2rem', opacity: 0.8, fontWeight: 600}}>ACCURACY</div>
                        <div style={{fontSize: '2.4rem', fontWeight: 700}}>{accuracy}</div>
                    </div>
                </div>
            </div>

            <h3 style={{fontSize: '1.8rem', marginBottom: '2rem', color: 'var(--text-main)'}}>Detailed Answer Timeline</h3>
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
                  <div key={idx} style={{display: 'flex', gap: '2rem', background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd'}}>
                    <div style={{width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isCorrect ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)', color: isCorrect ? '#2ECC71' : '#E74C3C' }}>
                      {isCorrect ? <Check size={18} /> : <X size={18} />}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                        <div style={{fontSize: '1.2rem', fontWeight: 600, color: '#666', letterSpacing: '1px'}}>QUESTION {(idx + 1).toString().padStart(2, '0')}</div>
                        <div style={{fontSize: '1.2rem', fontWeight: 700, padding: '0.4rem 1rem', borderRadius: '12px', background: isCorrect ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)', color: isCorrect ? '#27ae60' : '#c0392b' }}>
                            {isCorrect ? `+${q.marks || 10} MARKS` : '0 MARKS'}
                        </div>
                      </div>
                      <h4 style={{fontSize: '1.6rem', margin: '0 0 1.5rem 0', color: 'var(--text-main)'}}>{q.question || q.text}</h4>
                      
                      <div style={{display: 'flex', gap: '1.5rem'}}>
                        <div style={{ flex: 1, padding: '1.5rem', borderRadius: '8px', border: `1px solid ${isCorrect ? '#2ECC71' : '#E74C3C'}`, background: isCorrect ? 'rgba(46, 204, 113, 0.05)' : 'rgba(231, 76, 60, 0.05)' }}>
                          <span style={{fontSize: '1.3rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)'}}>Student's Answer:</span>
                          <span style={{color: 'var(--text-main)'}}>{yourAns}</span>
                        </div>
                        {!isCorrect && (
                          <div style={{ flex: 1, padding: '1.5rem', borderRadius: '8px', border: `1px solid #0A6E7C`, background: 'rgba(10, 110, 124, 0.05)' }}>
                            <span style={{fontSize: '1.3rem', fontWeight: 600, color: '#0A6E7C', display: 'block', marginBottom: '0.5rem'}}>Correct Answer:</span>
                            <span style={{color: '#0A6E7C'}}>{resolvedCorrectAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
              );
            })}
            {rawQuestions.length === 0 && <p style={{color: '#666'}}>No question metadata saved for this exam.</p>}
            </div>
        </div>
    );
};

export default Reports;