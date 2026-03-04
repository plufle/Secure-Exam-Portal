const ClassRoom = require("../models/ClassRoom");
const Student = require("../models/StudentSchema");

exports.addClassRoom = async (req, res) => {
    const { name, students } = req.body;
    try {
        console.log("BODY:", req.body);
        console.log("STUDENTS:", req.body.students);
        console.log("TYPE:", typeof req.body.students);
        const classroom = await ClassRoom.create({ name });
        const studentIds = await Promise.all(
            students.map(async (studentData) => {
                console.log("Creating student:", studentData);

                const student = await Student.create({
                    regNo: studentData.regno,
                    email: studentData.email,
                    classroom: classroom._id
                });

                return student._id;
            })
        );
        console.log(studentIds);
        classroom.students = studentIds;
        await classroom.save();
        res.status(201).json({ classroom });
    } catch (error) {
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

        // delete related students
        await Student.deleteMany({ classroom: classroomId });

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
            // Delete old students
            await Student.deleteMany({ classroom: classroomId });
            
            // Re-create new students
            const studentIds = await Promise.all(
                students.map(async (studentData) => {
                    const student = await Student.create({
                        regNo: studentData.regno || studentData.regNo,
                        email: studentData.email,
                        classroom: classroom._id
                    });
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
        res.status(500).json({ error: error.message });
    }
};