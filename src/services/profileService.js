import api from "./api";

const profileService = {
    getProfile: async () => {
        const response = await api.get("/users/me");
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put("/users/me", profileData);
        return response.data;
    },

    changePassword: async (currentPassword, newPassword) => {
        const response = await api.put("/users/me/password", {
            currentPassword,
            newPassword
        });
        return response.data;
    }
};

export default profileService;