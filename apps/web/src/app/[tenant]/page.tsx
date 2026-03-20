"use client";

import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { 
    Users, 
    CalendarCheck, 
    CreditCard, 
    TrendingUp, 
    TrendingDown,
    ArrowRight,
    Search,
    MessageSquare,
    ClipboardList,
    MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";

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
            setLiveAttendance("Updating...");
            setTimeout(() => setLiveAttendance("91.4%"), 2000);
        });

        return () => {
            socket.off('attendance.marked');
        };
    }, [socket]);

    const stats = [
        { label: "Total Students", value: "1,248", up: true, diff: "+12%", icon: Users, color: "bg-blue-500/10 text-blue-600" },
        { label: "Total Faculty", value: "84", up: true, diff: "+2%", icon: ClipboardList, color: "bg-purple-500/10 text-purple-600" },
        { label: "Attendance Today", value: liveAttendance, up: true, diff: "+2.2%", icon: CalendarCheck, color: "bg-emerald-500/10 text-emerald-600" },
        { label: "Fees Collected", value: "₹4.2M", up: true, diff: "+18%", icon: CreditCard, color: "bg-amber-500/10 text-amber-600" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Greeting */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
                        {params.tenant} Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Here&apos;s a quick overview of your college performance today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shadow-sm">
                        Export CSV
                    </button>
                    <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-95">
                        New Enrollment
                    </button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((metric, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={metric.label} 
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm flex flex-col hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-xl ${metric.color}`}>
                                <metric.icon className="w-5 h-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${metric.up ? 'text-emerald-500' : 'text-red-500'}`}>
                                {metric.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {metric.diff}
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</h3>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                {metric.value}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Attendance Chart Mockup */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 col-span-4 p-8 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white">Attendance Analytics</h3>
                            <p className="text-xs text-slate-500 mt-1">Comparison over the last 7 days.</p>
                        </div>
                        <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-medium px-3 py-1.5 outline-none">
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                    
                    <div className="h-48 flex items-end justify-between border-b border-slate-100 dark:border-slate-800 gap-2 pb-1 relative">
                        {[45, 62, 58, 85, 92, 77, 90].map((h, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 0.6 + (i * 0.05), duration: 0.8, ease: "backOut" }}
                                className={`w-full max-w-[48px] ${h > 80 ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'} rounded-t-lg relative group`}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <span key={day} className="text-[10px] font-bold text-slate-400 w-12 text-center uppercase tracking-tighter">{day}</span>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Announcements */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 col-span-3 p-8 shadow-sm flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white">Announcements</h3>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="space-y-6 flex-1">
                        {[
                            { title: "Mid-Term Results Out", desc: "Results for CSE & EEE semesters are now visible to students.", icon: MessageSquare, color: "text-blue-500", time: "2h ago" },
                            { title: "Campus Holiday", desc: "Campus will remain closed on 25th March due to local festivities.", icon: Bell, color: "text-amber-500", time: "5h ago" },
                            { title: "Library Overdue Policy", desc: "Updated library fine structure starting from next academic month.", icon: Search, color: "text-slate-400", time: "1d ago" },
                        ].map((post, i) => (
                            <div key={i} className="flex gap-5 group cursor-pointer">
                                <div className={`w-1 h-12 rounded-full ${i === 0 ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'} transition-all group-hover:w-1.5`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-400 transition-colors">{post.title}</h4>
                                        <span className="text-[10px] text-slate-400 font-medium">{post.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{post.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2">
                        View More Announcements
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
