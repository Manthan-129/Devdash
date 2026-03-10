import axios from 'axios'
import { AlertCircle, BarChart3, CalendarDays, CheckCircle2, ChevronDown, ClipboardList, Clock, Filter, FolderKanban, GitPullRequest, Layers, Sparkles } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext.jsx'

const COLUMNS = [
    { key: 'todo', label: 'To-Do', color: 'from-slate-50 to-gray-50', borderColor: 'border-slate-200', dotColor: 'bg-slate-400', headerBg: 'bg-slate-100', icon: ClipboardList, iconColor: 'text-slate-500' },
    { key: 'in-progress', label: 'In Progress', color: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-200', dotColor: 'bg-blue-500', headerBg: 'bg-blue-100', icon: Clock, iconColor: 'text-blue-500' },
    { key: 'in-review', label: 'In Review', color: 'from-amber-50 to-yellow-50', borderColor: 'border-amber-200', dotColor: 'bg-amber-500', headerBg: 'bg-amber-100', icon: GitPullRequest, iconColor: 'text-amber-500' },
    { key: 'completed', label: 'Done', color: 'from-emerald-50 to-green-50', borderColor: 'border-emerald-200', dotColor: 'bg-emerald-500', headerBg: 'bg-emerald-100', icon: CheckCircle2, iconColor: 'text-emerald-500' },
];

const priorityConfig = {
    high: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-400' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-400' },
    low: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-400' },
};

