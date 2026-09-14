// ============================================================
// ZeParty Admin Portal — Live Rooms Service (JavaScript)
// ============================================================

import apiClient from '../api';

export async function getLiveRooms(params = {}) {
  const res = await apiClient.get('/v1/admin/rooms', { params });
  const items = res.data?.data || [];
  return items.map((r) => ({
    id: r.id,
    title: r.title || `Live Room ${r.id.slice(0, 6)}`,
    hostId: r.hostUserId || r.ownerId,
    hostName: r.host?.username || r.host?.profile?.displayName || r.hostUserId || 'Host',
    hostAvatar: r.host?.profile?.avatarUrl || '',
    category: r.category || 'General',
    viewers: Number(r.activeMembersCount || r.activeParticipantsCount || r.viewers || 0),
    likes: Number(r.likesCount || 0),
    status: r.status?.toLowerCase() || 'active',
    isPinned: Boolean(r.isPinned || r.isOfficialPinned),
    pinnedOrder: Number(r.pinnedOrder || 0),
    startedAt: r.createdAt,
    tags: r.tags || ['Music', 'Chat'],
    isMuted: Boolean(r.isMuted),
  }));
}

export async function getLiveRoomById(id) {
  const res = await apiClient.get(`/v1/admin/rooms/${id}`);
  const r = res.data?.data;
  if (!r) return null;
  return {
    id: r.id,
    title: r.title,
    hostId: r.hostUserId,
    hostName: r.host?.username || r.hostUserId,
    hostAvatar: r.host?.profile?.avatarUrl,
    category: r.category,
    viewers: Number(r.activeMembersCount || 0),
    status: r.status?.toLowerCase(),
    isPinned: Boolean(r.isPinned),
    startedAt: r.createdAt,
    members: r.members || [],
    seats: r.seats || [],
  };
}

export async function pinRoom(id, pinnedOrder = 1) {
  const res = await apiClient.post(`/v1/admin/rooms/${id}/pin`, { pinnedOrder });
  return res.data;
}

export async function unpinRoom(id) {
  const res = await apiClient.delete(`/v1/admin/rooms/${id}/pin`);
  return res.data;
}

export async function endStream(id, reason) {
  const res = await apiClient.post(`/v1/admin/rooms/${id}/close`, {
    reason: reason || 'Stream closed by administrator',
  });
  return res.data;
}

export async function muteHost(id, durationMinutes) {
  const res = await apiClient.post(`/v1/admin/moderation/user`, {
    targetUserId: id,
    action: 'MUTE',
    reason: `Muted in live room for ${durationMinutes} minutes`,
    durationMinutes: Number(durationMinutes || 60),
  });
  return res.data;
}

export async function banRoom(id, reason) {
  const res = await apiClient.post(`/v1/admin/rooms/${id}/close`, {
    reason: reason || 'Banned by platform moderation',
  });
  return res.data;
}

export default {
  getLiveRooms,
  getLiveRoomById,
  pinRoom,
  unpinRoom,
  endStream,
  muteHost,
  banRoom,
};
