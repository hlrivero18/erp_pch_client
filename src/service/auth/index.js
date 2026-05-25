import api from "../axios";

export const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    localStorage.setItem('token', data.data.token);

    return data;
};