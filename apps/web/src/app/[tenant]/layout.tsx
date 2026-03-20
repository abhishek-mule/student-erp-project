"use client";

import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, 
    Users, 
    CalendarCheck, 
    CreditCard, 
    GraduationCap, 
    Settings,
    LogOut,
    Bell,
    Moon,
    Sun,
    Search,
    Menu,
    X
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clearTokens, isAuthenticated } from "@/lib/auth";

export default function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { tenant: string };
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [router]);

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: `/${params.tenant}` },
        { name: "Students", icon: Users, href: `/${params.tenant}/students` },
        { name: "Attendance", icon: CalendarCheck, href: `/${params.tenant}/attendance` },
        { name: "Fees", icon: CreditCard, href: `/${params.tenant}/fees` },
        { name: "Courses", icon: GraduationCap, href: `/${params.tenant}/courses` },
    ];

    const logout = () => {
        clearTokens();
        router.push('/login');
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {!sidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(true)}
                        className="fixed inset-0 bg-black/50 z-20 md:hidden" 
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 bottom-0 z-30 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-xl">
                            {params.tenant[0].toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold tracking-tight capitalize">{params.tenant} ERP</h2>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => (
                            <a 
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === item.href ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-1">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400">
                            <Settings className="w-5 h-5" />
                            Settings
                        </button>
                        <button 
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden">
                            <Menu className="w-5 h-5" />
                        </button>
                        
                        <div className="relative max-w-md w-full hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search everything..."
                                className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-500" />}
                        </button>
                        <div className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
                            <Bell className="w-5 h-5 text-slate-500" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 ml-2" />
                    </div>
                </header>

                {/* Dashboard View */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
