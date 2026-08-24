import api from "./api";

const orderService = {
    placeOrder: async (addressId) =>{
        const response = await api.post("/orders",{ addressId });
        return response.data;
    },
    getOrders: async () =>{
        const response = await api.get("/orders");
        return response.data;
    }
};

export default orderService;