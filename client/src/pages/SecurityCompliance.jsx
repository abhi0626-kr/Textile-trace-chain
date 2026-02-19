const controls = [
  { title: 'JWT Authentication', detail: 'Signed access tokens protect account sessions and API requests.' },
  { title: 'RBAC Authorization', detail: 'Role-based permissions ensure only approved stakeholders can update records.' },
  { title: 'SHA-256 Hash Integrity', detail: 'Documents and chain events are hashed for tamper-evident verification.' },
  { title: 'Helmet Security Headers', detail: 'HTTP headers reduce XSS, clickjacking, and content-sniffing risks.' },
  { title: 'Zod Input Validation', detail: 'Structured validation protects APIs against malformed or unsafe inputs.' }
];

const SecurityCompliance = () => {
  return (
    <div className="min-h-screen bg-background text-primary px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gold mb-2">Security & Compliance</p>
          <h1 className="text-3xl font-black mb-3">Protection You Can Verify</h1>
          <p className="text-secondary font-medium">Your traceability data is protected through cryptographic proofs, access controls, and secure API infrastructure.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {controls.map((control) => (
            <div key={control.title} className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="font-black text-gold uppercase tracking-widest text-xs mb-2">{control.title}</h3>
              <p className="text-sm text-primary font-medium">{control.detail}</p>
            </div>
          ))}
        </section>

        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-black mb-3">Immutability & Privacy Notes</h2>
          <ul className="space-y-2 text-sm font-medium text-primary">
            <li>Smart contract records are immutable once committed on-chain.</li>
            <li>Batch verification exposes traceability records without exposing private credentials.</li>
            <li>Operational data follows secure handling practices and role-based access constraints.</li>
          </ul>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 text-green-500 bg-green-500/10 text-xs font-black uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-current" />
            Hash Verification Enabled
          </div>
        </section>

        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-black mb-3">Production Hardening Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-medium">
            <div className="bg-background border border-border rounded-2xl p-4">✓ API rate limiting enabled</div>
            <div className="bg-background border border-border rounded-2xl p-4">Planned: optional 2FA for privileged roles</div>
            <div className="bg-background border border-border rounded-2xl p-4">Planned: admin audit log viewer</div>
            <div className="bg-background border border-border rounded-2xl p-4">Planned: transaction retry and gas preview</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityCompliance;
