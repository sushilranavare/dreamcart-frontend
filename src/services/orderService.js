import api from "./api";

const orderService = {
    placeOrder: async (addressId) =>{
        const response = await api.post("/orders",{ addressId });
        return response.data;
    },
    getOrders: async () =>{
        const response = await api.get("/orders");
        return response.data;
    },
    
    getAllOrdersAdmin: async () => {
        const response = await api.get("/orders/all");
        return response.data;
    },
    updateOrderStatusAdmin: async (id, status) => {
        //Wrap status in an object because your backend expects a Map<String, String>
        const response = await api.put(`/orders/${id}/status`, {status});
        return response.data;
    }
};

export default orderService;