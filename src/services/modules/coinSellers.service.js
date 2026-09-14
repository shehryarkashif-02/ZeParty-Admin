// ============================================================
// ZeParty Admin Portal — Coin Sellers Service (JavaScript)
// ============================================================

import apiClient from '../api';

export async function getCoinSellers(params = {}) {
  const res = await apiClient.get('/v1/admin/sellers', { params });
  const items = res.data?.data || [];
  return items.map((s) => ({
    id: s.id,
    name: s.businessName || s.user?.username || s.id,
    contactEmail: s.user?.email || 'seller@zeparty.io',
    allocatedQuota: Number(s.allocatedQuota || s.allocatedCoins || 0),
    soldCoins: Number(s.soldCoins || 0),
    commissionPct: Number(s.commissionPercent || 5.0),
    status: s.status?.toLowerCase() || 'active',
    userId: s.userId,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));
}

export async function createCoinSeller(payload) {
  const res = await apiClient.post('/v1/admin/sellers', payload);
  return res.data?.data;
}

export async function getCoinSellerById(id) {
  const res = await apiClient.get(`/v1/admin/sellers/${id}`);
  return res.data?.data;
}

export async function toggleSellerStatus(id, currentStatus) {
  const nextStatus = currentStatus === 'active' ? 'INACTIVE' : 'ACTIVE';
  const res = await apiClient.put(`/v1/admin/sellers/${id}/status`, { status: nextStatus });
  return res.data;
}

export async function allocateCoinsToSeller(id, amount, notes = '') {
  const res = await apiClient.post(`/v1/admin/sellers/${id}/allocate`, {
    amount: Number(amount),
    notes,
  });
  return res.data;
}

export async function correctSellerBalance(id, payload) {
  const res = await apiClient.post(`/v1/admin/sellers/${id}/correct`, payload);
  return res.data;
}

export default {
  getCoinSellers,
  createCoinSeller,
  getCoinSellerById,
  toggleSellerStatus,
  allocateCoinsToSeller,
  correctSellerBalance,
};
