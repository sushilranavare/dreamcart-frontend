/*
 * Tests for the Checkout page.
 *
 * All four services it depends on (cart, address, order, payment) are
 * mocked at the module boundary, so these tests cover Checkout's own
 * orchestration logic: loading cart/address data, redirecting away
 * from an empty cart, and placing an order followed by payment in
 * the right order with the right arguments.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Checkout from "./Checkout";
import cartService from "../services/cartService";
import addressService from "../services/addressService";
import orderService from "../services/orderService";
import paymentService from "../services/paymentService";

vi.mock("../services/cartService", () => ({
    default: { getCart: vi.fn() },
}));

vi.mock("../services/addressService", () => ({
    default: { getAddresses: vi.fn(), addAddress: vi.fn() },
}));

vi.mock("../services/orderService", () => ({
    default: { placeOrder: vi.fn() },
}));

vi.mock("../services/paymentService", () => ({
    default: { makePayment: vi.fn() },
}));

const cartWithItems = {
    items: [
        { id: 1, productName: "Galaxy A17", quantity: 2, subtotal: 2999.98 },
    ],
    total: 2999.98,
};

const savedAddress = {
    id: 42,
    fullName: "Sushil SR",
    phoneNumber: "1234567890",
    addressLine1: "123 Main St",
    city: "Sydney",
    state: "NSW",
    postalCode: "2007",
};

function renderCheckoutPage() {
    return render(
        <MemoryRouter initialEntries={["/checkout"]}>
            <Routes>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/cart" element={<div>Cart Page</div>} />
                <Route path="/orders" element={<div>Orders Page</div>} />
            </Routes>
        </MemoryRouter>
    );
}

describe("Checkout", () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, "alert").mockImplementation(() => {});
    });

    it("redirects to /cart without loading the checkout form when the cart is empty", async () => {
        cartService.getCart.mockResolvedValueOnce({ items: [] });

        renderCheckoutPage();

        await waitFor(() => {
            expect(screen.getByText("Cart Page")).toBeInTheDocument();
        });

        expect(addressService.getAddresses).not.toHaveBeenCalled();
        expect(screen.queryByText("Secure Checkout 🔒")).not.toBeInTheDocument();
    });

    it("places the order, pays, and redirects to /orders on the happy path", async () => {
        const user = userEvent.setup();

        cartService.getCart.mockResolvedValueOnce(cartWithItems);
        addressService.getAddresses.mockResolvedValueOnce([savedAddress]);
        orderService.placeOrder.mockResolvedValueOnce({ id: 7 });
        paymentService.makePayment.mockResolvedValueOnce({ status: "SUCCESS" });

        renderCheckoutPage();

        expect(await screen.findByText("Secure Checkout 🔒")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /place order/i }));

        await waitFor(() => {
            expect(screen.getByText("Orders Page")).toBeInTheDocument();
        });

        expect(orderService.placeOrder).toHaveBeenCalledWith(42);
        expect(paymentService.makePayment).toHaveBeenCalledWith(7, "CARD");
        expect(window.alert).toHaveBeenCalledWith(
            "Order placed successfully! 🎉 Check your email for confirmation."
        );

        // Payment must only happen after the order exists, since it
        // needs the order's own id.
        const placeOrderCallOrder = orderService.placeOrder.mock.invocationCallOrder[0];
        const makePaymentCallOrder = paymentService.makePayment.mock.invocationCallOrder[0];
        expect(placeOrderCallOrder).toBeLessThan(makePaymentCallOrder);
    });

    it("shows the new-address form automatically when the user has no saved addresses", async () => {
        cartService.getCart.mockResolvedValueOnce(cartWithItems);
        addressService.getAddresses.mockResolvedValueOnce([]);

        renderCheckoutPage();

        expect(await screen.findByPlaceholderText("Full Name")).toBeInTheDocument();
    });

    it("shows an alert and stays on the page when placing the order fails", async () => {
        const user = userEvent.setup();

        cartService.getCart.mockResolvedValueOnce(cartWithItems);
        addressService.getAddresses.mockResolvedValueOnce([savedAddress]);
        orderService.placeOrder.mockRejectedValueOnce({
            response: { data: { message: "Insufficient stock" } },
        });

        renderCheckoutPage();

        await screen.findByText("Secure Checkout 🔒");

        await user.click(screen.getByRole("button", { name: /place order/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Insufficient stock");
        });

        expect(paymentService.makePayment).not.toHaveBeenCalled();
        expect(screen.getByText("Secure Checkout 🔒")).toBeInTheDocument();
    });
});