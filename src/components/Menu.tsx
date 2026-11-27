import type { Product } from "../types";
import formatPrice from "../utils/formatPrice";
import { useState } from "react";
import { MorphIcon } from "morphicons/react";
import { Plus, SquarePen } from "lucide-react";
import { Trash2, Check } from "lucide";

interface MenuProps {
    products: Product[];
    onAdd: (id: string) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    order: {
        productId: string;
        quantity: number;
    }[];
}

const categories = [
    { id: "panini", name: "Panini" },
    { id: "bevande", name: "Bevande" },
    { id: "dolci", name: "Dolci" },
] as const;

function Menu({ products, onAdd, onEdit, onDelete, order }: MenuProps) {
    const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

    return (
        <div className="space-y-8">
            {categories.map((category) => {
                const filteredProducts = products.filter(
                    (product) => product.category === category.id
                );

                return (
                    <section key={category.id} className="space-y-3">
                        <h2 className="text-2xl font-bold">
                            {category.name}
                        </h2>

                        <div className="space-y-3">
                            {filteredProducts.map((product) => {
                                const orderItem = order.find(
                                    (item) => item.productId === product.id
                                );

                                const quantity = orderItem?.quantity ?? 0;

                                return (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between rounded-2xl border border-gray-300 p-4"
                                    >
                                        <div>
                                            <h3 className="font-semibold">
                                                {product.name}
                                            </h3>

                                            <p className="text-gray-500">
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(product)}
                                                className="flex items-center gap-2 rounded-lg bg-gray-400 px-4 py-2 text-white hover:bg-gray-300"
                                            >
                                                <SquarePen size={18} />
                                                Modifica
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onAdd(product.id)}
                                                disabled={quantity >= 5}
                                                className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <Plus size={18} />
                                                Aggiungi nel carrello
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onDelete(product.id)}
                                                onMouseEnter={() => setHoveredProductId(product.id)}
                                                onMouseLeave={() => setHoveredProductId(null)}
                                                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                            >
                                                <MorphIcon
                                                    icon={hoveredProductId === product.id ? Check : Trash2}
                                                    size={18}
                                                />
                                                Elimina
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

export default Menu;