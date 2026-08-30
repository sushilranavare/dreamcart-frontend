import api from "./api.js";

const dashboardService = {
    // Used by AdminDashboard.jsx
    getStatistics: async () => {
        const response = await api.get("/admin/dashboard");
        return response.data;
    }
};

export default dashboardService;