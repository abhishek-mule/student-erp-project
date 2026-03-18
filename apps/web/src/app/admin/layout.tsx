export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950">
            <aside className="w-64 border-r bg-slate-900 border-slate-800 hidden md:block">
                <div className="flex h-14 items-center border-b border-slate-800 px-4">
                    <span className="font-semibold text-lg text-white">
                        Super Admin
                    </span>
                </div>
                <nav className="p-4 space-y-2 text-sm">
                    <a href="/admin" className="block px-3 py-2 rounded hover:bg-slate-800 text-slate-400">Dashboard Hub</a>
                    <a href="/admin/tenants" className="block px-3 py-2 rounded bg-indigo-500/20 text-indigo-400">Tenants Directory</a>
                    <a href="/admin/plans" className="block px-3 py-2 rounded hover:bg-slate-800 text-slate-400">Pricing & Plans</a>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-14 border-b bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6">
                    <div />
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700" />
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-900">
                    {children}
                </div>
            </main>
        </div>
    );
}
