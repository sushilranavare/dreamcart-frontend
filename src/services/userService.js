import api from "./api";

const userService = {
    getAllUsers: async () =>{
        const response = await api.get("/users");
        return response.data;
    },

    deleteUser: async () =>{
        const response = await api.get(`/users/${id}/`);
        return response.data;
    }

};

export default userService;