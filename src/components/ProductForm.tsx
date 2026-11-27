
import { useState, useEffect } from "react";
import type { Product } from "../types";
import { Check, Plus } from "lucide";
import { X } from "lucide-react";
import { MorphIcon } from "morphicons/react";

interface ProductFormProps {
    onAdd: (product: Omit<Product, "id">) => void;
    onUpdate: (id: string, product: Omit<Product, "id">) => void;
    editingProduct: Product | null;
    onCancelEdit: () => void;
    error: string;
}

function ProductForm({
    onAdd,
    onUpdate,
    editingProduct,
    onCancelEdit,
    error,
}: ProductFormProps) {
    const [productName, setProductName] = useState(editingProduct?.name ?? "");
    const [productPrice, setProductPrice] = useState(
        editingProduct ? String(editingProduct.price) : ""
    );
    const [productCategory, setProductCategory] = useState<Product["category"]>(
        editingProduct?.category ?? "panini"
    );
    const [isAddHovered, setIsAddHovered] = useState(false);
    useEffect(() => {
        if (editingProduct) {
            setProductName(editingProduct.name);
            setProductPrice(String(editingProduct.price));
            setProductCategory(editingProduct.category);
        } else {
            resetForm();
        }
    }, [editingProduct]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const productData = {
            name: productName.trim(),
            price: Number(productPrice),
            category: productCategory,
        };

        if (!productData.name || productData.price <= 0) {
            return;
        }

        if (editingProduct) {
            onUpdate(editingProduct.id, productData);
        } else {
            onAdd(productData);
        }

        resetForm();
    }

    function resetForm() {
        setProductName("");
        setProductPrice("");
        setProductCategory("panini");
    }

    function handleCancel() {
        resetForm();
        onCancelEdit();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <h2 className="text-2xl font-bold">
                {editingProduct ? "Modifica prodotto" : "Aggiungi prodotto"}
            </h2>

            <div className="space-y-2">
                <label htmlFor="productName">Nome prodotto</label>

                <input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="Es. Pizza margherita"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="productPrice">Prezzo (€)</label>

                <input
                    id="productPrice"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="Es. 2.50"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="productCategory">Categoria</label>

                <select
                    id="productCategory"
                    value={productCategory}
                    onChange={(e) =>
                        setProductCategory(
                            e.target.value as Product["category"]
                        )
                    }
                    className="w-full rounded-lg border border-gray-300 p-3"
                >
                    <option value="panini">Panini</option>
                    <option value="bevande">Bevande</option>
                    <option value="dolci">Dolci</option>
                </select>
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            <button
                type="submit"
                onMouseEnter={() => setIsAddHovered(true)}
                onMouseLeave={() => setIsAddHovered(false)}
                className={`w-full rounded-lg px-4 py-3 font-semibold text-white ${editingProduct
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
            >
                <span className="flex items-center justify-center gap-2">
                    <MorphIcon
                        icon={
                            editingProduct
                                ? Check
                                : isAddHovered
                                    ? Check
                                    : Plus
                        }
                        size={18}
                    />

                    {editingProduct
                        ? "Salva modifiche"
                        : "Aggiungi prodotto"}
                </span>
            </button>

            {editingProduct && (
                <button
                    type="button"
                    onClick={handleCancel}
                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600"
                >
                    <X size={18} />
                    Annulla modifica
                </button>
            )}
        </form>
    );

}

export default ProductForm;
