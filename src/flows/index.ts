import { createFlow } from "@bot-whatsapp/bot";
import welcomeFlow from "./welcome.flow";
import { flowPedido } from "./pedidos.flow";
import { flowConfirm } from "./confirm.flow";
import { flowSaludo } from "./saludo.flow";
import { flowDespedida } from "./despedida.flow";
import { flowVoice } from "./voice.flow";
import { flowMen } from "./carta.flow";

/**
 * Declaramos todos los flujos que vamos a utilizar
 */
export default createFlow(
    [welcomeFlow,
        flowSaludo,
        flowPedido,
        flowConfirm,
        flowDespedida,
        flowVoice,
        flowMen])