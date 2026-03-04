const ClassRoom = require("../models/ClassRoom");
const Student = require("../models/StudentSchema");
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