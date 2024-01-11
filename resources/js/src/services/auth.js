import service from "./service";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

service.interceptors.response.use(
    (response) => response,
    async (error) => {
        const authStore = useAuthStore();
        const { setUser } = authStore;
        const { userGetter } = storeToRefs(authStore);

        if (
            error.response &&
            error.response.status === 401 &&
            userGetter.value
        ) {
            setUser(null);
        }

        return Promise.reject(error);
    },
);

async function login(credentials) {
    await service.get("/sanctum/csrf-cookie");

    return await service.post("/login", credentials);
}

const user = async () => {
    return await service.get("/user");
};

const logout = async () => {
    return await service.post("/logout");
};

export default { login, user, logout };