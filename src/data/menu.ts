import type { Product } from "../types";

const menu: Product[] = [
    { id: "1", name: "Panino prosciutto e formaggio", price: 2.5, category: "panini" },
    { id: "2", name: "Piadina crudo e rucola", price: 3, category: "panini" },
    { id: "3", name: "Tramezzino tonno", price: 2, category: "panini" },
    { id: "4", name: "Acqua naturale", price: 0.5, category: "bevande" },
    { id: "5", name: "Caffè", price: 1, category: "bevande" },
    { id: "6", name: "Succo di frutta", price: 1.2, category: "bevande" },
    { id: "7", name: "Tè freddo", price: 1.5, category: "bevande" },
    { id: "8", name: "Cornetto", price: 1.2, category: "dolci" },
    { id: "9", name: "Ciambella", price: 1, category: "dolci" },
];

export default menu;