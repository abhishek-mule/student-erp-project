export default function TenantLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { tenant: string };
}) {
    return (
        <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950">
            <aside className="w-64 border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hidden md:block">
                <div className="flex h-14 items-center border-b px-4 border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-lg text-indigo-600 dark:text-indigo-400 capitalize">
                        {params.tenant} Portal
                    </span>
                </div>
                <nav className="p-4 space-y-2 text-sm">
                    {/* Navigation would be dynamically rendered based on the user role */}
                    <div className="font-medium text-slate-500 pb-2 uppercase text-[10px] tracking-widest mt-4">Portals</div>
                    <a href={`/${params.tenant}/dashboard`} className="block px-3 py-2 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">Hub</a>
                    <a href={`/${params.tenant}/teacher`} className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Teacher Portal</a>
                    <a href={`/${params.tenant}/student`} className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Student Portal</a>
                    <a href={`/${params.tenant}/students`} className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Students Directory</a>
                    <a href={`/${params.tenant}/attendance`} className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Attendance</a>
                    <a href={`/${params.tenant}/fees`} className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Fees</a>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-14 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button could go here */}
                    </div>
                    <div className="flex items-center gap-4">
                        {/* User Profile / Clerk UserButton would go here */}
                        <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700" />
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
