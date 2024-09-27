import { createFlow } from "@bot-whatsapp/bot";
import welcomeFlow from "./welcome.flow";
import { flowUbicacion } from "./ubic.flow";
import { flowHorario } from "./horario.flow";
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
        flowUbicacion,
        flowSaludo,
        flowHorario,
        flowPedido,
        flowConfirm,
        flowDespedida,
        flowVoice,
        flowMen])