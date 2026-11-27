
import { useState, type FormEvent } from "react";
import type { Checkout } from "../types";
import CheckoutOptions from "./CheckoutOptions";
import CheckoutFields from "./CheckoutFields";
import { emptyErrors, getCheckoutErrors, } from "../utils/checkoutValidation";
import type { FormErrors } from "../utils/checkoutValidation";
import { Check } from "lucide-react";
import DiscountCode from "./DiscountCode";
import { calculateDiscount, calculateDiscountedTotal, validateDiscountCode } from "../utils/discount";
import formatPrice from "../utils/formatPrice"

type CheckoutFormProps = {
    onSubmit: (checkout: Checkout, finalTotal: number) => Promise<boolean>;
    disabled: boolean;
    total: number;
    error: string;
    recreationFull: boolean;
};

// gestione del modulo di conferma attraverso un unico stato
function CheckoutForm({ onSubmit, disabled, total, error, recreationFull }: CheckoutFormProps) {
    // stato centralizzato contenente tutti i campi del modulo

    const [checkout, setCheckout] = useState<Checkout>({
        nome: "",
        classe: "",
        ritiro: "ricreazione",
        pagamento: "contanti",
        note: "",
    });


    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const discount = appliedCode ? calculateDiscount(total) : 0;
    const discountedTotal = calculateDiscountedTotal(total, discount);
    const [discountCode, setDiscountCode] = useState("");
    // gestione dei tentativi di invio
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // aggiornamento automatico degli errori dopo il primo invio
    const errors: FormErrors = hasSubmitted
        ? getCheckoutErrors(checkout, discountedTotal)
        : emptyErrors();

    if (hasSubmitted && recreationFull && checkout.ritiro === "ricreazione") {
        errors.ritiro.push(
            "La ricreazione è al completo. Seleziona il ritiro a pranzo."
        );
    }

    // aggiornamento dei dati del modulo
    function updateCheckout(updatedCheckout: Checkout) {
        setCheckout(updatedCheckout);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        // impedisce il ricaricamento della pagina durante l'invio
        event.preventDefault();

        setHasSubmitted(true);

        const validationErrors = getCheckoutErrors(checkout, discountedTotal);

        if (discountCode.trim() !== "" && !validateDiscountCode(discountCode)) {
            return;
        }
        if (recreationFull && checkout.ritiro === "ricreazione") {
            validationErrors.ritiro.push(
                "La ricreazione è al completo. Seleziona il ritiro a pranzo."
            );
        }

        const hasErrors = Object.values(validationErrors).some(
            (fieldErrors) => fieldErrors.length > 0
        );

        if (hasErrors || disabled) {
            return;
        }

        // invio ad App dei dati validati del modulo
        const success = await onSubmit(
            {
                ...checkout,
                nome: checkout.nome.trim(),
                classe: checkout.classe.trim(),
            },
            discountedTotal
        );

        if (!success) {
            return;
        }

        // ripristino dello stato iniziale dopo la conferma
        setCheckout({
            nome: "",
            classe: "",
            ritiro: "ricreazione",
            pagamento: "contanti",
            note: "",
        });

        setHasSubmitted(false);
        setAppliedCode(null);
        setDiscountCode("");
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <CheckoutFields
                nome={checkout.nome}
                classe={checkout.classe}
                note={checkout.note}
                errorsNome={errors.nome}
                errorsClasse={errors.classe}
                errorsNote={errors.note}
                onNomeChange={(nome) =>
                    updateCheckout({ ...checkout, nome })
                }
                onClasseChange={(classe) =>
                    updateCheckout({ ...checkout, classe })
                }
                onNoteChange={(note) =>
                    updateCheckout({ ...checkout, note })
                }
            />

            <DiscountCode
                appliedCode={appliedCode}
                onApply={setAppliedCode}
                onRemove={() => setAppliedCode(null)}
                onCodeChange={setDiscountCode}
            />

            <div className="space-y-1 rounded-lg bg-gray-50 p-3">
                <div className="flex justify-between">
                    <span>Subtotale</span>
                    <span>{formatPrice(total)}</span>
                </div>

                {appliedCode && (
                    <div className="flex justify-between text-green-600">
                        <span>Sconto {appliedCode}</span>
                        <span>-{formatPrice(discount)}</span>
                    </div>
                )}

                <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Totale</span>
                    <span>{formatPrice(discountedTotal)}</span>
                </div>
            </div>

            <CheckoutOptions
                ritiro={checkout.ritiro}
                pagamento={checkout.pagamento}
                recreationFull={recreationFull}
                onRitiroChange={(ritiro) =>
                    updateCheckout({ ...checkout, ritiro })
                }
                onPagamentoChange={(pagamento) =>
                    updateCheckout({ ...checkout, pagamento })
                }
                errorsRitiro={errors.ritiro}
                errorsPagamento={errors.pagamento}
            />

            {error && (
                <p className="font-semibold text-red-600">
                    {error}
                </p>
            )}
            <button
                type="submit"
                disabled={disabled}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
            >
                <span className="flex items-center justify-center gap-2">
                    <Check size={18} />
                    Conferma ordine
                </span>
            </button>
        </form>
    );
}

export default CheckoutForm;
