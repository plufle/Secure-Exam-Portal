const ClassRoom = require("../models/ClassRoom");
const Student = require("../models/StudentSchema");
const Test = require("../models/Test");
const { encrypt } = require("../utils/crypto");

exports.addClassRoom = async (req, res) => {
    const { name, students } = req.body;
    try {
        const classroom = await ClassRoom.create({ name });
        const studentIds = await Promise.all(
            students.map(async (studentData) => {
                let student = await Student.findOne({ email: studentData.email });

                if (student) {
                    if (!student.classroom.includes(classroom._id)) {
                        student.classroom.push(classroom._id);
                        await student.save();
                    }
                } else {
                    student = await Student.create({
                        regNo: studentData.regno || studentData.regNo,
                        email: studentData.email,
                        classroom: [classroom._id]
                    });
                }

                return student._id;
            })
        );
        classroom.students = studentIds;
        await classroom.save();
        res.status(201).json({ classroom });
    } catch (error) {
        console.error("ADD CLASSROOM ERROR:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ error: `An entry with this ${field} already exists.` });
        }
        res.status(500).json({ error: error.message });
    }
};


exports.getClassRoom = async (req, res) => {
    try {
        const classrooms = await ClassRoom
            .find()
            .populate("students");

        res.status(200).json({ classrooms });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteClassRoom = async (req, res) => {
    const { classroomId } = req.body;

    try {
        // delete classroom
        const classroom = await ClassRoom.findByIdAndDelete(classroomId);

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Remove classroom reference from all its students
        const studentsInClass = await Student.find({ classroom: classroomId });
        await Promise.all(studentsInClass.map(async (student) => {
            student.classroom = student.classroom.filter(
                id => id.toString() !== classroomId.toString()
            );
            if (student.classroom.length === 0) {
                await Student.findByIdAndDelete(student._id);
            } else {
                await student.save();
            }
        }));

        res.status(200).json({
            message: "Classroom and students deleted",
            classroom
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.editClassRoom = async (req, res) => {
    const { classroomId, name, students } = req.body;

    try {
        const classroom = await ClassRoom.findById(classroomId);

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        if (name) {
            classroom.name = name;
        }

        if (students && students.length > 0) {
            // Remove classroom reference from current students
            const currentStudents = await Student.find({ classroom: classroomId });
            await Promise.all(currentStudents.map(async (student) => {
                student.classroom = student.classroom.filter(
                    id => id.toString() !== classroomId.toString()
                );
                if (student.classroom.length === 0) {
                    await Student.findByIdAndDelete(student._id);
                } else {
                    await student.save();
                }
            }));
            
            // Re-create or reuse students based on input
            const studentIds = await Promise.all(
                students.map(async (studentData) => {
                    let student = await Student.findOne({ email: studentData.email });

                    if (student) {
                        student.classroom.push(classroom._id);
                        await student.save();
                    } else {
                        student = await Student.create({
                            regNo: studentData.regno || studentData.regNo,
                            email: studentData.email,
                            classroom: [classroom._id]
                        });
                    }
                    return student._id;
                })
            );
            classroom.students = studentIds;
        }

        await classroom.save();

        res.status(200).json({
            message: "Classroom updated successfully",
            classroom
        });

    } catch (error) {
        console.error("EDIT CLASSROOM ERROR:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ error: `An entry with this ${field} already exists.` });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.addTest = async (req, res) => {
    try {
        const { testName, classroomId, date, time, duration, totalMarks, questions } = req.body;
        const test = await Test.create({
            testName,
            classroomId,
            date,
            time,
            duration,
            totalMarks,
            questions
        });
        res.status(201).json({ test });
    } catch (error) {
        console.error("ADD TEST ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getTests = async (req, res) => {
    try {
        const tests = await Test.find().populate("classroomId", "name"); // populate the classroom name if needed
        res.status(200).json({ tests });
    } catch (error) {
        console.error("GET TESTS ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.editTest = async (req, res) => {
    try {
        const { testId, testName, classroomId, date, time, duration, totalMarks, questions } = req.body;
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        test.testName = testName || test.testName;
        test.classroomId = classroomId || test.classroomId;
        test.date = date || test.date;
        test.time = time || test.time;
        test.duration = duration || test.duration;
        test.totalMarks = totalMarks || test.totalMarks;
        if (questions) {
            test.questions = questions;
        }

        await test.save();
        res.status(200).json({ message: "Test updated successfully", test });
    } catch (error) {
        console.error("EDIT TEST ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTest = async (req, res) => {
    try {
        const { testId } = req.body;
        const test = await Test.findByIdAndDelete(testId);
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }
        res.status(200).json({ message: "Test deleted successfully", test });
    } catch (error) {
        console.error("DELETE TEST ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};