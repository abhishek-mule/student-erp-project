"use client";

import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";

export default function TenantDashboard({
    params,
}: {
    params: { tenant: string };
}) {
    const socket = useSocket(params.tenant);
    const [liveAttendance, setLiveAttendance] = useState<string>("89.2%");

    useEffect(() => {
        if (!socket) return;

        socket.on('attendance.marked', (data) => {
            console.log("Realtime Attendance:", data);
            // Just a visual example update
            setLiveAttendance("Updating...");
            setTimeout(() => setLiveAttendance("91.4%"), 2000);
        });

        socket.on('dashboard.metric', (data) => {
            console.log("Metric Update:", data);
        });

        return () => {
            socket.off('attendance.marked');
            socket.off('dashboard.metric');
        };
    }, [socket]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">{params.tenant} Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. View your college's performance.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium text-sm transition-colors cursor-pointer shadow-md">
                        Run Report
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Students", value: "1,248", up: true, diff: "+12%" },
                    { label: "Total Faculty", value: "84", up: true, diff: "+2%" },
                    { label: "Attendance Today", value: liveAttendance, up: true, diff: "+2.2%" },
                    { label: "Fees Collected", value: "₹4.2M", up: true, diff: "+18%" },
                ].map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</h3>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</span>
                            <span className={`text-xs font-semibold ${metric.up ? 'text-emerald-500' : 'text-red-500'}`}>{metric.diff}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 col-span-4 p-6 shadow-sm">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-6">Attendance Overview</h3>
                    <div className="h-48 flex items-end justify-between border-b border-l border-slate-200 dark:border-slate-800 pb-2 pl-2">
                        <div className="w-12 bg-indigo-500 rounded-t h-[60%]" />
                        <div className="w-12 bg-indigo-400 rounded-t h-[75%]" />
                        <div className="w-12 bg-indigo-500 rounded-t h-[80%]" />
                        <div className="w-12 bg-indigo-600 rounded-t h-[95%]" />
                        <div className="w-12 bg-indigo-400 rounded-t h-[70%]" />
                        <div className="w-12 bg-emerald-500 rounded-t h-[88%]" />
                        <div className="w-12 justify-self-end bg-indigo-500 rounded-t h-[92%]" />
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 col-span-3 p-6 shadow-sm">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-6">Recent Announcements</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                            <div>
                                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Semester Final Exams</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Schedules are out for the final examinations.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-2 h-2 mt-2 rounded-full bg-amber-500" />
                            <div>
                                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Fee Submission Deadline</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please pay semester fees before 15th April.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
