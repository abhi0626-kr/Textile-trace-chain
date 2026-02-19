const PROD_FALLBACK_API_URL = 'https://textile-trace-chain.onrender.com';

const API_URL = (
	import.meta.env.VITE_API_URL ||
	(import.meta.env.PROD ? PROD_FALLBACK_API_URL : 'http://localhost:5000')
).replace(/\/$/, '');

export default API_URL;
