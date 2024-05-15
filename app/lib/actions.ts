'use server';

import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { z } from 'zod';
import { saveEcbIntent } from '@/app/lib/data';

export type FormState = {
    errors?: {
        text?: string[];
        key?: string[];
    };
    message?: string;
};

// The 24 characters length is required based on the actual keys of the ARG, in a normal AES decrypt system it won't be this strict.
const FormSchema = z.object({
    text: z.string({
        invalid_type_error: 'Especifique un texto a desencriptar.',
        required_error: 'Especifique un texto a desencriptar.'
    }).length(24, { message: 'El texto debe contener 24 caracteres.' })
    .startsWith('p5bvook9RnPQBLSQ3ckPKQ==', { message: 'El texto no puede ser diferente a la clave predefinida!' }),
    key: z.string({
        invalid_type_error: 'Especifique la key a usar.',
        required_error: 'Especifique la key a usar.'
    }).length(24, { message: 'La key debe contener 24 caracteres.' })
}).required();

const base64regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export async function checkAESKey(prevState: FormState, formData: FormData){
    const validateFields = FormSchema.safeParse({
        text: formData.get('encryptedText'),
        key: formData.get('key')
    });

    if(!validateFields.success){
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to check AES key.',
        };
    }

    const { text, key } = validateFields.data;

    const aesKey = Buffer.from(key, 'utf-8');
    
    let base64 = undefined;

    // If the key is base64 try to decode it and enforce a check to avoid decoding invalid base64.
    if(base64regex.test(key)){
        const base64String = Buffer.from(key, 'base64').toString();
        const encodedBase64 = Buffer.from(base64String, 'utf-8').toString('base64');

        if(encodedBase64 === key){
            base64 = base64String;
        }
    }

    let decrypted = undefined;
    try{
        const decipher = crypto.createDecipheriv('aes-192-ecb', aesKey, '');
        decrypted = decipher.update(text, base64 ? 'base64' : 'utf-8', 'utf-8');
        decrypted += decipher.final('utf-8');
    } catch(error){
        /* 
            This will be a common issue so lets ignore it for now.
         */
        // console.error(error);
        decrypted = undefined;
    }

    try{
        const success = await saveEcbIntent(key, base64, decrypted);
        if(success === false){
            return {
                message: 'La key ya se ha probado.'
            }
        }
    } catch(error){
        return {
            message: 'Database Error: Failed to check AES key.'
        };
    }

    revalidatePath('/');
}