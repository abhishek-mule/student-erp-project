"use client";

import { useState } from 'react';

const mockStudents = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', roll: 'CS001', batch: '2024' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', roll: 'CS002', batch: '2024' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', roll: 'CS003', batch: '2024' },
];

export default function StudentsPage() {
    const [students] = useState(mockStudents);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student Directory</h1>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium">Add Student</button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Roll No.</th>
                            <th className="px-6 py-3">Batch</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.name}</td>
                                <td className="px-6 py-4 text-slate-500">{student.roll}</td>
                                <td className="px-6 py-4 text-slate-500">{student.batch}</td>
                                <td className="px-6 py-4 text-slate-500">{student.email}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-indigo-600 hover:text-indigo-900 font-medium">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
