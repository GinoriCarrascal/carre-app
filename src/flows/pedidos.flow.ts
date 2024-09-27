import { addKeyword, EVENTS } from "@bot-whatsapp/bot";

import AIClass from "../services/ai";
import { getHistoryParse, handleHistory } from "../utils/handleHistory";
import { generateTimer } from "../utils/generateTimer";

import { getHamburguesas } from "src/services/api/hamburguesas";

const PROMPT_SCHEDULE = `
Eres el asistente virtual que atiende la toma pedidos del restaurante "El carretero",
tu objetivo es obtener todos los datos referentes del cliente para el pedido, lo cuales incluye(Nombre,pedido, tipo de )

Historial de Conversacion:
-----------------------------------
{HISTORIAL_CONVERSACION}

Base de datos restaurantes:
-----------------------------------
{BD_HAMBURGUESAS}

Base de calles:
-----------------------------------
{BD_CALLES}

INSTRUCCIONES PARA RESPONDER AL CLIENTE:
- Previamente se envió la carta al cliente,

Paso 2: ACTÚA COMO CAJERO PARA EL RESTAURANTE DE HAMBURGUESAS "EL CARRETERO"
Usando la {BD_HAMBURGUESAS},elabora una lista de precios detallada, por ejemplo:

2 hamburguesas clásicas: 28 soles
1 huevo adicional: 3 soles
Total parcial: 31 soles
Si el tipo de servicio es delivery, agrega:

Costo de delivery: 7 soles
Total a pagar: 38 soles

IMPORTANTE:
- NO saludes
- Respuestas cortas ideales para enviar por whatsapp con emojis
-----------------------------
Respuesta útil en primera persona:`

const generateSchedulePrompt = (history: string,bd: string) => {

    const mainPrompt = PROMPT_SCHEDULE
        .replace('{HISTORIAL_CONVERSACION}', history)
        .replace('{BD_HAMBURGUESAS}', bd)

    return mainPrompt
}


const flowPedido = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { extensions, state, flowDynamic }) => {
        const ai = extensions.ai as AIClass
        const history = getHistoryParse(state)
        const menus = await getHamburguesas()
        const listMenu = menus.data.map((menu) => `articulo:${menu.attributes.nombre}, precio:${menu.attributes.precio}`).join('; \n')
        const promptSchedule = generateSchedulePrompt(history, listMenu?.length ? listMenu : 'ninguna')

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
    

export { flowPedido }