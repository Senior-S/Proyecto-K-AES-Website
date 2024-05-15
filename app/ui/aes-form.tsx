'use client';

import { useFormState } from "react-dom";
import { checkAESKey } from "@/app/lib/actions";

export default function AesForm() {
    const prevState = { errors: {}, message: '' };
    const [state, action] = useFormState(checkAESKey, prevState);

    return (
        <form action={action}>
            <div className="text-center">
                <div className="mb-4">
                    <label htmlFor="text" className="block font-semibold">
                        Texto encriptado
                    </label>
                    <input
                        id="aes-text"
                        name="encryptedText"
                        type="text"
                        placeholder="Ingrese el texto encriptado..."
                        defaultValue="p5bvook9RnPQBLSQ3ckPKQ=="
                        readOnly /* Hardcoded value to avoid users changing the actual ARG key. */
                        className="block min-w-56 rounded-md border-2 border-[#EEEEEE] py-1 pl-1 text-sm outline-2 text-black placeholder:text-gray-500 focus:outline-none focus:border-[#76ABAE] disabled:bg-[#EEEEEE]"
                        aria-describedby="text-error" />
                    <div id="text-error" aria-live="polite" aria-atomic="true" className="flex justify-center">
                        {state?.errors?.text &&
                            state.errors?.text?.map((error: string) => (
                                <p className="mt-1 max-w-48 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="key" className="block font-semibold">
                        Clave secreta
                    </label>
                    <input
                        id="aes-key"
                        name="key"
                        type="text"
                        autoComplete="off"
                        placeholder="Ingrese la clave secreta..."
                        className="block min-w-56 rounded-md border-2 border-[#EEEEEE] py-1 pl-1 text-sm outline-2 text-black placeholder:text-gray-500 focus:outline-none focus:border-[#76ABAE]"
                        aria-describedby="key-error" />
                    <div id="key-error" aria-live="polite" aria-atomic="true" className="flex justify-center">
                        {state?.errors?.key &&
                            state.errors.key.map((error: string) => (
                                <p className="mt-1 max-w-48 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>

                </div>
            </div>
            <div className="flex justify-center">
                <button type="submit" className="rounded-lg p-2 h-10 bg-[#EEEEEE] text-black">Probar clave</button>
            </div>
            {state?.message &&
                <div className="bg-[#31363F] border border-[#EEEEEE] w-full rounded-lg py-2 mt-4">
                    <p className="text-center mt-1 text-sm text-red-500 font-bold">
                        {state.message}
                    </p>
                </div>
            }
        </form>
    )
}