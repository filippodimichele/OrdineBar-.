import { useState } from "react";
import { validateDiscountCode } from "../utils/discount";

type DiscountCodeProps = {
    onApply: (code: string) => void;
    onRemove: () => void;
    onCodeChange: (code: string) => void;
    appliedCode: string | null;
};

function DiscountCode({
    onApply,
    onRemove,
    onCodeChange,
    appliedCode,
}: DiscountCodeProps) {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    function handleApply() {
        const normalizedCode = code.trim().toUpperCase();

        if (!validateDiscountCode(normalizedCode)) {
            setError("Codice sconto non valido.");
            return;
        }

        setError("");
        onApply(normalizedCode);
    }

    function handleRemove() {
        setCode("");
        setError("");
        onCodeChange("");
        onRemove();
    }



    return (
        <div className="space-y-2">
            <label
                htmlFor="discount-code"
                className="block font-medium"
            >
                Codice sconto
            </label>

            <div className="flex gap-2">
                <input
                    id="discount-code"
                    type="text"
                    value={code}
                    onChange={(event) => {
                        setCode(event.target.value);
                        onCodeChange(event.target.value);
                        setError("");
                    }}
                    disabled={appliedCode !== null}
                    placeholder="Inserisci il codice"
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2"
                />

                {appliedCode === null ? (
                    <button
                        type="button"
                        onClick={handleApply}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        Applica
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                    >
                        Rimuovi
                    </button>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}

            {appliedCode !== null && (
                <p className="text-sm text-green-600">
                    Codice {appliedCode} applicato correttamente.
                </p>
            )}
        </div>
    );
}

export default DiscountCode;