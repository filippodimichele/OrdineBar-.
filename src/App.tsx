
import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import Order from "./components/Order";
import CheckoutForm from "./components/CheckoutForm";
import PendingOrders from "./components/PendingOrders";
import ProductManagement from "./components/ProductManagement";
import formatPrice from "./utils/formatPrice";
import type { Checkout, OrderItem, ConfirmedOrder, Product } from "./types";
import { env } from "./utils/env";

function App() {
    const [order, setOrder] = useState<OrderItem[]>([]);
    const [confirmation, setConfirmation] = useState("");
    const [orderError, setOrderError] = useState("");
    const [pendingOrders, setPendingOrders] = useState<ConfirmedOrder[]>([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState("");

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [productError, setProductError] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [collectionError, setCollectionError] = useState("");

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch(`${env.backendUrl}/orders`);

                if (!response.ok) {
                    throw new Error();
                }

                const data: ConfirmedOrder[] = await response.json();
                setPendingOrders(data);
            } catch {
                setOrdersError("Impossibile caricare gli ordini.");
            } finally {
                setIsOrdersLoading(false);
            }
        }

        fetchOrders();
    }, []);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`${env.backendUrl}/ordinebar`);

                if (!response.ok) {
                    throw new Error();
                }

                const data: Product[] = await response.json();
                setProducts(data);
            } catch {
                setLoadError("Impossibile caricare il menu.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const productsById = new Map(
        products.map((product) => [product.id, product])
    );

    const recreationOrdersCount = pendingOrders.filter(
        (pendingOrder) => pendingOrder.ritiro === "ricreazione"
    ).length;

    const recreationFull = recreationOrdersCount >= 3;

    // calcolo del totale corrente del carrello
    const total = order.reduce((sum, item) => {
        const product = productsById.get(item.productId);

        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    // aggiunta di un prodotto al database
    async function handleAddProduct(productData: Omit<Product, "id">) {
        setProductError("");

        try {
            const response = await fetch(`${env.backendUrl}/ordinebar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error();
            }

            const newProduct: Product = await response.json();

            setProducts((prevProducts) => [...prevProducts, newProduct]);
        } catch {
            setProductError("Errore durante l'aggiunta del prodotto.");
        }
    }

    // modifica di un prodotto nel database
    async function handleUpdateProduct(
        id: string,
        productData: Omit<Product, "id">
    ) {
        setProductError("");

        try {
            const response = await fetch(`${env.backendUrl}/ordinebar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, ...productData }),
            });

            if (!response.ok) {
                throw new Error();
            }

            const updatedProduct: Product = await response.json();

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === id ? updatedProduct : product
                )
            );

            setEditingProduct(null);
        } catch {
            setProductError("Errore durante la modifica del prodotto.");
        }
    }

    // eliminazione di un prodotto dal database
    async function handleDeleteProduct(id: string) {
        setProductError("");

        try {
            const response = await fetch(`${env.backendUrl}/ordinebar/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error();
            }

            setProducts((prevProducts) =>
                prevProducts.filter((product) => product.id !== id)
            );

            setOrder((prevOrder) =>
                prevOrder.filter((item) => item.productId !== id)
            );

            if (editingProduct?.id === id) {
                setEditingProduct(null);
            }
        } catch {
            setProductError("Errore durante l'eliminazione del prodotto.");
        }
    }

    // aggiunta di prodotti al carrello con limite massimo di quantità
    function handleAdd(id: string) {
        setConfirmation("");
        setOrderError("");

        setOrder((prevOrder) => {
            const existingItem = prevOrder.find(
                (item) => item.productId === id
            );

            if (existingItem && existingItem.quantity >= 5) {
                return prevOrder;
            }

            return existingItem
                ? prevOrder.map((item) =>
                    item.productId === id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
                : [...prevOrder, { productId: id, quantity: 1 }];
        });
    }

    // aggiornamento delle quantità e rimozione dei prodotti dal carrello
    function handleQuantityChange(id: string, change: number) {
        setConfirmation("");
        setOrderError("");

        setOrder((prevOrder) =>
            prevOrder
                .map((item) =>
                    item.productId === id
                        ? { ...item, quantity: Math.min(item.quantity + change, 5) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    // creazione e registrazione di un ordine confermato
    async function handleConfirmOrder(checkout: Checkout, finalTotal:number): Promise<boolean> {
        setConfirmation("");
        setOrderError("");

        if (
            checkout.ritiro === "ricreazione" &&
            pendingOrders.filter(
                (pendingOrder) => pendingOrder.ritiro === "ricreazione"
            ).length >= 3
        ) {
            setOrderError("La ricreazione è al completo. Seleziona il ritiro a pranzo.");
            return false;
        }



        const confirmedOrder: ConfirmedOrder = {
            id: Date.now(),
            nome: checkout.nome.trim(),
            classe: checkout.classe.trim(),
            ritiro: checkout.ritiro,
            pagamento: checkout.pagamento,
            note: checkout.note.trim(),
            products: order.map((item) => {
                const product = productsById.get(item.productId)!;

                return {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                };
            }),
            total: finalTotal,

        };

        try {
            const response = await fetch(`${env.backendUrl}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(confirmedOrder),
            });

            if (!response.ok) {
                throw new Error();
            }

            const savedOrder: ConfirmedOrder = await response.json();

            setPendingOrders((prevOrders) => [...prevOrders, savedOrder]);

            setConfirmation(
                `Ordine per ${savedOrder.nome} (${savedOrder.classe}), ritiro a ${savedOrder.ritiro}, ${savedOrder.pagamento}: ${formatPrice(savedOrder.total)}`
            );

            setOrder([]);
            return true;
        } catch {
            setOrderError("Errore durante il salvataggio dell'ordine.");
            return false;
        }
    }

    // rimozione di un ordine dopo il ritiro
    async function handleOrderCollected(id: number) {
        setCollectionError("");

        try {
            const response = await fetch(`${env.backendUrl}/orders/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error();
            }

            setPendingOrders((prevOrders) =>
                prevOrders.filter((item) => item.id !== id)
            );
        } catch {
            setCollectionError("Errore durante l'eliminazione dell'ordine.");
        }
    }

    return (
        <main className="mx-auto max-w-2xl space-y-8 p-6">
            <h1 className="text-center text-3xl font-bold">
                Il bar della scuola
            </h1>

            <ProductManagement
                onAdd={handleAddProduct}
                onUpdate={handleUpdateProduct}
                editingProduct={editingProduct}
                onCancelEdit={() => setEditingProduct(null)}
                error={productError}
            />

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Menu</h2>

                {isLoading ? (
                    <p>Caricamento menu...</p>
                ) : loadError ? (
                    <p className="font-semibold text-red-600">
                        {loadError}
                    </p>
                ) : (
                    <Menu
                        products={products}
                        onAdd={handleAdd}
                        onEdit={setEditingProduct}
                        onDelete={handleDeleteProduct}
                        order={order}
                    />
                )}
            </section>

            <Order
                order={order}
                products={products}
                total={total}
                onQuantityChange={handleQuantityChange}
            />

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Conferma ordine</h2>

                <CheckoutForm
                    onSubmit={handleConfirmOrder}
                    disabled={order.length === 0}
                    total={total}
                    error={orderError}
                    recreationFull={recreationFull}
                />

                {confirmation && (
                    <p className="font-semibold text-green-800">
                        {confirmation}
                    </p>
                )}
            </section>

            {isOrdersLoading ? (
                <p>Caricamento ordini...</p>
            ) : ordersError ? (
                <p className="font-semibold text-red-600">
                    {ordersError}
                </p>
            ) : (
                <>
                    {collectionError && (
                        <p className="font-semibold text-red-600">
                            {collectionError}
                        </p>
                    )}
                    <PendingOrders
                        orders={pendingOrders}
                        onCollected={handleOrderCollected}
                    />
                </>
            )}
        </main>
    );
}

export default App;
