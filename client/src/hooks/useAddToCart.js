import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import api from "@/api/axios";
import useAuth from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";

/*
 * Shared "add to cart" action used by product cards and the product page.
 *
 * - Posts the cake to `/cart/items` with a quantity of 1 by default.
 * - Shows a localized success / error toast.
 * - Invalidates the `["cart"]` query so the navbar badge stays in sync.
 * - Sends guests to the login page instead of firing a request that would 401.
 */
const useAddToCart = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { language } = useLanguage();
    const isArabic = language === "ar";

    const mutation = useMutation({
        mutationFn: async ({ cakeId, quantity }) => {
            const response = await api.post("/cart/items", {
                cakeId,
                quantity,
            });

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });

            toast.success(
                isArabic
                    ? "تمت إضافة الكعكة إلى السلة"
                    : "Cake added to cart",
            );
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                    (isArabic
                        ? "تعذر إضافة الكعكة إلى السلة"
                        : "Failed to add cake to cart"),
            );
        },
    });

    const addToCart = (cakeId, quantity = 1) => {
        if (!isAuthenticated) {
            toast.error(
                isArabic
                    ? "يرجى تسجيل الدخول لإضافة الكعكة إلى السلة"
                    : "Please log in to add cakes to your cart",
            );

            navigate("/auth/login");
            return;
        }

        mutation.mutate({ cakeId, quantity });
    };

    return {
        addToCart,
        isPending: mutation.isPending,
        pendingCakeId: mutation.variables?.cakeId,
    };
};

export default useAddToCart;
