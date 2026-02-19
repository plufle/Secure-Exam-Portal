import "./Test.css";
import { useState } from "react";
import { MdDelete } from "react-icons/md";

function Test() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showViewEditForm, setShowViewEditForm] = useState(false);
    
    // Form State for Adding
    const [testName, setTestName] = useState("");
    const [classroomId, setClassroomId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [totalMarks, setTotalMarks] = useState("");
    const [questions, setQuestions] = useState([{ question: "", marks: "" }]);

    // State for Viewing/Editing
    const [selectedTest, setSelectedTest] = useState(null);

    // Dummy Data
    const dummyTests = [
        { 
            id: 1, 
            testName: "Mid Term Exam", 
            classroomId: "CLASS-101", 
            status: "Scheduled", 
            date: "2024-03-15", 
            time: "10:00", 
            duration: "60", 
            totalMarks: "50",
            questions: [
                { question: "What is React?", marks: "5" },
                { question: "Explain JSX.", marks: "5" }
            ]
        },
        { 
            id: 2, 
            testName: "Final Evaluation", 
            classroomId: "CLASS-102", 
            status: "Completed", 
            date: "2024-04-20", 
            time: "14:00", 
            duration: "90", 
            totalMarks: "100",
            questions: []
        },
    ];

    // Handlers for Add Form
    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", marks: "" }]);
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const resetAddForm = () => {
        setTestName("");
        setClassroomId("");
        setDate("");
        setTime("");
        setDuration("");
        setTotalMarks("");
        setQuestions([{ question: "", marks: "" }]);
        setShowAddForm(false);
    };

    // Handlers for View/Edit Form
    const handleViewEdit = (test) => {
        setSelectedTest({ ...test }); // Clone to avoid direct mutation of dummy data
        setShowViewEditForm(true);
    };

    const handleEditChange = (field, value) => {
        setSelectedTest({ ...selectedTest, [field]: value });
    };

    const handleEditQuestionChange = (index, field, value) => {
        const updatedQuestions = [...selectedTest.questions];
        updatedQuestions[index][field] = value;
        setSelectedTest({ ...selectedTest, questions: updatedQuestions });
    };

    const handleAddQuestionToEdit = () => {
        setSelectedTest({
            ...selectedTest,
            questions: [...selectedTest.questions, { question: "", marks: "" }]
        });
    };

    const handleRemoveQuestionFromEdit = (index) => {
        const updatedQuestions = selectedTest.questions.filter((_, i) => i !== index);
        setSelectedTest({ ...selectedTest, questions: updatedQuestions });
    };

    return (
        <div className="test-container">
            <div className="test-header">
                <div className="test-header-left">
                    <h1 className="test-header-title">Tests</h1>
                    <p className="test-header-text">Manage your tests and assessments</p>
                </div>
                <div className="test-header-right">
                    <button className="test-header-button" onClick={() => setShowAddForm(true)}>Add Test</button>
                </div>
            </div>

            {/* Add Test Form Overlay */}
            {showAddForm && (
                <div className="overlay">
                    <div className="test-form">
                        <div className="test-form-header">
                            <h1 className="test-form-title">Add New Test</h1>
                            <button className="test-form-close" onClick={resetAddForm}>Close</button>
                        </div>
                        <div className="test-form-body">
                            <div className="test-form-row">
                                <input 
                                    type="text" 
                                    className="test-form-input" 
                                    placeholder="Test Name"
                                    value={testName}
                                    onChange={(e) => setTestName(e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    className="test-form-input" 
                                    placeholder="Classroom ID"
                                    value={classroomId}
                                    onChange={(e) => setClassroomId(e.target.value)}
                                />
                            </div>
                            <div className="test-form-row">
                                <input 
                                    type="date" 
                                    className="test-form-input" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <input 
                                    type="time" 
                                    className="test-form-input" 
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                            <div className="test-form-row">
                                <input 
                                    type="number" 
                                    className="test-form-input" 
                                    placeholder="Duration (mins)"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                                <input 
                                    type="number" 
                                    className="test-form-input" 
                                    placeholder="Total Marks"
                                    value={totalMarks}
                                    onChange={(e) => setTotalMarks(e.target.value)}
                                />
                            </div>

                            <div className="questions-section">
                                <div className="questions-header">
                                    <h3>Questions</h3>
                                    <button className="add-question-btn" onClick={handleAddQuestion}>+ Add Question</button>
                                </div>
                                <div className="questions-list-container">
                                    {questions.map((q, index) => (
                                        <div key={index} className="question-item">
                                            <div className="question-row">
                                                <input 
                                                    type="text" 
                                                    className="test-form-input" 
                                                    placeholder={`Question ${index + 1}`}
                                                    value={q.question}
                                                    onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                                                />
                                                <button className="remove-question-btn" onClick={() => handleRemoveQuestion(index)}>
                                                    <MdDelete />
                                                </button>
                                            </div>
                                            <div className="question-row">
                                                 <input 
                                                    type="number" 
                                                    className="test-form-input" 
                                                    placeholder="Marks"
                                                    style={{ width: "100px" }}
                                                    value={q.marks}
                                                    onChange={(e) => handleQuestionChange(index, "marks", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="test-form-footer">
                            <button className="test-form-button cancel" onClick={resetAddForm}>Cancel</button>
                            <button className="test-form-button">Create Test</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View/Edit Test Form Overlay */}
            {showViewEditForm && selectedTest && (
                <div className="overlay">
                    <div className="test-form">
                        <div className="test-form-header">
                            <h1 className="test-form-title">Edit Test Details</h1>
                            <button className="test-form-close" onClick={() => setShowViewEditForm(false)}>Close</button>
                        </div>
                        <div className="test-form-body">
                             <div className="test-form-row">
                                <input 
                                    type="text" 
                                    className="test-form-input" 
                                    placeholder="Test Name"
                                    value={selectedTest.testName}
                                    onChange={(e) => handleEditChange("testName", e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    className="test-form-input" 
                                    placeholder="Classroom ID"
                                    value={selectedTest.classroomId}
                                    onChange={(e) => handleEditChange("classroomId", e.target.value)}
                                />
                            </div>
                            <div className="test-form-row">
                                <input 
                                    type="date" 
                                    className="test-form-input" 
                                    value={selectedTest.date}
                                    onChange={(e) => handleEditChange("date", e.target.value)}
                                />
                                <input 
                                    type="time" 
                                    className="test-form-input" 
                                    value={selectedTest.time}
                                    onChange={(e) => handleEditChange("time", e.target.value)}
                                />
                            </div>
                            <div className="test-form-row">
                                <input 
                                    type="number" 
                                    className="test-form-input" 
                                    placeholder="Duration (mins)"
                                    value={selectedTest.duration}
                                    onChange={(e) => handleEditChange("duration", e.target.value)}
                                />
                                <input 
                                    type="number" 
                                    className="test-form-input" 
                                    placeholder="Total Marks"
                                    value={selectedTest.totalMarks}
                                    onChange={(e) => handleEditChange("totalMarks", e.target.value)}
                                />
                            </div>

                            <div className="questions-section">
                                <div className="questions-header">
                                    <h3>Questions</h3>
                                    <button className="add-question-btn" onClick={handleAddQuestionToEdit}>+ Add Question</button>
                                </div>
                                <div className="questions-list-container">
                                    {selectedTest.questions && selectedTest.questions.map((q, index) => (
                                        <div key={index} className="question-item">
                                            <div className="question-row">
                                                <input 
                                                    type="text" 
                                                    className="test-form-input" 
                                                    placeholder={`Question ${index + 1}`}
                                                    value={q.question}
                                                    onChange={(e) => handleEditQuestionChange(index, "question", e.target.value)}
                                                />
                                                <button className="remove-question-btn" onClick={() => handleRemoveQuestionFromEdit(index)}>
                                                    <MdDelete />
                                                </button>
                                            </div>
                                             <div className="question-row">
                                                 <input 
                                                    type="number" 
                                                    className="test-form-input" 
                                                    placeholder="Marks"
                                                    style={{ width: "100px" }}
                                                    value={q.marks}
                                                    onChange={(e) => handleEditQuestionChange(index, "marks", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="test-form-footer">
                            <button className="test-form-button cancel" onClick={() => setShowViewEditForm(false)}>Cancel</button>
                            <button className="test-form-button">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="test-table">
                <table>
                    <thead>
                        <tr>
                            <th className="test-table-th">Test Name</th>
                            <th className="test-table-th">Classroom ID</th>
                            <th className="test-table-th">Status</th>
                            <th className="test-table-th">Date</th>
                            <th className="test-table-th">Time</th>
                            <th className="test-table-th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyTests.map((test) => (
                            <tr key={test.id} className="test-table-tr">
                                <td className="test-table-td">{test.testName}</td>
                                <td className="test-table-td">{test.classroomId}</td>
                                <td className="test-table-td">{test.status}</td>
                                <td className="test-table-td">{test.date}</td>
                                <td className="test-table-td">{test.time}</td>
                                <td className="test-table-td">
                                    <div className="button-container">
                                        <button className="test-td-button" onClick={() => handleViewEdit(test)}>View</button>
                                        <button className="test-td-button" onClick={() => handleViewEdit(test)}>Edit</button>
                                        <button className="test-td-button delete"><MdDelete /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Test;
