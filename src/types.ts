// dati raccolti dal modulo di conferma dell'ordine
export type Checkout = {
    nome: string;
    classe: string;
    ritiro: "ricreazione" | "pranzo";
    pagamento: "contanti" | "carta";
    note: string;
};

// dati dei prodotti del menu
export type Product = {
    id: string;
    name: string;
    price: number;
    category: "panini" | "bevande" | "dolci";
};

// identificativo del prodotto e quantità nel carrello
export type OrderItem = {
    productId: string;
    quantity: number;
};

// dati dell'ordine salvati al momento della conferma
export type ConfirmedOrder = {
    id: number;
    nome: string;
    classe: string;
    ritiro: Checkout["ritiro"];
    pagamento: Checkout["pagamento"];
    note: string;
    products: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    total: number;
};