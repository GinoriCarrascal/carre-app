import { BotContext, BotMethods } from "@bot-whatsapp/bot/dist/types"
import { getHistoryParse } from "../utils/handleHistory"

/*
import AIClass from "../services/ai/AIClass"
const ai=new AIClass();*/
import { flowPedido } from "../flows/pedidos.flow"
import { flowConfirm } from "../flows/confirm.flow"
import { flowSaludo } from "../flows/saludo.flow"
import { flowDespedida } from "../flows/despedida.flow";
import { flowMen } from "../flows/carta.flow";

import AIClass from "../services/ai/index"


/**
 * Determina que flujo va a iniciarse basado en el historial que previo entre el bot y el humano
 */
export default async (_: BotContext, { state, gotoFlow,extensions }: BotMethods) => {
    const ai = extensions.ai as AIClass
    const history = getHistoryParse(state)
    console.log(history)

    const prompt = `Como una inteligencia artificial avanzada, tu tarea es analizar el contexto de una conversación y determinar cuál de las siguientes acciones es más apropiada para realizar:
    --------------------------------------------------------
    Historial de conversación:
    {HISTORY}
    
    Posibles acciones a realizar:
    1. INICIO: Esta acción se debe realizar se esta iniciando la conversacion.
    2. PEDIDO: Esta acción se debe realizar cuando el cliente expresa su deseo de realizar un pedido.
    3. CONFIRMACION: Esta acción se debe realizar cuando el cliente expresa su deseo de realizar un pedido.
    4. ADIOS: Esta acción se debe realizar cuando el cliente expresa su deseo de realizar un pedido.
    5. FREC: Esta acción se debe realizar cuando el cliente expresa su deseo de realizar un pedido.
    
    -----------------------------
    Tu objetivo es comprender la intención del cliente y seleccionar la acción más adecuada en respuesta a su declaración, si no se 
    encuentra dentro de estos responde amablemente hasta encontrar su intencion claramente
    
    Respuesta ideal (PEDIDOS|UBICACIÓN|HORARIO|CONFIRMAR|ADIOS|SALUDAR):`.replace('{HISTORY}', history)

    const text = await ai.createChat([
        {
            role: 'system',
            content: prompt
        }
    ])


    try {
        switch (true) {
            case text.includes('PEDIDOS'):
                return gotoFlow(flowPedido);
            case text.includes('CONFIRMAR'):
                return gotoFlow(flowConfirm);
            case text.includes('ADIOS'):
                return gotoFlow(flowDespedida);
            case text.includes('INICIO'):
                return gotoFlow(flowSaludo);
            case text.includes('MENU'):
                return gotoFlow(flowMen);
            default:
                console.log("No matching action found");
                break;
        }
    } catch (error) {
        console.error("Error in switch statement:", error);
        return error;
    }
    
}