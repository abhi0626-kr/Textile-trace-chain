import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scannerError, setScannerError] = useState(null);
    const [html5QrCode, setHtml5QrCode] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize Html5Qrcode instance
        const qrCodeId = "reader";
        const html5QrCodeInstance = new Html5Qrcode(qrCodeId);
        setHtml5QrCode(html5QrCodeInstance);

        // Fetch cameras
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                setCameras(devices);
                setSelectedCamera(devices[0].id);
            }
        }).catch(err => {
            console.error("Error getting cameras", err);
            setScannerError("Camera permission denied or no cameras found.");
        });

        return () => {
            // Cleanup on unmount
            if (html5QrCodeInstance.isScanning) {
                html5QrCodeInstance.stop().catch(console.error);
            }
        };
    }, []);

    const startScanning = () => {
        if (!html5QrCode || !selectedCamera) return;

        setIsScanning(true);
        setScannerError(null);

        html5QrCode.start(
            selectedCamera,
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
                // Success
                setScanResult(decodedText);
                stopScanning().then(() => {
                    const batchId = decodedText.split('/').pop();
                    navigate(`/verify/${batchId}`);
                });
            },
            (errorMessage) => {
                // ignore
            }
        ).catch(err => {
            setIsScanning(false);
            setScannerError("Failed to start scanner.");
            console.error(err);
        });
    };

    const stopScanning = async () => {
        if (html5QrCode) {
            try {
                await html5QrCode.stop();
                setIsScanning(false);
            } catch (err) {
                console.error("Failed to stop scanner", err);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto bg-black p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#d4af37]/20">
            <h2 className="text-xl font-black mb-8 text-center text-white uppercase tracking-widest italic">
                Secure <span className="text-[#d4af37]">Scan</span>
            </h2>

            {/* Camera Select */}
            <div className="mb-6">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Select Optical Node</label>
                <div className="relative">
                    <select
                        value={selectedCamera}
                        onChange={(e) => setSelectedCamera(e.target.value)}
                        className="w-full bg-white/5 border-2 border-white/5 rounded-2xl p-4 focus:border-[#d4af37] transition-all font-bold text-slate-300 outline-none appearance-none"
                        disabled={isScanning}
                    >
                        {cameras.map(camera => (
                            <option key={camera.id} value={camera.id} className="bg-slate-900">
                                {camera.label || `Camera ${camera.id}`}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {scannerError && (
                <div className="mb-6 p-4 bg-red-900/40 text-red-400 border border-red-500/20 rounded-2xl text-[10px] font-bold text-center uppercase tracking-widest">
                    {scannerError}
                </div>
            )}

            {/* Scanner Area */}
            <div className="mb-8 relative overflow-hidden rounded-[2rem] border-4 border-white/5 shadow-inner">
                {!isScanning && !scanResult && (
                    <div className="w-full bg-slate-900/50 min-h-[300px] flex flex-col items-center justify-center text-slate-700">
                        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Node Awaiting Signal</span>
                    </div>
                )}
                <div
                    id="reader"
                    className={`w-full ${isScanning ? 'block' : 'hidden'}`}
                    style={{ minHeight: '300px' }}
                ></div>
                {isScanning && (
                    <div className="absolute inset-0 border-2 border-[#d4af37] border-dashed opacity-20 pointer-events-none animate-pulse"></div>
                )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
                {!isScanning ? (
                    <button
                        onClick={startScanning}
                        disabled={!selectedCamera}
                        className="bg-[#d4af37] text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#d4af37]/10 hover:bg-[#decba4] disabled:opacity-30 transition-all w-full flex items-center justify-center space-x-2"
                    >
                        <span>Initialize Scanner</span>
                    </button>
                ) : (
                    <button
                        onClick={stopScanning}
                        className="bg-white/5 text-red-500 border border-red-500/20 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-900/40 transition-all w-full"
                    >
                        Terminate Node
                    </button>
                )}
            </div>

            {scanResult && (
                <div className="text-center mt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Authenticated Trace Signal</p>
                    <p className="text-xs font-mono text-slate-500 truncate">{scanResult}</p>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
