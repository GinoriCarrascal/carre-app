import { addKeyword, EVENTS } from "@bot-whatsapp/bot";

import AIClass from "../services/ai";
import { getHistoryParse, handleHistory } from "../utils/handleHistory";
import { generateTimer } from "../utils/generateTimer";

const faq=`
     question: ¿Cuáles son las hamburguesas más populares?",
    answer: Nuestras hamburguesas más populares son la Doble Cheeseburger, la BBQ Bacon, y la Veggie Deluxe. ¿Te gustaría más información sobre alguna de ellas?
    
    question: ¿Tienen opciones vegetarianas/veganas?
    answer: Sí, ofrecemos la Veggie Deluxe y la Beyond Burger, que son completamente veganas. ¿Te gustaría añadir una a tu pedido?
    
    question: ¿Qué bebidas ofrecen?
    answer: Tenemos una variedad de bebidas, incluyendo refrescos, jugos naturales, y cervezas artesanales. ¿Te gustaría ver la lista completa?
    
    question: ¿Tienen combos familiares?
    answer: Sí, ofrecemos combos familiares que incluyen hamburguesas, papas fritas y bebidas a un precio especial. ¿Te gustaría más detalles?
    
    question: ¿Puedo personalizar mi hamburguesa?
    answer: Claro, puedes agregar o quitar ingredientes como desees. ¿Cómo te gustaría personalizar tu hamburguesa?
    
    question: ¿Cuánto tiempo tardará mi pedido en llegar?
    answer: El tiempo de entrega depende de tu ubicación y la cantidad de pedidos que tengamos en ese momento. Generalmente, la entrega toma entre 30 y 45 minutos.
    
    question: ¿Cuál es el costo de envío?
    answer: El costo de envío depende de la distancia a tu ubicación.
    
    question: ¿Puedo hacer un pedido para recoger?
    answer: Sí, puedes hacer un pedido para recoger. Solo selecciona la opción de recogida al hacer tu pedido y te avisaremos cuando esté listo.
    
    question: ¿Cómo puedo cancelar o modificar mi pedido?
    answer: Puedes cancelar o modificar tu pedido antes de que sea confirmado. ¿Te gustaría hacer algún cambio?
    
    question: ¿Puedo programar un pedido para más tarde?
    answer: Sí, puedes programar un pedido para una hora específica.
    
    question: ¿Qué métodos de pago aceptan?
    answer: Aceptamos pagos con tarjeta de crédito, débito, efectivo al recibir, yape y plin.
    
    question: ¿Puedo pagar en efectivo al recibir mi pedido?
    answer: Sí, puedes pagar en efectivo al recibir tu pedido. Asegúrate de tener el monto exacto, ya que nuestros repartidores no siempre llevan cambio.
    
    question: ¿Tienen promociones o descuentos?
    answer: Sí, ofrecemos promociones especiales cada semana. ¿Te gustaría conocer las promociones actuales?
    
    question: ¿Cuáles son sus horarios de atención?
    answer: Estamos abiertos todos los días de 5:00 PM a 12:00 AM.
    
    question: ¿Dónde están ubicados?
    answer: Estamos ubicados en Jr. Irene Silva 183, cerca de la UPN y la vía de evitamiento."`


const PROMPT_SCHEDULE = `

Eres el asistente virtual que atiende dudas sobre los clientes, en el caso que no sepas
 contesta que no tienes la informacion suficiente para contestar 

Historial de Conversacion:
-----------------------------------
{HISTORIAL_CONVERSACION}

BD preguntas frecuentes:
-----------------------------------
{PREGFREQ}

IMPORTANTE:
- NO saludes
- Respuestas cortas ideales para enviar por whatsapp con emojis
-----------------------------
Respuesta útil en primera persona:`

const generateSchedulePrompt = (history: string,faq: string) => {

    const mainPrompt = PROMPT_SCHEDULE
    .replace('{HISTORIAL_CONVERSACION}', history)
    .replace('{PREGFREQ}', faq)

    return mainPrompt
}


const flowfreq = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { extensions, state, flowDynamic }) => {
        const ai = extensions.ai as AIClass
        const history = getHistoryParse(state)
        const promptSchedule = generateSchedulePrompt(history,faq)

        const text = await ai.createChat([
            {
                role: 'system',
                content: promptSchedule
            },
            {
                role: 'user',
                content: `Cliente pregunta: ${ctx.body}`
            }
        ], 'gpt-4')
    
        await handleHistory({ content: text, role: 'assistant' }, state)
    
        const chunks = text.split(/(?<!\d)\.\s+/g);
        for (const chunk of chunks) {
            await flowDynamic([{ body: chunk.trim(), delay: generateTimer(150, 250) }]);
        }
    
    }
       
)
    

export { flowfreq }