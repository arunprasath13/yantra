import { create } from "zustand";

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const useAutheStore = create<AuthState>((set) => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    return {
        user: parsedUser,
        isAuthenticated: !!parsedUser,

        login: (user) => {
            localStorage.setItem("user", JSON.stringify(user));
            set({ user, isAuthenticated: true });
        },

        logout: () => {
            localStorage.removeItem("user");
            set({ user: null, isAuthenticated: false });
        },
    };
});

export default useAutheStore;
