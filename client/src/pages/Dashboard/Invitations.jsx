import axios from 'axios'
import { Check, Clock, Mail, Send, X } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext.jsx'

const Invitations = () => {
    const { token, backendUrl } = useContext(AppContext);
    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [tab, setTab] = useState('received');
    const [loading, setLoading] = useState(true);

    const fetchInvitations = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/team/invitations/all', { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                setReceived(res.data.receivedInvitations);
                setSent(res.data.sentInvitations);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch invitations');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (token) fetchInvitations();
    }, [token]);

    const respondInvitation = async (invitationId, status) => {
        try {
            const res = await axios.put(backendUrl + `/api/team/invitations/respond/${invitationId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchInvitations();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to respond');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Team Invitations</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your team invitations</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
                {[
                    { key: 'received', label: 'Received', count: received.length },
                    { key: 'sent', label: 'Sent', count: sent.length },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                            tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t.label}
                        {t.count > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>{t.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Received */}
            {tab === 'received' && (
                <div className="space-y-2">
                    {received.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Mail size={40} className="text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">No pending invitations</p>
                        </div>
                    ) : received.map(inv => (
                        <div key={inv._id} className="flex items-center justify-between bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {inv.team?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{inv.team?.name}</p>
                                    <p className="text-xs text-gray-500">From {inv.sender?.firstName} {inv.sender?.lastName} (@{inv.sender?.username})</p>
                                    {inv.team?.title && <p className="text-xs text-gray-400 mt-0.5">{inv.team.title}</p>}
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0 ml-3">
                                <button onClick={() => respondInvitation(inv._id, 'accepted')} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                                    <Check size={14} /> Accept
                                </button>
                                <button onClick={() => respondInvitation(inv._id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                                    <X size={14} /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sent */}
            {tab === 'sent' && (
                <div className="space-y-2">
                    {sent.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Send size={40} className="text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">No sent invitations</p>
                        </div>
                    ) : sent.map(inv => (
                        <div key={inv._id} className="flex items-center justify-between bg-white rounded-lg border border-gray-100 p-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <img src={inv.receiver?.profilePicture || `https://ui-avatars.com/api/?name=${inv.receiver?.firstName}+${inv.receiver?.lastName}&background=3b82f6&color=fff`} alt="" className="w-10 h-10 rounded-full object-cover" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{inv.receiver?.firstName} {inv.receiver?.lastName}</p>
                                    <p className="text-xs text-gray-500">@{inv.receiver?.username} — {inv.team?.name}</p>
                                </div>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                                <Clock size={12} /> Pending
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Invitations
