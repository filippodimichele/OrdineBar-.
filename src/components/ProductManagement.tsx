import ProductForm from "./ProductForm";
import type { Product } from "../types";

interface ProductManagementProps {
    onAdd: (product: Omit<Product, "id">) => void;
    onUpdate: (id: string, product: Omit<Product, "id">) => void;
    editingProduct: Product | null;
    onCancelEdit: () => void;
    error: string;
}

function ProductManagement({
    onAdd,
    onUpdate,
    editingProduct,
    onCancelEdit,
    error,
}: ProductManagementProps) {
    return (
        <section className="space-y-4 rounded-2xl border border-gray-300 p-5">
            <ProductForm
                onAdd={onAdd}
                onUpdate={onUpdate}
                editingProduct={editingProduct}
                onCancelEdit={onCancelEdit}
                error={error}
            />
        </section>
    );
}

export default ProductManagement;