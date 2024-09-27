import { addKeyword, EVENTS } from "@bot-whatsapp/bot";
import { handleHistory } from "../utils/handleHistory";
import { typing } from "../utils/others/typing";
import fs from 'fs';
import path from 'path';

const flowMen = addKeyword(EVENTS.ACTION)
   /* .addAction(async (ctx: any, { state, provider, }) => {
        try {
            await typing(ctx, provider);

            // Construye la ruta correctamente
            const tmpDir = path.join(process.cwd(), 'src', 'media', 'menu.jpg');
            console.log(tmpDir);

            if (provider && provider.vendor && provider.vendor.sendPresenceUpdate) {
                const id = ctx.key.remoteJid;
                const imageBuffer = fs.readFileSync('e:/FinFinalCarNuev/bot-promp/media/menu.jpg');
                await provider.vendor.sendMessage(
                    id,
                    {
                        image: imageBuffer,
                        mimetype: 'image/jpeg', // Asegúrate de especificar el tipo MIME correcto
                        caption: 'Aquí tienes el menú'
                    }
                );
            }

        } catch (error) {
            console.log(`[ERROR]:`, error);
            throw error; // Lanzar el error para que sea manejado por el código que llamó a este bloque try-catch
        }
    })*/
    /*.addAnswer('Menu Carretero', {
        media:'https://concepto.de/wp-content/uploads/2020/12/imagen-e1607991758274-800x400.jpg'
    })*/
        .addAnswer('Este mensaje envia una imagen', {
            media: 'https://i.imgur.com/0HpzsEm.png',
    })
    .addAnswer(['🍔 Bienvenidos al Carretero🔥 completa los siguientes datos por favor:\n' +
        'Nombre:\n' +
        'DNI: (en caso desee boleta)\n' +
        'Pedido: \n' +
        'Recojo o Delivery:\n' +
        'Hora de recojo(solo para recojo):\n' +
        'Dirección(solo para delivery):\n' +
        'Método de pago:\n'
    ], null, async (ctx, { state }) => {
        await handleHistory({ content: "Se envió el menu al user", role: 'assistant' }, state)
    });

export { flowMen };
