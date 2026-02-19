export const NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME || 'Polygon Amoy';
export const POLYGONSCAN_BASE = import.meta.env.VITE_POLYGONSCAN_BASE || 'https://amoy.polygonscan.com';
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

export const CONTRACT_URL = CONTRACT_ADDRESS
  ? `${POLYGONSCAN_BASE}/address/${CONTRACT_ADDRESS}`
  : '';

export const txUrl = (hash) => {
  if (!hash) return '';
  return `${POLYGONSCAN_BASE}/tx/${hash}`;
};
