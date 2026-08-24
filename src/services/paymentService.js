import api from "./api";

const paymentService = {
     makePayment: async (orderId, paymentMethod)=>{
        const response = await api.post("/payments", {
            orderId,
            paymentMethod
        });
        return response.data;
    }
};
export default paymentService;