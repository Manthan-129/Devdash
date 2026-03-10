import axios from 'axios'
import { ChevronRight, Crown, Plus, Shield, Sparkles, Users, X } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext.jsx'

const Teams = () => {
    const { token, backendUrl, user } = useContext(AppContext);
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ name: '', title: '', description: '' });
    const [creating, setCreating] = useState(false);

    const fetchTeams = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/team/my-teams', { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) setTeams(res.data.teams);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch teams');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (token) fetchTeams();
    }, [token]);

    const createTeam = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.title.trim()) return;
        setCreating(true);
        try {
            const res = await axios.post(backendUrl + '/api/team/create', form, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                toast.success(res.data.message);
                setShowCreate(false);
                setForm({ name: '', title: '', description: '' });
                fetchTeams();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create team');
        }
        setCreating(false);
    };

    const getUserRole = (team) => {
        if (team.leader?._id === user?._id) return 'Leader';
        const member = team.members?.find(m => m.user?._id === user?._id);
        if (member?.role === 'admin') return 'Admin';
        return 'Member';
    };

    const roleIcon = (role) => {
        if (role === 'Leader') return <Crown size={12} className="text-yellow-600" />;
        if (role === 'Admin') return <Shield size={12} className="text-blue-600" />;
        return null;
    };

    const roleBadgeColor = (role) => {
        if (role === 'Leader') return 'text-yellow-700 bg-yellow-50 border border-yellow-200';
        if (role === 'Admin') return 'text-blue-700 bg-blue-50 border border-blue-200';
        return 'text-gray-600 bg-gray-50 border border-gray-200';
    };

    const gradientColors = [
        'from-blue-500 to-indigo-600',
        'from-violet-500 to-purple-600',
        'from-emerald-500 to-teal-600',
        'from-rose-500 to-pink-600',
        'from-amber-500 to-orange-600',
        'from-cyan-500 to-blue-600',
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-blue-200 border-t-blue-600"></div>
                    <p className="text-sm text-gray-400 animate-pulse">Loading teams...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Users size={18} className="text-blue-500" />
                        <span className="text-sm font-medium text-blue-600">Team Management</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">My Teams</h1>
                    <p className="text-gray-500 mt-1">Manage your teams and collaborate on projects</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-2xl hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                    <Plus size={16} />
                    New Team
                </button>
            </div>

            {/* Create Team Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={() => setShowCreate(false)}>
                    <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl border border-gray-100" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                    <Sparkles size={18} className="text-blue-600" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Create New Team</h2>
                            </div>
                            <button onClick={() => setShowCreate(false)} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"><X size={18} className="text-gray-400" /></button>
                        </div>
                        <form onSubmit={createTeam} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Team Name *</label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. DevDash Core" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Frontend Development" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this team about?" rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Cancel</button>
                                <button type="submit" disabled={creating} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-md disabled:opacity-50 transition-all cursor-pointer">
                                    {creating ? 'Creating...' : 'Create Team'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Teams List */}
            {teams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-5 shadow-sm">
                        <Users size={36} className="text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No teams yet</h3>
                    <p className="text-gray-500 text-sm max-w-xs">Create your first team to start managing projects and collaborating with your crew.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {teams.map((team, index) => {
                        const role = getUserRole(team);
                        return (
                            <div
                                key={team._id}
                                onClick={() => navigate(`/dashboard/teams/${team._id}`)}
                                className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColors[index % gradientColors.length]} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm`}>
                                        {team.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2.5">
                                            <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">{team.name}</h3>
                                            <span className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-lg whitespace-nowrap ${roleBadgeColor(role)}`}>
                                                {roleIcon(role)} {role}
                                            </span>
                                        </div>
                                        {team.title && <p className="text-xs text-gray-500 truncate mt-0.5">{team.title}</p>}
                                        <p className="text-[10px] text-gray-400 mt-1">{team.members?.length || 0} members</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {team.members?.slice(0, 4).map((m, i) => (
                                            <img
                                                key={i}
                                                src={m.user?.profilePicture || `https://ui-avatars.com/api/?name=${m.user?.firstName}+${m.user?.lastName}&background=6366f1&color=fff&size=28`}
                                                alt=""
                                                className="w-8 h-8 rounded-lg border-2 border-white object-cover shadow-sm"
                                            />
                                        ))}
                                        {(team.members?.length || 0) > 4 && (
                                            <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                +{team.members.length - 4}
                                            </div>
                                        )}
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default Teams
