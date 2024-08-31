let monitoringInterval = null;

module.exports = {
    getMonitoringInterval: () => monitoringInterval,
    setMonitoringInterval: (interval) => { monitoringInterval = interval; },
    clearMonitoringInterval: () => {
        if (monitoringInterval) {
            clearInterval(monitoringInterval);
            monitoringInterval = null;
        }
    }
};
