const statusStyles = {
  VERIFIED: 'bg-green-500/10 text-green-500 border-green-500/30',
  PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  ERROR: 'bg-red-500/10 text-red-500 border-red-500/30'
};

const statusLabels = {
  VERIFIED: 'On-chain Verified',
  PENDING: 'Pending Sync',
  ERROR: 'Sync Error'
};

const BlockchainStatusBadge = ({ status = 'PENDING' }) => {
  const normalized = statusStyles[status] ? status : 'PENDING';

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusStyles[normalized]}`}>
      <span className="w-2 h-2 rounded-full bg-current" />
      {statusLabels[normalized]}
    </span>
  );
};

export default BlockchainStatusBadge;
