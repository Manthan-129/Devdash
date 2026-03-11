import axios from 'axios'
import { CalendarDays, CheckCircle2, Clock, ExternalLink, Filter, GitPullRequest, Layers, XCircle } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext.jsx'

const PullRequests = () => {
    const { token, backendUrl } = useContext(AppContext);
    const [pullRequests, setPullRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchPRs = async () => {
            try {
                const res = await axios.get(backendUrl + '/api/pull-request/my-prs', { headers: { Authorization: `Bearer ${token}` } });
                if (res.data.success) setPullRequests(res.data.pullRequests);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch pull requests');
            }
            setLoading(false);
        };
        if (token) fetchPRs();
    }, [token]);

    const filtered = filterStatus === 'all' ? pullRequests : pullRequests.filter(pr => pr.status === filterStatus);

    const statusIcon = (status) => {
        if (status === 'pending') return <Clock size={14} className="text-yellow-500" />;
        if (status === 'accepted') return <CheckCircle2 size={14} className="text-green-500" />;
        return <XCircle size={14} className="text-red-500" />;
    };

    const statusColor = (status) => {
        if (status === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200';
        if (status === 'accepted') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        return 'bg-red-50 text-red-700 border-red-200';
    };

    const statusBorderAccent = (status) => {
        if (status === 'pending') return 'border-l-amber-400';
        if (status === 'accepted') return 'border-l-emerald-400';
        return 'border-l-red-400';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-blue-200 border-t-blue-600"></div>
                    <p className="text-sm text-gray-400 animate-pulse">Loading pull requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <GitPullRequest size={18} className="text-purple-500" />
                    <span className="text-sm font-medium text-purple-600">Code Review</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">My Pull Requests</h1>
                <p className="text-gray-500 mt-1">Track all your submitted pull requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                            <Layers size={18} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{pullRequests.length}</p>
                            <p className="text-xs text-gray-500 font-medium">Total</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <Clock size={18} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-amber-600">{pullRequests.filter(pr => pr.status === 'pending').length}</p>
                            <p className="text-xs text-gray-500 font-medium">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-emerald-600">{pullRequests.filter(pr => pr.status === 'accepted').length}</p>
                            <p className="text-xs text-gray-500 font-medium">Accepted</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                            <XCircle size={18} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">{pullRequests.filter(pr => pr.status === 'rejected').length}</p>
                            <p className="text-xs text-gray-500 font-medium">Rejected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
                <div className="flex items-center gap-3">
                    <Filter size={16} className="text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <span className="text-sm text-gray-500 ml-auto">
                        <b className="text-gray-800">{filtered.length}</b> pull requests
                    </span>
                </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-5 shadow-sm">
                        <GitPullRequest size={36} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No pull requests found</h3>
                    <p className="text-sm text-gray-500 max-w-xs">Submit a PR from a team task to see it here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(pr => (
                        <div key={pr._id} className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${statusBorderAccent(pr.status)} p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{pr.task?.title}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{pr.team?.name}</p>
                                </div>
                                <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${statusColor(pr.status)}`}>
                                    {statusIcon(pr.status)}
                                    {pr.status}
                                </span>
                            </div>
                            <a href={pr.githubPRLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors mb-2">
                                <ExternalLink size={12} /> View on GitHub
                            </a>
                            {pr.message && <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-xl px-3 py-2 italic">"{pr.message}"</p>}
                            {pr.reviewedBy && (
                                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                                    <CheckCircle2 size={12} />
                                    Reviewed by <span className="font-medium text-gray-600">{pr.reviewedBy.firstName} {pr.reviewedBy.lastName}</span>
                                    {pr.reviewNote && <span className="italic"> — "{pr.reviewNote}"</span>}
                                </p>
                            )}
                            <div className="flex items-center gap-1.5 mt-3 text-[10px] text-gray-400">
                                <CalendarDays size={10} />
                                {new Date(pr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PullRequests
