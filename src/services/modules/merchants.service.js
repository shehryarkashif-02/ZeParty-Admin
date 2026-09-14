// ============================================================
// ZeParty Admin Portal — Merchants Service (JavaScript)
// ============================================================

import apiClient from '../api';

export async function getMerchants(params = {}) {
  const res = await apiClient.get('/v1/admin/merchants', { params });
  const items = res.data?.data || [];
  return items.map((m) => ({
    id: m.id,
    userRef: m.userId,
    merchantName: m.name || m.businessName || m.id,
    contactPerson: m.contactPerson || 'Merchant Representative',
    email: m.email || m.contactEmail || 'merchant@zeparty.io',
    status: m.status?.toLowerCase() || 'active',
    packagePriceUSD: Number(m.packagePriceUSD || 3000),
    coinRatio: Number(m.coinRatio || 8400),
    totalCoins: Number(m.totalCoins || 25200000),
    coinAllocation: Number(m.coinAllocation || m.totalCoins || 25200000),
    targetUSD: Number(m.targetUSD || 1000),
    salesThisMonthUSD: Number(m.salesThisMonthUSD || 0),
    workingPeriodDays: Number(m.workingPeriodDays || 30),
    joinedAt: m.createdAt,
    country: m.country || 'GLOBAL',
    paymentMethods: m.paymentMethods || ['Bank Wire Transfer', 'USDT (TRC20)'],
    dailySettlementLimitUSD: Number(m.dailySettlementLimitUSD || 10000),
    linkedToWithdrawalSettlement: Boolean(m.linkedToWithdrawalSettlement),
    minPortalAmountUSD: Number(m.minPortalAmountUSD || 300),
    history: m.history || [],
  }));
}

export async function getMerchantById(id) {
  const res = await apiClient.get(`/v1/admin/merchants/${id}`);
  return res.data?.data;
}

export async function createMerchant(payload) {
  const res = await apiClient.post('/v1/admin/merchants', payload);
  return res.data?.data;
}

export async function updateMerchant(id, payload) {
  const res = await apiClient.put(`/v1/admin/merchants/${id}`, payload);
  return res.data?.data;
}

export default {
  getMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
};
