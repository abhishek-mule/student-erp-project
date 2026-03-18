"use client";

import { useState } from "react";

const students = [
    { id: "1", name: "Alice Johnson", roll: "2024CS01" },
    { id: "2", name: "Bob Smith", roll: "2024CS02" },
    { id: "3", name: "Charlie Brown", roll: "2024CS03" },
    { id: "4", name: "Diana Prince", roll: "2024CS04" },
];

export default function AttendanceMarking({ searchParams }: { searchParams: { courseId: string } }) {
    const [attendance, setAttendance] = useState<Record<string, string>>({});

    const toggleAll = (status: string) => {
        const nextAtt: any = {};
        students.forEach(s => nextAtt[s.id] = status);
        setAttendance(nextAtt);
    };

    const submit = () => {
        console.log("Submitting Attendance:", attendance);
        alert("Attendance marked successfully! Submitting to API...");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mark Attendance</h1>
                    <p className="text-sm text-slate-500">Course ID: {searchParams.courseId || "CS-101"} | Today: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => toggleAll('PRESENT')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold">Mark All Present</button>
                    <button onClick={() => toggleAll('ABSENT')} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-semibold">Mark All Absent</button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Student Name</th>
                            <th className="px-6 py-3">Roll Number</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.name}</td>
                                <td className="px-6 py-4 text-slate-500">{student.roll}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3">
                                        {["PRESENT", "ABSENT", "LATE"].map((status) => (
                                            <label key={status} className="flex items-center gap-1 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student.id}`}
                                                    checked={attendance[student.id] === status}
                                                    onChange={() => setAttendance(p => ({ ...p, [student.id]: status }))}
                                                    className="text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className={`text-xs font-medium ${status === 'PRESENT' ? 'text-emerald-600' : status === 'ABSENT' ? 'text-red-600' : 'text-amber-600'}`}>
                                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end pt-4">
                <button onClick={submit} className="px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all font-bold">
                    Submit Attendance
                </button>
            </div>
        </div>
    );
}
