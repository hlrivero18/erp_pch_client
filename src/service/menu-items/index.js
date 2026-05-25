import api from "../axios";

export const createMenuItem = async (newMenuItem) => {
    const { data } = await api.post('/menu-items/', 
        {  
            name: newMenuItem.name,
            descripcion: newMenuItem.descripcion,
            price: parseFloat(newMenuItem.price),
            createdById: newMenuItem.createdById 
        }
    );

    return data;
};

export const getMenuItems = async (page, limit) =>{
    const { data } = await api.get(`/menu-items?page=${page}&limit=${limit}`)
    
    return data
}