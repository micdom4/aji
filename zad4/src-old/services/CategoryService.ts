import { type Category } from "../types/ProductTypes";
import api from "./api";

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    } catch (error) {
        console.error('Błąd podczas pobierania produktów:', error);
        throw new Error('Nie udało się pobrać listy produktów.');
    }
};