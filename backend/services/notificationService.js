const Notification = require('../models/Notification');

const ALL_ROLES = ['FARMER', 'MILL', 'MANUFACTURER', 'EXPORTER', 'BUYER', 'ADMIN'];

const emitToRoles = (io, roleTargets, payload) => {
    if (!io || !roleTargets || roleTargets.length === 0) return;
    roleTargets.forEach((role) => {
        io.to(`role:${role}`).emit('notification', payload);
    });
};

const emitToUsers = (io, userTargets, payload) => {
    if (!io || !userTargets || userTargets.length === 0) return;
    userTargets.forEach((userId) => {
        io.to(userId).emit('notification', payload);
    });
};

const emitNotification = async ({ io, type, msg, batchId = null, roleTargets = [], userTargets = [], metadata = {} }) => {
    const payload = {
        type,
        msg,
        batchId,
        timestamp: Date.now()
    };

    await Notification.create({
        type,
        msg,
        batchId,
        roleTargets,
        userTargets,
        metadata,
        timestamp: payload.timestamp
    });

    emitToRoles(io, roleTargets, payload);
    emitToUsers(io, userTargets, payload);

    return payload;
};

module.exports = {
    ALL_ROLES,
    emitNotification
};
