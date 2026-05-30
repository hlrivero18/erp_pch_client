import api from "../axios";

function toBooleanAvailability(value) {
    if (value === "activo") return true;
    if (value === "inactivo") return false;
    return undefined;
}

export const createMenuItem = async (newMenuItem) => {
    const { data } = await api.post('/menu-items/',
        {
            name: newMenuItem.name,
            descripcion: newMenuItem.description,
            price: parseFloat(newMenuItem.price),
            createdById: newMenuItem.createdById,
            isAvailable: toBooleanAvailability(newMenuItem.isAvailable)
        }
    );

    return data;
};

export const updateMenuItem = async (menuItem) => {
    const { data } = await api.put(`/menu-items/${menuItem.id}`,
        {
            name: menuItem.name,
            descripcion: menuItem.description,
            price: parseFloat(menuItem.price),
            isAvailable: toBooleanAvailability(menuItem.isAvailable)
        }
    )

    return data
}

export const getMenuItems = async (page, limit) => {
    const { data } = await api.get(`/menu-items?page=${page}&limit=${limit}`)
    return data
}