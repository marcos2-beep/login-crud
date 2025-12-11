import { API_URL } from "@/constants/config";

export interface AuthResponse {
    token: string;
    user: {
        email: string;
        name: string;
    };
}

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                // Mensaje genérico para cualquier error de login
                throw new Error("Clave o contraseña incorrecta.");
            }

            const json = await response.json();
            return json.data || json; // Fallback to json if data is missing
        } catch (error) {
            throw error;
        }
    },
};
