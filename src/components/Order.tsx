import formatPrice from "../utils/formatPrice";
import type { OrderItem, Product } from "../types";

interface OrderProps {
    order: OrderItem[];
    products: Product[];
    total: number;
    onQuantityChange: (id: string, change: number) => void;
}

function Order({ order, products, total, onQuantityChange }: OrderProps) {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">Il tuo ordine</h2>

            {order.length === 0 ? (
                <p className="text-gray-500">
                    Nessun prodotto aggiunto.
                </p>
            ) : (
                <>
                    <div className="space-y-4">
                        {order.map((item) => {
                            const product = products.find(
                                (product) => product.id === item.productId
                            );

                            if (!product) return null;

                            return (
                                <div
                                    key={item.productId}
                                    className="grid grid-cols-[minmax(0,1fr)_auto_96px] items-center gap-3"
                                >
                                    <p className="font-semibold">
                                        {product.name}
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onQuantityChange(item.productId, -1)
                                            }
                                            className="h-10 w-10 rounded-full bg-gray-200 font-bold"
                                        >
                                            −
                                        </button>

                                        <span className="min-w-3 text-center font-semibold">
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onQuantityChange(item.productId, 1)
                                            }
                                            disabled={item.quantity >= 5}
                                            className="h-10 w-10 rounded-full bg-gray-200 font-bold disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="text-right">
                                        {formatPrice(product.price * item.quantity)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-gray-300 pt-4">
                        <p className="text-right text-xl font-bold">
                            Totale: {formatPrice(total)}
                        </p>
                    </div>
                </>
            )}
        </section>
    );
}

export default Order;