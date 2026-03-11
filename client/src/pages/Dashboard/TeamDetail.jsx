import axios from 'axios'
import { AlertCircle, ArrowLeft, ArrowRightLeft, BarChart3, CalendarDays, CheckCircle2, ClipboardList, Clock, Crown, ExternalLink, Filter, Flame, FolderKanban, GitPullRequest, Medal, Plus, Shield, Sparkles, Target, Timer, TrendingUp, Trophy, UserMinus, UserPlus, Users, X, Zap } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext.jsx'

const priorityConfig = {
    high: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-400' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-400' },
    low: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-400' },
};

const COLUMNS = [
    { key: 'todo', label: 'To-Do', color: 'from-slate-50 to-gray-50', borderColor: 'border-slate-200', headerBg: 'bg-slate-100', icon: ClipboardList, iconColor: 'text-slate-500' },
    { key: 'in-progress', label: 'In Progress', color: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-200', headerBg: 'bg-blue-100', icon: Clock, iconColor: 'text-blue-500' },
    { key: 'in-review', label: 'In Review', color: 'from-amber-50 to-yellow-50', borderColor: 'border-amber-200', headerBg: 'bg-amber-100', icon: GitPullRequest, iconColor: 'text-amber-500' },
    { key: 'completed', label: 'Done', color: 'from-emerald-50 to-green-50', borderColor: 'border-emerald-200', headerBg: 'bg-emerald-100', icon: CheckCircle2, iconColor: 'text-emerald-500' },
];

const TeamDetail = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const { token, backendUrl, user } = useContext(AppContext);

    const [team, setTeam] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [kanbanBoard, setKanbanBoard] = useState({});
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('board');
    const [filterMember, setFilterMember] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    // Task creation
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });
    const [creatingTask, setCreatingTask] = useState(false);

    // PR submission
    const [showPRModal, setShowPRModal] = useState(false);
    const [selectedTaskForPR, setSelectedTaskForPR] = useState(null);
    const [prForm, setPrForm] = useState({ githubPRLink: '', message: '' });
    const [submittingPR, setSubmittingPR] = useState(false);

    // Invite modal
    const [showInvite, setShowInvite] = useState(false);
    const [inviteUsername, setInviteUsername] = useState('');
    const [inviteMessage, setInviteMessage] = useState('');
    const [inviting, setInviting] = useState(false);

    // Pull requests for review
    const [pullRequests, setPullRequests] = useState([]);
    const [reviewingPR, setReviewingPR] = useState(null);
    const [reviewNote, setReviewNote] = useState('');

    // Transfer leadership
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferTarget, setTransferTarget] = useState(null);
    const [transferring, setTransferring] = useState(false);

    // Progress report
    const [progressData, setProgressData] = useState(null);
    const [progressLoading, setProgressLoading] = useState(false);

    const isLeader = team?.leader?._id === user?._id;
    const isAdmin = team?.members?.some(m => m.user?._id === user?._id && m.role === 'admin');
    const canManage = isLeader || isAdmin;

    const fetchTeam = async () => {
        try {
            const res = await axios.get(backendUrl + `/api/team/${teamId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) setTeam(res.data.team);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch team');
            navigate('/dashboard/teams');
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await axios.get(backendUrl + `/api/task/team/${teamId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                setTasks(res.data.allTasks);
                setKanbanBoard(res.data.kanbanBoard);
                setStats(res.data.stats);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch tasks');
        }
    };

    const fetchPullRequests = async () => {
        try {
            const res = await axios.get(backendUrl + `/api/pull-request/team/${teamId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) setPullRequests(res.data.pullRequests);
        } catch (err) {
            console.error('Failed to fetch PRs');
        }
    };

    const fetchProgress = async () => {
        setProgressLoading(true);
        try {
            const res = await axios.get(backendUrl + `/api/task/team/${teamId}/progress`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) setProgressData(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch progress report');
        }
        setProgressLoading(false);
    };

    useEffect(() => {
        if (token && teamId) {
            Promise.all([fetchTeam(), fetchTasks(), fetchPullRequests()]).then(() => setLoading(false));
        }
    }, [token, teamId]);

    useEffect(() => {
        if (activeTab === 'progress' && token && teamId && !progressData) {
            fetchProgress();
        }
    }, [activeTab, token, teamId]);

    // Create task handler
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!taskForm.title.trim() || !taskForm.assignedTo) return;
        setCreatingTask(true);
        try {
            const res = await axios.post(
                backendUrl + `/api/task/${teamId}/create/${taskForm.assignedTo}`,
                { title: taskForm.title, description: taskForm.description, priority: taskForm.priority, dueDate: taskForm.dueDate || undefined },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                setShowCreateTask(false);
                setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });
                fetchTasks();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create task');
        }
        setCreatingTask(false);
    };

    // Update task status
    const updateTaskStatus = async (taskId, status) => {
        try {
            const res = await axios.put(backendUrl + `/api/task/${taskId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchTasks();
                fetchPullRequests();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    // Delete task
    const deleteTask = async (taskId) => {
        try {
            const res = await axios.delete(backendUrl + `/api/task/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchTasks();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete task');
        }
    };

    // Submit PR
    const handleSubmitPR = async (e) => {
        e.preventDefault();
        if (!prForm.githubPRLink.trim()) return;
        setSubmittingPR(true);
        try {
            const res = await axios.post(
                backendUrl + `/api/pull-request/${selectedTaskForPR}/create`,
                prForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                setShowPRModal(false);
                setPrForm({ githubPRLink: '', message: '' });
                setSelectedTaskForPR(null);
                fetchTasks();
                fetchPullRequests();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit PR');
        }
        setSubmittingPR(false);
    };

    // Review PR
    const handleReviewPR = async (prId, status) => {
        try {
            const res = await axios.put(
                backendUrl + `/api/pull-request/${prId}/review`,
                { status, reviewNote },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                setReviewingPR(null);
                setReviewNote('');
                fetchTasks();
                fetchPullRequests();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to review PR');
        }
    };

    // Invite member
    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteUsername.trim()) return;
        setInviting(true);
        try {
            const res = await axios.post(
                backendUrl + `/api/team/invite/${teamId}`,
                { username: inviteUsername.trim(), message: inviteMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                setShowInvite(false);
                setInviteUsername('');
                setInviteMessage('');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to invite');
        }
        setInviting(false);
    };

    // Change role
    const changeRole = async (memberId, role) => {
        try {
            const res = await axios.put(backendUrl + `/api/team/${teamId}/change-role/${memberId}`, { role }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchTeam();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change role');
        }
    };

    // Transfer leadership
    const handleTransferLeadership = async () => {
        if (!transferTarget) return;
        setTransferring(true);
        try {
            const res = await axios.put(backendUrl + `/api/team/${teamId}/transfer-leadership/${transferTarget._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                toast.success(res.data.message);
                setShowTransferModal(false);
                setTransferTarget(null);
                fetchTeam();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to transfer leadership');
        }
        setTransferring(false);
    };

    // Remove member
    const removeMember = async (memberId) => {
        try {
            const res = await axios.delete(backendUrl + `/api/team/${teamId}/remove/${memberId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchTeam();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove member');
        }
    };

    // Filter logic
    const filterTasks = (taskList) => {
        return (taskList || []).filter(t => {
            if (filterMember !== 'all' && t.assignedTo?._id !== filterMember) return false;
            if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
            return true;
        });
    };

    const members = team?.members || [];
    const allMembers = members.map(m => m.user).filter(Boolean);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-blue-200 border-t-blue-600"></div>
                    <p className="text-sm text-gray-400 animate-pulse">Loading team...</p>
                </div>
            </div>
        );
    }

    if (!team) return null;

    const pendingPRs = pullRequests.filter(pr => pr.status === 'pending');

    return (
        <div className="p-6 lg:p-8 max-w-full">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/dashboard/teams')} className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <ArrowLeft size={20} className="text-gray-500" />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 truncate">{team.name}</h1>
                        {isLeader && <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-lg"><Crown size={10} /> Leader</span>}
                        {isAdmin && !isLeader && <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg"><Shield size={10} /> Admin</span>}
                    </div>
                    {team.title && <p className="text-sm text-gray-500 mt-0.5">{team.title}</p>}
                </div>
                <div className="flex gap-2">
                    {canManage && (
                        <>
                            <button onClick={() => setShowInvite(true)} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer">
                                <UserPlus size={16} /> Invite
                            </button>
                            <button onClick={() => setShowCreateTask(true)} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all cursor-pointer">
                                <Plus size={16} /> New Task
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-8 bg-gray-100/80 rounded-2xl p-1.5 w-fit">
                {[
                    { key: 'board', label: 'Kanban Board', icon: FolderKanban },
                    { key: 'members', label: `Members (${members.length})`, icon: Users },
                    { key: 'progress', label: 'Progress', icon: BarChart3 },
                    { key: 'prs', label: `Pull Requests${pendingPRs.length > 0 ? ` (${pendingPRs.length})` : ''}`, icon: GitPullRequest },
                ].map(t => {
                    const TabIcon = t.icon;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${activeTab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <TabIcon size={15} />
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* Board Tab */}
            {activeTab === 'board' && (
                <>
                    {/* Filters */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <Filter size={16} className="text-gray-400" />
                            <select value={filterMember} onChange={e => setFilterMember(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="all">All Members</option>
                                {allMembers.map(m => (
                                    <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
                                ))}
                            </select>
                            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="all">All Priorities</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            {(filterMember !== 'all' || filterPriority !== 'all') && (
                                <button onClick={() => { setFilterMember('all'); setFilterPriority('all'); }} className="text-sm font-medium text-blue-600 hover:text-blue-700 px-2 cursor-pointer">Clear all</button>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <p className="text-xs text-gray-500 font-medium">Total</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalTasks}</p>
                            </div>
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <p className="text-xs text-gray-500 font-medium">To-Do</p>
                                <p className="text-2xl font-bold text-slate-600">{stats.byStatus?.todo || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <p className="text-xs text-gray-500 font-medium">In Progress</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.byStatus?.inProgress || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <p className="text-xs text-gray-500 font-medium">In Review</p>
                                <p className="text-2xl font-bold text-amber-600">{stats.byStatus?.inReview || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <p className="text-xs text-gray-500 font-medium">Done</p>
                                <p className="text-2xl font-bold text-emerald-600">{stats.byStatus?.completed || 0}</p>
                            </div>
                        </div>
                    )}

                    {/* Kanban Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        {COLUMNS.map(col => {
                            const colTasks = filterTasks(kanbanBoard[col.key]);
                            const Icon = col.icon;
                            return (
                                <div key={col.key} className={`rounded-2xl border-2 ${col.borderColor} bg-gradient-to-b ${col.color} flex flex-col`}>
                                    <div className={`flex items-center gap-2.5 px-5 py-4 rounded-t-2xl ${col.headerBg} border-b ${col.borderColor}`}>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm">
                                            <Icon size={16} className={col.iconColor} />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-700">{col.label}</h3>
                                        <span className="ml-auto text-xs font-bold text-gray-500 bg-white/80 px-2.5 py-1 rounded-lg shadow-sm">{colTasks.length}</span>
                                    </div>
                                    <div className="p-4 space-y-3 flex-1 min-h-[350px] max-h-[600px] overflow-y-auto">
                                        {colTasks.map(task => (
                                            <TaskCard
                                                key={task._id}
                                                task={task}
                                                canManage={canManage}
                                                userId={user?._id}
                                                onStatusChange={updateTaskStatus}
                                                onDelete={deleteTask}
                                                onSubmitPR={(taskId) => { setSelectedTaskForPR(taskId); setShowPRModal(true); }}
                                            />
                                        ))}
                                        {colTasks.length === 0 && (
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
                </>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
                <div className="space-y-2.5 max-w-2xl">
                    {/* Leader */}
                    <div className="flex items-center justify-between bg-white rounded-2xl border border-yellow-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                        <div className="flex items-center gap-3">
                            <img src={team.leader?.profilePicture || `https://ui-avatars.com/api/?name=${team.leader?.firstName}+${team.leader?.lastName}&background=eab308&color=fff`} alt="" className="w-11 h-11 rounded-xl object-cover ring-2 ring-yellow-100" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">{team.leader?.firstName} {team.leader?.lastName}</p>
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-0.5 rounded-lg"><Crown size={10} /> Leader</span>
                                </div>
                                <p className="text-xs text-gray-500">@{team.leader?.username}</p>
                            </div>
                        </div>
                    </div>

                    {/* Members */}
                    {members.filter(m => m.user?._id !== team.leader?._id).map(m => (
                        <div key={m.user?._id} className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                            <div className="flex items-center gap-3">
                                <img src={m.user?.profilePicture || `https://ui-avatars.com/api/?name=${m.user?.firstName}+${m.user?.lastName}&background=6366f1&color=fff`} alt="" className="w-11 h-11 rounded-xl object-cover ring-2 ring-gray-100" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{m.user?.firstName} {m.user?.lastName}</p>
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${m.role === 'admin' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                                            {m.role === 'admin' && <Shield size={10} className="inline mr-0.5" />}{m.role}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">@{m.user?.username}</p>
                                </div>
                            </div>
                            {isLeader && m.user?._id !== user?._id && (
                                <div className="flex items-center gap-2">
                                    <select
                                        value={m.role}
                                        onChange={e => changeRole(m.user?._id, e.target.value)}
                                        className="text-xs font-medium border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button onClick={() => { setTransferTarget(m.user); setShowTransferModal(true); }} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-xl transition-colors cursor-pointer" title="Transfer Leadership">
                                        <ArrowRightLeft size={14} />
                                    </button>
                                    <button onClick={() => removeMember(m.user?._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
                                        <UserMinus size={14} />
                                    </button>
                                </div>
                            )}
                            {isAdmin && !isLeader && m.role === 'member' && m.user?._id !== user?._id && (
                                <button onClick={() => removeMember(m.user?._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
                                    <UserMinus size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
                <div className="space-y-8">
                    {progressLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-blue-100 border-t-blue-600"></div>
                                    <BarChart3 size={16} className="text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <p className="text-sm text-gray-400 font-medium animate-pulse">Crunching numbers...</p>
                            </div>
                        </div>
                    ) : progressData ? (
                        <>
                            {/* Hero Summary Banner */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 p-7 shadow-xl shadow-blue-200/30">
                                <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                                <TrendingUp size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">Team Progress</h3>
                                                <p className="text-xs text-blue-100">{progressData.teamSummary.membersCount} members · {progressData.teamSummary.totalTasks} tasks tracked</p>
                                            </div>
                                        </div>
                                        <button onClick={fetchProgress} className="text-xs font-semibold text-white/90 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 hover:bg-white/25 transition-all cursor-pointer">
                                            Refresh
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* Big Circular Completion */}
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center">
                                            <div className="relative w-20 h-20 mb-2">
                                                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
                                                    <circle cx="40" cy="40" r="34" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 34}`} strokeDashoffset={`${2 * Math.PI * 34 * (1 - progressData.teamSummary.completionRate / 100)}`} className="transition-all duration-1000" />
                                                </svg>
                                                <span className="absolute inset-0 flex items-center justify-center text-xl font-extrabold text-white">{progressData.teamSummary.completionRate}%</span>
                                            </div>
                                            <p className="text-[11px] text-blue-100 font-semibold tracking-wide uppercase">Completion</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center text-center">
                                            <div className="w-11 h-11 rounded-xl bg-emerald-400/20 flex items-center justify-center mb-2">
                                                <CheckCircle2 size={20} className="text-emerald-300" />
                                            </div>
                                            <p className="text-2xl font-extrabold text-white">{progressData.teamSummary.completed}</p>
                                            <p className="text-[11px] text-blue-100 font-semibold tracking-wide">Completed</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center text-center">
                                            <div className="w-11 h-11 rounded-xl bg-blue-400/20 flex items-center justify-center mb-2">
                                                <Target size={20} className="text-blue-200" />
                                            </div>
                                            <p className="text-2xl font-extrabold text-white">{progressData.teamSummary.totalTasks}</p>
                                            <p className="text-[11px] text-blue-100 font-semibold tracking-wide">Total Tasks</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center text-center">
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 ${progressData.teamSummary.overdue > 0 ? 'bg-red-400/20' : 'bg-white/10'}`}>
                                                <AlertCircle size={20} className={progressData.teamSummary.overdue > 0 ? 'text-red-300' : 'text-white/40'} />
                                            </div>
                                            <p className={`text-2xl font-extrabold ${progressData.teamSummary.overdue > 0 ? 'text-red-300' : 'text-white/60'}`}>{progressData.teamSummary.overdue}</p>
                                            <p className="text-[11px] text-blue-100 font-semibold tracking-wide">Overdue</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Leaderboard Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <Trophy size={16} className="text-amber-500" /> Member Leaderboard
                                    </h3>
                                    <p className="text-xs text-gray-400">Ranked by completion rate</p>
                                </div>

                                <div className="space-y-4">
                                    {progressData.memberProgress.map((mp, idx) => {
                                        const rank = idx + 1;
                                        const isTop = rank <= 3 && mp.stats.total > 0;
                                        const medalColors = ['from-yellow-400 to-amber-500', 'from-gray-300 to-slate-400', 'from-amber-600 to-orange-700'];
                                        const ringColors = ['ring-yellow-200', 'ring-gray-200', 'ring-amber-200'];
                                        const completionColor = mp.stats.completionRate >= 80 ? 'text-emerald-600' : mp.stats.completionRate >= 50 ? 'text-blue-600' : mp.stats.completionRate >= 25 ? 'text-amber-600' : 'text-gray-500';
                                        const completionBg = mp.stats.completionRate >= 80 ? 'from-emerald-500' : mp.stats.completionRate >= 50 ? 'from-blue-500' : mp.stats.completionRate >= 25 ? 'from-amber-500' : 'from-gray-400';

                                        return (
                                            <div key={mp.user._id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${isTop && rank === 1 ? 'border-yellow-200 ring-1 ring-yellow-100' : 'border-gray-100'}`}>
                                                {/* Member Identity Row */}
                                                <div className="flex items-center gap-4 p-5">
                                                    {/* Rank */}
                                                    <div className="flex-shrink-0">
                                                        {isTop ? (
                                                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${medalColors[rank - 1]} flex items-center justify-center shadow-sm`}>
                                                                <Medal size={16} className="text-white" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                                                                <span className="text-sm font-bold text-gray-400">#{rank}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Avatar */}
                                                    <img src={mp.user.profilePicture || `https://ui-avatars.com/api/?name=${mp.user.firstName}+${mp.user.lastName}&background=6366f1&color=fff`} alt="" className={`w-12 h-12 rounded-xl object-cover ring-2 ${isTop ? ringColors[rank - 1] : 'ring-gray-100'} flex-shrink-0`} />

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">{mp.user.firstName} {mp.user.lastName}</p>
                                                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${mp.role === 'leader' ? 'text-yellow-700 bg-yellow-50 border-yellow-200' : mp.role === 'admin' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                                                                {mp.role === 'leader' && <Crown size={9} className="inline mr-0.5 -mt-px" />}
                                                                {mp.role === 'admin' && <Shield size={9} className="inline mr-0.5 -mt-px" />}
                                                                {mp.role}
                                                            </span>
                                                            {mp.stats.completionRate === 100 && mp.stats.total > 0 && (
                                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                                                                    <Flame size={9} /> All Clear!
                                                                </span>
                                                            )}
                                                            {mp.stats.overdue > 0 && (
                                                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                                                                    <AlertCircle size={9} /> {mp.stats.overdue} overdue
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-0.5">@{mp.user.username} · {mp.stats.total} task{mp.stats.total !== 1 ? 's' : ''} assigned</p>
                                                    </div>

                                                    {/* Circular Progress */}
                                                    <div className="flex-shrink-0 relative w-16 h-16">
                                                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                                                            <circle cx="32" cy="32" r="26" fill="none" stroke="#f1f5f9" strokeWidth="5" />
                                                            <circle cx="32" cy="32" r="26" fill="none" stroke="url(#progress-grad)" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 26}`} strokeDashoffset={`${2 * Math.PI * 26 * (1 - (mp.stats.total > 0 ? mp.stats.completionRate / 100 : 0))}`} className="transition-all duration-700" />
                                                            <defs>
                                                                <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                    <stop offset="0%" stopColor="#6366f1" />
                                                                    <stop offset="100%" stopColor="#3b82f6" />
                                                                </linearGradient>
                                                            </defs>
                                                        </svg>
                                                        <span className={`absolute inset-0 flex items-center justify-center text-sm font-extrabold ${completionColor}`}>{mp.stats.completionRate}%</span>
                                                    </div>
                                                </div>

                                                {/* Segmented Progress Bar */}
                                                {mp.stats.total > 0 && (
                                                    <div className="px-5 pb-4">
                                                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex gap-px">
                                                            {mp.stats.completed > 0 && <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(mp.stats.completed / mp.stats.total) * 100}%` }}></div>}
                                                            {mp.stats.inReview > 0 && <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${(mp.stats.inReview / mp.stats.total) * 100}%` }}></div>}
                                                            {mp.stats.inProgress > 0 && <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${(mp.stats.inProgress / mp.stats.total) * 100}%` }}></div>}
                                                            {mp.stats.todo > 0 && <div className="h-full bg-gradient-to-r from-slate-200 to-slate-300 rounded-full transition-all duration-500" style={{ width: `${(mp.stats.todo / mp.stats.total) * 100}%` }}></div>}
                                                        </div>
                                                        <div className="flex items-center gap-5 mt-2.5">
                                                            <span className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm"></span> Done {mp.stats.completed}</span>
                                                            <span className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm"></span> Review {mp.stats.inReview}</span>
                                                            <span className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block shadow-sm"></span> Active {mp.stats.inProgress}</span>
                                                            <span className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block shadow-sm"></span> To-Do {mp.stats.todo}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Stat Chips Row */}
                                                <div className="flex flex-wrap gap-2 px-5 pb-4">
                                                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl px-3 py-2">
                                                        <Timer size={13} className="text-indigo-500" />
                                                        <span className="text-xs font-bold text-indigo-700">{mp.stats.avgResolutionDays}d</span>
                                                        <span className="text-[10px] text-indigo-400 font-medium">avg time</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl px-3 py-2">
                                                        <Zap size={13} className="text-emerald-500" />
                                                        <span className="text-xs font-bold text-emerald-700">{mp.stats.onTimeRate}%</span>
                                                        <span className="text-[10px] text-emerald-400 font-medium">on-time</span>
                                                    </div>
                                                    {mp.byPriority.high > 0 && (
                                                        <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                                            <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                                            <span className="text-xs font-bold text-red-600">{mp.byPriority.high}</span>
                                                            <span className="text-[10px] text-red-400 font-medium">high</span>
                                                        </div>
                                                    )}
                                                    {mp.byPriority.medium > 0 && (
                                                        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                                                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                                            <span className="text-xs font-bold text-amber-600">{mp.byPriority.medium}</span>
                                                            <span className="text-[10px] text-amber-400 font-medium">med</span>
                                                        </div>
                                                    )}
                                                    {mp.byPriority.low > 0 && (
                                                        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                                            <span className="text-xs font-bold text-emerald-600">{mp.byPriority.low}</span>
                                                            <span className="text-[10px] text-emerald-400 font-medium">low</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* No Tasks Assigned */}
                                                {mp.stats.total === 0 && (
                                                    <div className="px-5 pb-5">
                                                        <div className="bg-gray-50 rounded-xl px-4 py-3 text-center">
                                                            <p className="text-xs text-gray-400 font-medium">No tasks assigned yet</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {progressData.memberProgress.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-5 shadow-sm">
                                                <BarChart3 size={32} className="text-blue-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-1.5">No progress data yet</h3>
                                            <p className="text-sm text-gray-500 max-w-xs">Assign tasks to your team members and their progress will be tracked here automatically.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            )}

            {/* Pull Requests Tab */}
            {activeTab === 'prs' && (
                <div className="space-y-3 max-w-3xl">
                    {pullRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-4 shadow-sm">
                                <GitPullRequest size={28} className="text-purple-400" />
                            </div>
                            <h3 className="text-base font-bold text-gray-800 mb-1">No pull requests yet</h3>
                            <p className="text-sm text-gray-500">PRs submitted by team members will appear here.</p>
                        </div>
                    ) : pullRequests.map(pr => (
                        <div key={pr._id} className={`bg-white rounded-2xl border border-l-4 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all ${pr.status === 'pending' ? 'border-gray-100 border-l-amber-400' : pr.status === 'accepted' ? 'border-gray-100 border-l-emerald-400' : 'border-gray-100 border-l-red-400'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{pr.task?.title}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">by <span className="font-medium">{pr.sender?.firstName} {pr.sender?.lastName}</span> (@{pr.sender?.username})</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${pr.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : pr.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {pr.status}
                                </span>
                            </div>
                            <a href={pr.githubPRLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors mb-2">
                                <ExternalLink size={12} /> View on GitHub
                            </a>
                            {pr.message && <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-xl px-3 py-2 italic">"{pr.message}"</p>}

                            {/* Review actions for leader/admin */}
                            {pr.status === 'pending' && canManage && pr.sender?._id !== user?._id && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    {reviewingPR === pr._id ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={reviewNote}
                                                onChange={e => setReviewNote(e.target.value)}
                                                placeholder="Review note (optional)..."
                                                rows={2}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleReviewPR(pr._id, 'accepted')} className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer">Accept</button>
                                                <button onClick={() => handleReviewPR(pr._id, 'rejected')} className="px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors cursor-pointer">Reject</button>
                                                <button onClick={() => { setReviewingPR(null); setReviewNote(''); }} className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => setReviewingPR(pr._id)} className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">Review this PR</button>
                                    )}
                                </div>
                            )}

                            {/* Show review info */}
                            {pr.status !== 'pending' && pr.reviewedBy && (
                                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                                    <CheckCircle2 size={12} />
                                    Reviewed by <span className="font-medium text-gray-600">{pr.reviewedBy.firstName} {pr.reviewedBy.lastName}</span>
                                    {pr.reviewNote && <span className="italic"> — "{pr.reviewNote}"</span>}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create Task Modal */}
            {showCreateTask && (
                <Modal onClose={() => setShowCreateTask(false)} title="Create New Task" icon={<Sparkles size={18} className="text-blue-600" />}>
                    <form onSubmit={handleCreateTask} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                            <input type="text" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                            <textarea value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date</label>
                                <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assign To *</label>
                            <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                                <option value="">Select member</option>
                                {members.filter(m => {
                                    if (isAdmin && !isLeader) {
                                        return m.user?._id !== team.leader?._id && m.role !== 'admin';
                                    }
                                    return m.user?._id !== user?._id || isLeader;
                                }).map(m => (
                                    <option key={m.user?._id} value={m.user?._id}>{m.user?.firstName} {m.user?.lastName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowCreateTask(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
                            <button type="submit" disabled={creatingTask} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-md disabled:opacity-50 transition-all cursor-pointer">
                                {creatingTask ? 'Creating...' : 'Create Task'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Submit PR Modal */}
            {showPRModal && (
                <Modal onClose={() => { setShowPRModal(false); setSelectedTaskForPR(null); }} title="Submit Pull Request" icon={<GitPullRequest size={18} className="text-purple-600" />}>
                    <form onSubmit={handleSubmitPR} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">GitHub PR Link *</label>
                            <input type="url" value={prForm.githubPRLink} onChange={e => setPrForm({ ...prForm, githubPRLink: e.target.value })} placeholder="https://github.com/..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                            <textarea value={prForm.message} onChange={e => setPrForm({ ...prForm, message: e.target.value })} placeholder="Any notes for the reviewer..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => { setShowPRModal(false); setSelectedTaskForPR(null); }} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
                            <button type="submit" disabled={submittingPR} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:shadow-md disabled:opacity-50 transition-all cursor-pointer">
                                {submittingPR ? 'Submitting...' : 'Submit PR'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Invite Modal */}
            {showInvite && (
                <Modal onClose={() => setShowInvite(false)} title="Invite Friend to Team" icon={<UserPlus size={18} className="text-emerald-600" />}>
                    <form onSubmit={handleInvite} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username *</label>
                            <input type="text" value={inviteUsername} onChange={e => setInviteUsername(e.target.value)} placeholder="Enter friend's username" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                            <textarea value={inviteMessage} onChange={e => setInviteMessage(e.target.value)} placeholder="Optional message..." rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowInvite(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
                            <button type="submit" disabled={inviting} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:shadow-md disabled:opacity-50 transition-all cursor-pointer">
                                {inviting ? 'Inviting...' : 'Send Invite'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Transfer Leadership Modal */}
            {showTransferModal && transferTarget && (
                <Modal onClose={() => { setShowTransferModal(false); setTransferTarget(null); }} title="Transfer Leadership" icon={<ArrowRightLeft size={18} className="text-yellow-600" />}>
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-sm text-yellow-800 font-medium mb-1">Are you sure?</p>
                            <p className="text-xs text-yellow-700">You are about to transfer leadership to <span className="font-bold">{transferTarget.firstName} {transferTarget.lastName}</span> (@{transferTarget.username}). You will become an admin after this action.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                            <img src={transferTarget.profilePicture || `https://ui-avatars.com/api/?name=${transferTarget.firstName}+${transferTarget.lastName}&background=6366f1&color=fff`} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-100" />
                            <div>
                                <p className="text-sm font-bold text-gray-900">{transferTarget.firstName} {transferTarget.lastName}</p>
                                <p className="text-xs text-gray-500">@{transferTarget.username}</p>
                            </div>
                            <Crown size={16} className="text-yellow-500 ml-auto" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => { setShowTransferModal(false); setTransferTarget(null); }} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
                            <button type="button" onClick={handleTransferLeadership} disabled={transferring} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl hover:shadow-md disabled:opacity-50 transition-all cursor-pointer">
                                {transferring ? 'Transferring...' : 'Confirm Transfer'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

// Task card component
const TaskCard = ({ task, canManage, userId, onStatusChange, onDelete, onSubmitPR }) => {
    const [showMenu, setShowMenu] = useState(false);
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
    const isAssigned = task.assignedTo?._id === userId;
    const pConfig = priorityConfig[task.priority] || priorityConfig.medium;

    const statusOptions = ['todo', 'in-progress'].filter(s => s !== task.status);

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative group">
            <div className="flex items-start justify-between gap-2 mb-2.5">
                <h4 className="text-sm font-semibold text-gray-800 leading-snug flex-1 pr-2 group-hover:text-blue-700 transition-colors">{task.title}</h4>
                <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap border ${pConfig.bg} ${pConfig.text} ${pConfig.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot}`}></span>
                    {task.priority}
                </span>
            </div>
            {task.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>}
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

            {/* Action buttons */}
            <div className="mt-2.5 pt-2.5 border-t border-gray-50 flex flex-wrap gap-1.5">
                {/* Members can move their tasks to in-progress */}
                {isAssigned && task.status === 'todo' && (
                    <button onClick={() => onStatusChange(task._id, 'in-progress')} className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                        Start Working
                    </button>
                )}
                {/* Members can submit PR when in-progress */}
                {isAssigned && task.status === 'in-progress' && (
                    <button onClick={() => onSubmitPR(task._id)} className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-1.5 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                        Submit PR
                    </button>
                )}
                {/* Leader/admin status controls */}
                {canManage && (
                    <>
                        {task.status !== 'cancelled' && task.status !== 'completed' && (
                            <button onClick={() => onStatusChange(task._id, 'cancelled')} className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                Cancel
                            </button>
                        )}
                        <button onClick={() => onDelete(task._id)} className="text-[10px] font-semibold text-red-500 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// Reusable modal
const Modal = ({ onClose, title, icon, children }) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
        <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl border border-gray-100" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    {icon && <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-slate-100 flex items-center justify-center">{icon}</div>}
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"><X size={18} className="text-gray-400" /></button>
            </div>
            {children}
        </div>
    </div>
);

export default TeamDetail
