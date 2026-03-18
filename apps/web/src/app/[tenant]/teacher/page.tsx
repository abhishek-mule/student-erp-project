"use client";

import { useState } from "react";

const TeacherDashboard = ({ params }: { params: { tenant: string } }) => {
    const [courses] = useState([
        { id: "1", name: "Computer Science 101", students: 42, activeExams: 1 },
        { id: "2", name: "Data Structures", students: 38, activeExams: 0 },
        { id: "3", name: "Modern Web Frameworks", students: 45, activeExams: 2 },
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Teacher Portal</h1>
                <p className="text-slate-500 mt-1">Manage your classes, mark attendance, and grade students.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {courses.map((course) => (
                    <div key={course.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{course.name}</h3>
                        <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">🧑‍🎓 {course.students} Students</span>
                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500">✍️ {course.activeExams} Pending Exams</span>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <a href={`/${params.tenant}/teacher/attendance?courseId=${course.id}`} className="flex-1 py-2 text-center text-sm font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 transition-colors">Mark Attendance</a>
                            <a href={`/${params.tenant}/teacher/results?courseId=${course.id}`} className="flex-1 py-2 text-center text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Enter Results</a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Upcoming Schedule</h3>
                    <div className="space-y-3">
                        {[
                            { time: "09:00 AM", class: "Data Structures", room: "LT-01" },
                            { time: "11:30 AM", class: "CS 101", room: "Lab A" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <div className="w-20 font-bold text-indigo-600 border-r border-slate-200 mr-4">{item.time}</div>
                                <div>
                                    <div className="font-medium text-slate-900 dark:text-white">{item.class}</div>
                                    <div className="text-xs text-slate-500">{item.room}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Pending Tasks</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded-md" />
                            <span>Prepare Midterm exam for Batch 2024</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded-md" />
                            <span>Upload project guidelines for Web Frameworks</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
