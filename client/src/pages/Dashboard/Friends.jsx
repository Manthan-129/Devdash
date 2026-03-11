import axios from 'axios'
import { Check, Clock, Heart, Search, Send, UserMinus, Users, X } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext.jsx'

const EmptyState = ({ icon: Icon, text }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-slate-100 flex items-center justify-center mb-4 shadow-sm">
            <Icon size={28} className="text-gray-300" />
        </div>
        <p className="text-sm text-gray-500 max-w-xs">{text}</p>
    </div>
);

const Friends = () => {
    const { token, backendUrl } = useContext(AppContext);
    const [friends, setFriends] = useState([]);
    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [tab, setTab] = useState('friends');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const fetchFriends = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/friendship/all-friends', { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) setFriends(res.data.friends);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch friends');
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/friendship/friend-requests', { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                setReceived(res.data.requestsRecieve);
                setSent(res.data.requestsSent);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch requests');
        }
    };

    useEffect(() => {
        if (token) {
            Promise.all([fetchFriends(), fetchRequests()]).then(() => setLoading(false));
        }
    }, [token]);

    const sendRequest = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;
        setSending(true);
        try {
            const res = await axios.post(backendUrl + '/api/friendship/send-request', { username: username.trim() }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                toast.success(res.data.message);
                setUsername('');
                fetchRequests();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send request');
        }
        setSending(false);
    };

    const respondRequest = async (inviteId, status) => {
        try {
            const res = await axios.post(backendUrl + `/api/friendship/respond-request/${inviteId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchRequests();
                fetchFriends();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to respond');
        }
    };

    const cancelRequest = async (inviteId) => {
        try {
            const res = await axios.delete(backendUrl + `/api/friendship/cancel-invitation/${inviteId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchRequests();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel');
        }
    };

    const unfriend = async (friendId) => {
        try {
            const res = await axios.delete(backendUrl + `/api/friendship/unfriend/${friendId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchFriends();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to unfriend');
        }
    };

    const tabs = [
        { key: 'friends', label: 'Friends', count: friends.length, icon: Heart },
        { key: 'received', label: 'Received', count: received.length, icon: Clock },
        { key: 'sent', label: 'Sent', count: sent.length, icon: Send },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-blue-200 border-t-blue-600"></div>
                    <p className="text-sm text-gray-400 animate-pulse">Loading friends...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Heart size={18} className="text-pink-500" />
                    <span className="text-sm font-medium text-pink-600">Connections</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
                <p className="text-gray-500 mt-1">Manage connections and send friend requests</p>
            </div>

            {/* Add Friend */}
            <form onSubmit={sendRequest} className="flex gap-3 mb-8">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Enter username to add friend..."
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 hover:bg-white transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    disabled={sending || !username.trim()}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-2xl hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all cursor-pointer"
                >
                    <Send size={16} />
                    Send
                </button>
            </form>

            {/* Tabs */}
            <div className="flex gap-1 mb-8 bg-gray-100/80 rounded-2xl p-1.5">
                {tabs.map(t => {
                    const TabIcon = t.icon;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                                tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <TabIcon size={14} />
                            {t.label}
                            {t.count > 0 && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                                    tab === t.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                                }`}>{t.count}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Friends List */}
            {tab === 'friends' && (
                <div className="space-y-2.5">
                    {friends.length === 0 ? (
                        <EmptyState icon={Users} text="No friends yet. Send a request to get started!" />
                    ) : friends.map(f => (
                        <div key={f._id} className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                            <div className="flex items-center gap-3">
                                <img
                                    src={f.profilePicture || `https://ui-avatars.com/api/?name=${f.firstName}+${f.lastName}&background=6366f1&color=fff`}
                                    alt=""
                                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-gray-100"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{f.firstName} {f.lastName}</p>
                                    <p className="text-xs text-gray-500">@{f.username}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => unfriend(f._id)}
                                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:shadow-sm transition-all cursor-pointer"
                            >
                                <UserMinus size={14} />
                                Unfriend
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Received Requests */}
            {tab === 'received' && (
                <div className="space-y-2.5">
                    {received.length === 0 ? (
                        <EmptyState icon={Clock} text="No pending requests" />
                    ) : received.map(r => (
                        <div key={r._id} className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                            <div className="flex items-center gap-3">
                                <img
                                    src={r.sender?.profilePicture || `https://ui-avatars.com/api/?name=${r.sender?.firstName}+${r.sender?.lastName}&background=6366f1&color=fff`}
                                    alt=""
                                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-gray-100"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{r.sender?.firstName} {r.sender?.lastName}</p>
                                    <p className="text-xs text-gray-500">@{r.sender?.username}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => respondRequest(r._id, 'accepted')} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 hover:shadow-sm transition-all cursor-pointer">
                                    <Check size={14} /> Accept
                                </button>
                                <button onClick={() => respondRequest(r._id, 'rejected')} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:shadow-sm transition-all cursor-pointer">
                                    <X size={14} /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sent Requests */}
            {tab === 'sent' && (
                <div className="space-y-2.5">
                    {sent.length === 0 ? (
                        <EmptyState icon={Send} text="No sent requests" />
                    ) : sent.map(s => (
                        <div key={s._id} className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                            <div className="flex items-center gap-3">
                                <img
                                    src={s.receiver?.profilePicture || `https://ui-avatars.com/api/?name=${s.receiver?.firstName}+${s.receiver?.lastName}&background=6366f1&color=fff`}
                                    alt=""
                                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-gray-100"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{s.receiver?.firstName} {s.receiver?.lastName}</p>
                                    <p className="text-xs text-gray-500">@{s.receiver?.username}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => cancelRequest(s._id)}
                                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer"
                            >
                                <X size={14} /> Cancel
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Friends
