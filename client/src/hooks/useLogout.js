import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import MyContext from "../utils/MyContext";
import toast from "react-hot-toast";
import useAuthApi from "../api/auth";

const useLogout = () => {
    const { logoutUser } = useAuthApi();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useContext(MyContext);

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        mutationKey: ["logout"],
        onSuccess: (response) => {
            // console.log('🚀 ~ useLogout ~ response:', response);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.clear();
            queryClient.removeQueries();
            navigate("/login");
            toast.success(response.message, { id: "logout" });
        },
        onError: (error) => {
            // console.log('🚀 ~ useLogout ~ error:', error);
            toast.error(error.response.data.message, { id: "logout" });
        },
    });

    const logOut = (status) => {
        logoutMutation.mutate({ user_id: user.user_id });

        // if (status === 'error') {
        // 	toast.error('Your session has expired. Please log in again.', { id: 'log-out' });
        // }
    };

    return logOut;
};

export default useLogout;
