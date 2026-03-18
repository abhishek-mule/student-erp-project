"use client";

import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";

const StudentDashboard = ({ params }: { params: { tenant: string } }) => {
    const socket = useSocket(params.tenant);
    const [attendancePercent, setAttendancePercent] = useState(88.5);
    const [recentResults] = useState([
        { subject: "Data Structures", marks: 85, grade: "A", date: "2026-03-10" },
        { subject: "CS 101", marks: 92, grade: "A+", date: "2026-03-05" },
    ]);

    useEffect(() => {
        if (!socket) return;

        socket.on("attendance.marked", (data) => {
            console.log("Real-time Attendance Notification:", data);
            // Visual hint
            setAttendancePercent((prev) => prev + 0.1);
        });

        socket.on("result.published", (data) => {
            alert(`New Result Published: ${data.marks} marks in Exam!`);
        });

        return () => {
            socket.off("attendance.marked");
            socket.off("result.published");
        };
    }, [socket]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">Student Portal</h1>
                <p className="text-slate-500 mt-1">Hello, Alice Johnson. Here is your academic overview.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Attendance Card */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Overall Attendance</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-indigo-600">{attendancePercent.toFixed(1)}%</span>
                        <span className="text-xs text-emerald-500 font-bold mb-1">↑ 0.5%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                        <div
                            className="bg-indigo-600 h-full transition-all duration-1000"
                            style={{ width: `${attendancePercent}%` }}
                        />
                    </div>
                </div>

                {/* Current GPA Mock */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Current GPA</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">3.82</span>
                        <span className="text-xs text-slate-400 mb-1">/ 4.0</span>
                    </div>
                    <div className="mt-4 text-xs text-slate-500 italic">Top 10% of your batch</div>
                </div>

                {/* Pending Fees Mock */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Outstanding Fees</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-red-500">₹0</span>
                        <span className="text-xs text-emerald-500 font-bold mb-1">PAID</span>
                    </div>
                    <button className="mt-4 text-xs font-bold text-indigo-600 hover:underline">View History</button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Results Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-lg">Recent Results</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Subject</th>
                                <th className="px-6 py-3">Marks</th>
                                <th className="px-6 py-3 text-right">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentResults.map((res, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{res.subject}</td>
                                    <td className="px-6 py-4 text-slate-500">{res.marks}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded text-xs font-bold">{res.grade}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Timetable Mock */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Tomorrow's Classes</h3>
                    <div className="space-y-4">
                        {[
                            { time: "08:30 AM", subject: "Discrete Mathematics", room: "LT-2" },
                            { time: "10:00 AM", subject: "Digital Logic", room: "Lab C" },
                            { time: "01:00 PM", subject: "English Comm", room: "Main Hall" },
                        ].map((cls, i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
                                <div className="w-16 text-indigo-600 font-bold text-xs">{cls.time}</div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{cls.subject}</div>
                                    <div className="text-xs text-slate-500">Room: {cls.room}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
