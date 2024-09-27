import { addKeyword } from "@bot-whatsapp/bot";
//Generador de id
//import { nanoid } from 'nanoid';

interface Context {
  from: string;
}

interface Provider {
  getInstance(): Promise<any>;
}

/**
 * Esto se ejecuta cuando la persona escribe "AGENTE"
 */
const flowAgente = addKeyword("AGENTE")
  .addAnswer(
    "Estamos desviando tu conversación a nuestro agente"
  )
  .addAction(async (ctx: Context, { provider }: { provider: Provider }) => {
    const ID_GROUP = nanoid(5);
    const refProvider = await provider.getInstance();
    await refProvider.groupCreate(`Atención al cliente (${ID_GROUP})`, [
      `${ctx.from}@s.whatsapp.net`
    ]);
  })
  .addAnswer('¡Te hemos agregado a un grupo con un asesor! Gracias');

export default flowAgente;