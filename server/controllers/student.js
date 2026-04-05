const Student = require("../models/StudentSchema");
const Test = require("../models/Test");
const Result = require("../models/Result");

exports.getExams = async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.user.name }).populate("classroom");
        if (!student) return res.status(404).json({ error: "Student not found." });

        const classroomIds = student.classroom.map(c => c._id);
        const tests = await Test.find({ classroomId: { $in: classroomIds } }).populate("classroomId", "name");

        res.status(200).json({ tests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.submitExam = async (req, res) => {
    try {
        const { testId, answers, flagged } = req.body;
        const student = await Student.findOne({ email: req.user.name });
        if (!student) return res.status(404).json({ error: "Student not found." });

        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ error: "Test not found." });

        let score = 0;
        const testQuestions = test.questions || [];
        
        for (const [qIdx, ansIdx] of Object.entries(answers || {})) {
            const questionIndex = parseInt(qIdx, 10);
            if (testQuestions[questionIndex]) {
                const correctAnswer = testQuestions[questionIndex].answer || testQuestions[questionIndex].correctAnswer;
                // Assuming format where answer might be an index or the string itself. 
                // Wait, need to check AdminTest creation. If it uses index or not. Taking 10 marks per question for now.
                if (correctAnswer == ansIdx || (typeof correctAnswer === 'string' && correctAnswer === testQuestions[questionIndex].options[ansIdx])) {
                    score += parseInt(testQuestions[questionIndex].marks) || 0;
                }
            }
        }

        const newResult = await Result.findOneAndUpdate(
            { studentId: student._id, testId },
            { score, answers, flagged },
            { new: true, upsert: true }
        );

        res.status(201).json({ message: "Exam submitted successfully", score: newResult.score });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getResults = async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.user.name });
        if (!student) return res.status(404).json({ error: "Student not found." });

        const results = await Result.find({ studentId: student._id }).populate({
            path: "testId",
            populate: { path: "classroomId", select: "name" }
        });

        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
