const API_URL = (
	import.meta.env.VITE_API_URL ||
	(import.meta.env.PROD ? '/api' : 'http://localhost:5000')
).replace(/\/$/, '');

export default API_URL;
