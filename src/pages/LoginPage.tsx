import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAutheStore from "../store/useAutheStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginImage from "../../src/assets/yantra.png";
import { User } from "../types/User";
import { useState } from "react"; 

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(3, "Password must be at least 3 characters"),
});

const fakeLogin = async (data: { email: string; password: string }): Promise<User> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Math.ceil(Math.random() * 1000),
                name: "Guest User",
                email: data.email,
            });
        }, 1000); 
    });
};

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAutheStore();
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const [loading, setLoading] = useState(false); 

    const onSubmit = async (formData: { email: string; password: string }) => {
        setLoading(true); 
        try {
            const user = await fakeLogin(formData);
            login(user);
            toast.success("Logged in successfully!");
            navigate("/");
        } catch (error) {
            toast.error("Login failed. Please try again.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="flex min-h-screen overflow-hidden">
            <div className="w-1/2 hidden md:flex justify-center items-center bg-gray-200">
                <img 
                    src={loginImage} 
                    alt="Login Illustration" 
                    className="max-h-[100vh] object-contain rounded-lg shadow-lg"
                />
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="Enter your email"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">Password</label>
                            <input
                                type="password"
                                {...register("password")}
                                placeholder="Enter your password"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"} 
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