const DashboardOverview = () => {
    const { token, backendUrl, user } = useContext(AppContext);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [kanbanBoard, setKanbanBoard] = useState({ todo: [], 'in-progress': [], 'in-review': [], completed: [] });
    const [stats, setStats] = useState(null);
    const [allTasks, setAllTasks] = useState([]);
    const [filterMember, setFilterMember] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await axios.get(backendUrl + '/api/team/my-teams', { headers: { Authorization: `Bearer ${token}` } });
                if (res.data.success) {
                    setTeams(res.data.teams);
                    if (res.data.teams.length > 0) setSelectedTeam(res.data.teams[0]._id);
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch teams');
            }
            setLoading(false);
        };
        if (token) fetchTeams();
    }, [token]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!selectedTeam) return;
            try {
                const res = await axios.get(backendUrl + `/api/task/team/${selectedTeam}`, { headers: { Authorization: `Bearer ${token}` } });
                if (res.data.success) {
                    setKanbanBoard(res.data.kanbanBoard);
                    setStats(res.data.stats);
                    setAllTasks(res.data.allTasks);
                    const memberMap = {};
                    res.data.allTasks.forEach(t => {
                        const m = t.assignedTo;
                        if (m && !memberMap[m._id]) memberMap[m._id] = m;
                    });
                    setMembers(Object.values(memberMap));
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch tasks');
            }
        };
        if (token && selectedTeam) fetchTasks();
    }, [token, selectedTeam]);

    const filterTasks = (tasks) => {
        return tasks.filter(t => {
            if (filterMember !== 'all' && t.assignedTo._id !== filterMember) return false;
            if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
            return true;
        });
    };

    const getFilteredBoard = () => ({
        todo: filterTasks(kanbanBoard.todo || []),
        'in-progress': filterTasks(kanbanBoard['in-progress'] || []),
        'in-review': filterTasks(kanbanBoard['in-review'] || []),
        completed: filterTasks(kanbanBoard.completed || []),
    });

    const filteredBoard = getFilteredBoard();
    const totalFiltered = Object.values(filteredBoard).reduce((acc, arr) => acc + arr.length, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-blue-200 border-t-blue-600"></div>
                    <p className="text-sm text-gray-400 animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-5 shadow-sm">
                    <FolderKanban size={36} className="text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to DevDash!</h2>
                <p className="text-gray-500 mb-6 max-w-sm">Create your first team or accept an invitation to unlock the full power of project management.</p>
                <button onClick={() => window.location.href = '/dashboard/teams'} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
                    Create a Team
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 min-h-full bg-gradient-to-br from-gray-50/50 to-slate-50/50">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={18} className="text-amber-400" />
                    <span className="text-sm font-medium text-amber-600">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your team's tasks and progress</p>
            </div>

            {/* Controls Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl px-4 py-2.5">
                        <Layers size={16} className="text-blue-500" />
                        <select
                            value={selectedTeam}
                            onChange={e => setSelectedTeam(e.target.value)}
                            className="appearance-none bg-transparent pr-6 text-sm font-semibold text-gray-800 focus:outline-none cursor-pointer"
                        >
                            {teams.map(t => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="text-blue-400 -ml-4 pointer-events-none" />
                    </div>

                    <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${showFilters ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <Filter size={15} />
                        Filters
                        {(filterMember !== 'all' || filterPriority !== 'all') && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        )}
                    </button>

                    {showFilters && (
                        <div className="flex flex-wrap items-center gap-3 animate-fadeIn">
                            <select value={filterMember} onChange={e => setFilterMember(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="all">All Members</option>
                                {members.map(m => (<option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>))}
                            </select>
                            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="all">All Priorities</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                            {(filterMember !== 'all' || filterPriority !== 'all') && (
                                <button onClick={() => { setFilterMember('all'); setFilterPriority('all'); }} className="text-sm font-medium text-blue-600 hover:text-blue-700 px-2 cursor-pointer">Clear all</button>
                            )}
                        </div>
                    )}

                    <div className="ml-auto hidden md:flex items-center gap-2 text-sm text-gray-500">
                        <BarChart3 size={14} />
                        <span><b className="text-gray-800">{totalFiltered}</b> tasks shown</span>
                    </div>
                </div>
            </div>

            {/* Stats Strip */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                    <StatCard label="Total Tasks" value={stats.totalTasks} icon={<Layers size={18} />} gradient="from-gray-50 to-slate-50" iconBg="bg-gray-100" textColor="text-gray-800" />
                    <StatCard label="To-Do" value={stats.byStatus?.todo || 0} icon={<ClipboardList size={18} />} gradient="from-slate-50 to-gray-50" iconBg="bg-slate-100" textColor="text-slate-600" />
                    <StatCard label="In Progress" value={stats.byStatus?.inProgress || 0} icon={<Clock size={18} />} gradient="from-blue-50 to-indigo-50" iconBg="bg-blue-100" textColor="text-blue-600" />
                    <StatCard label="In Review" value={stats.byStatus?.inReview || 0} icon={<GitPullRequest size={18} />} gradient="from-amber-50 to-yellow-50" iconBg="bg-amber-100" textColor="text-amber-600" />
                    <StatCard label="Completed" value={stats.byStatus?.completed || 0} icon={<CheckCircle2 size={18} />} gradient="from-emerald-50 to-green-50" iconBg="bg-emerald-100" textColor="text-emerald-600" />
                </div>
            )}

            {/* KANBAN BOARD */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-5">
                    <FolderKanban size={20} className="text-gray-700" />
                    <h2 className="text-lg font-bold text-gray-800">Kanban Board</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    {COLUMNS.map(col => {
                        const Icon = col.icon;
                        return (
                            <div key={col.key} className={`rounded-2xl border-2 ${col.borderColor} bg-gradient-to-b ${col.color} flex flex-col`}>
                                <div className={`flex items-center gap-2.5 px-5 py-4 rounded-t-2xl ${col.headerBg} border-b ${col.borderColor}`}>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm">
                                        <Icon size={16} className={col.iconColor} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-700">{col.label}</h3>
                                    <span className="ml-auto text-xs font-bold text-gray-500 bg-white/80 px-2.5 py-1 rounded-lg shadow-sm">
                                        {filteredBoard[col.key]?.length || 0}
                                    </span>
                                </div>
                                <div className="p-4 space-y-3 flex-1 min-h-[350px] max-h-[600px] overflow-y-auto">
                                    {(filteredBoard[col.key] || []).map(task => (
                                        <TaskCard key={task._id} task={task} />
                                    ))}
                                    {(filteredBoard[col.key] || []).length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center mb-2 shadow-sm">
                                                <Icon size={18} className="text-gray-300" />
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium">No tasks here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

const StatCard = ({ label, value, icon, gradient, iconBg, textColor }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}>
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center ${textColor}`}>
                {icon}
            </div>
            <div>
                <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
        </div>
    </div>
);

const TaskCard = ({ task }) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
    const pConfig = priorityConfig[task.priority] || priorityConfig.medium;

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 group">
            <div className="flex items-start justify-between gap-2 mb-2.5">
                <h4 className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-blue-700 transition-colors">{task.title}</h4>
                <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap border ${pConfig.bg} ${pConfig.text} ${pConfig.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot}`}></span>
                    {task.priority}
                </span>
            </div>
            {task.description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
            )}
            <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <img src={task.assignedTo?.profilePicture || `https://ui-avatars.com/api/?name=${task.assignedTo?.firstName}+${task.assignedTo?.lastName}&background=6366f1&color=fff&size=24`} alt="" className="w-6 h-6 rounded-lg object-cover ring-2 ring-gray-100" />
                    <span className="text-xs text-gray-600 font-medium">{task.assignedTo?.firstName}</span>
                </div>
                {task.dueDate && (
                    <span className={`text-[11px] flex items-center gap-1 font-medium px-2 py-0.5 rounded-md ${isOverdue ? 'text-red-600 bg-red-50' : 'text-gray-400 bg-gray-50'}`}>
                        {isOverdue && <AlertCircle size={10} />}
                        <CalendarDays size={10} />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                )}
            </div>
        </div>
    );
};

export default DashboardOverview
