"use client";

import { useState } from "react";

const students = [
    { id: "1", name: "Alice Johnson", roll: "2024CS01" },
    { id: "2", name: "Bob Smith", roll: "2024CS02" },
    { id: "3", name: "Charlie Brown", roll: "2024CS03" },
    { id: "4", name: "Diana Prince", roll: "2024CS04" },
];

export default function MarkEntry({ searchParams }: { searchParams: { courseId: string } }) {
    const [marks, setMarks] = useState<Record<string, number>>({});
    const [gradeType, setGradeType] = useState<string>("ABSOLUTE");

    const submit = () => {
        console.log("Submitting Results:", marks);
        alert("Results entered successfully!");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Enter Exam Results</h1>
                    <p className="text-sm text-slate-500">Course ID: {searchParams.courseId || "CS-101"} | Final Examination</p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={gradeType}
                        onChange={(e) => setGradeType(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded-md text-sm text-white bg-slate-800"
                    >
                        <option value="ABSOLUTE">Absolute Marks</option>
                        <option value="PERCENTAGE">Percentage %</option>
                        <option value="LETTER">Letter Grade</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm pt-4">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Roll Number</th>
                            <th className="px-6 py-4 text-right">Marks (out of 100)</th>
                            <th className="px-6 py-4 text-right">Grade (Calculated)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.name}</td>
                                <td className="px-6 py-4 text-slate-500">{student.roll}</td>
                                <td className="px-6 py-4 text-right pr-6">
                                    <input
                                        type="number"
                                        max={100}
                                        min={0}
                                        value={marks[student.id] || ""}
                                        onChange={(e) => setMarks(p => ({ ...p, [student.id]: Number(e.target.value) }))}
                                        className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-right text-indigo-600 font-bold"
                                        placeholder="0"
                                    />
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-emerald-600">
                                    {(marks[student.id] || 0) >= 90 ? "A+" : (marks[student.id] || 0) >= 80 ? "A" : (marks[student.id] || 0) >= 70 ? "B" : "C"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end pt-4">
                <button onClick={submit} className="px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all font-bold">
                    Finalize Grades
                </button>
            </div>
        </div>
    );
}
