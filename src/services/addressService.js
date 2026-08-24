import api from "./api";

const addressService = {
    getAddresses: async () =>{
        const response = await api.get("/address");
        return response.data;
    },

    addAddress: async (addressData) => {
        const response = await  api.post("/address",addressData);
        return response.data;
    }
};

export default addressService;