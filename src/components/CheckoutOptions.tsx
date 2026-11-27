
import type { Checkout } from "../types";
import FieldErrors from "./FieldErrors";
import { Banknote, CreditCard, BellElectric, PaperBag } from "lucide-react";

type CheckoutOptionsProps = {
    ritiro: Checkout["ritiro"];
    pagamento: Checkout["pagamento"];
    onRitiroChange: (ritiro: Checkout["ritiro"]) => void;
    onPagamentoChange: (pagamento: Checkout["pagamento"]) => void;
    errorsRitiro: string[];
    errorsPagamento: string[];
    recreationFull: boolean;

};

function CheckoutOptions({
    ritiro,
    pagamento,
    onRitiroChange,
    onPagamentoChange,
    errorsRitiro,
    errorsPagamento,
    recreationFull,
}: CheckoutOptionsProps) {
    return (
        <>
            <div className="space-y-2">
                <p className="font-medium">Ritiro</p>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => onRitiroChange("ricreazione")}
                        disabled={recreationFull}

                        className={`rounded-lg border px-4 py-2 ${recreationFull
                            ? "cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400"
                            : ritiro === "ricreazione"
                                ? "border-black bg-orange-500 text-black"
                                : "border-gray-300 bg-white text-gray-700"
                            }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <BellElectric size={18} />

                            Ricreazione
                        </span>

                    </button>

                    <button
                        type="button"
                        onClick={() => onRitiroChange("pranzo")}
                        className={`rounded-lg border px-4 py-2 ${ritiro === "pranzo"
                            ? "border-black bg-purple-500 text-black"
                            : "border-gray-300 bg-white text-gray-700"
                            }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <PaperBag size={18} />

                            Pranzo
                        </span>
                    </button>
                </div>
                {recreationFull && ritiro === "ricreazione" && (
                    <p className="text-sm text-red-600">
                        La ricreazione è al completo. Seleziona il ritiro a pranzo.
                    </p>
                )}

                <FieldErrors errors={errorsRitiro} />
            </div>

            <div className="space-y-2">
                <p className="font-medium">Pagamento</p>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => onPagamentoChange("contanti")}
                        className={`rounded-lg border px-4 py-2 ${pagamento === "contanti"
                            ? "border-black bg-green-500 text-black"
                            : "border-gray-300 bg-white text-gray-700"
                            }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Banknote size={18} />
                            Contanti
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onPagamentoChange("carta")}
                        className={`rounded-lg border px-4 py-2 ${pagamento === "carta"
                            ? "border-black bg-yellow-300 text-black"
                            : "border-gray-300 bg-white text-gray-700"
                            }`}
                    >
                        <span className="flex items-center justify-center gap-3">
                            <CreditCard size={18} />
                            Carta
                        </span>
                    </button>
                </div>

                <FieldErrors errors={errorsPagamento} />
            </div>
        </>
    );
}

export default CheckoutOptions;
