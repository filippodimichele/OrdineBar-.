
import type { ConfirmedOrder } from "../types";
import formatPrice from "../utils/formatPrice";

type PendingOrdersProps = {
    orders: ConfirmedOrder[];
    onCollected: (id: number) => void;
};

function PendingOrders({ orders, onCollected }: PendingOrdersProps) {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">Da ritirare</h2>

            {orders.length === 0 ? (
                <p className="text-gray-500">Nessun ordine in attesa.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const subtotal = order.products.reduce(
                            (sum, product) => sum + product.price * product.quantity,
                            0
                        );

                        const discount = subtotal - order.total;

                        return (
                            <article
                                key={order.id}
                                className="space-y-3 rounded-2xl border border-gray-300 p-4"
                            >
                                <div>
                                    <h3 className="font-bold">
                                        {order.nome} ({order.classe})
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Ritiro: {order.ritiro}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Pagamento: {order.pagamento}
                                    </p>
                                    {order.note && (
                                        <p className="text-sm text-gray-500">
                                            Note: {order.note}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    {order.products.map((product) => (
                                        <div
                                            key={product.productId}
                                            className="flex justify-between gap-4"
                                        >
                                            <span>
                                                {product.name} × {product.quantity}
                                            </span>
                                            <span>
                                                {formatPrice(product.price * product.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap items-end justify-between gap-4 border-t border-gray-300 pt-3">
                                    <div className="space-y-1">
                                        <div className="flex justify-between gap-4 text-sm">
                                            <span>Subtotale</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>

                                        {discount > 0 && (
                                            <div className="flex justify-between gap-4 text-sm text-green-600">
                                                <span>Sconto applicato</span>
                                                <span>-{formatPrice(discount)}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between gap-4 font-bold">
                                            <span>Totale</span>
                                            <span>{formatPrice(order.total)}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onCollected(order.id)}
                                        className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                                    >
                                        Ritirato
                                    </button>
                                </div>
                            </article>
                        );

                    })}
                </div>
            )}
        </section>
    );
}

export default PendingOrders;
