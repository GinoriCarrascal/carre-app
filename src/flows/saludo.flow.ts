import { addKeyword, EVENTS } from "@bot-whatsapp/bot";
import { handleHistory } from "../utils/handleHistory";
import { typing } from "../utils/others/typing";

import welcomeFlow from "./welcome.flow";

let saludoInicial = [
    "¡Hola! ¡Bienvenido  *El Carretero*🔥🍔🍗! ",
    "¡Hola! ¡Qué alegría verte aquí en *El Carretero*🔥🍔🍗! ",
    "¡Bienvenido a *El Carretero*🔥🍔🍗! ",
    "¡Hola! ¡Qué bueno que estás en *El Carretero*🔥🍔🍗! ",
    "¡Hola! En *El Carretero*🔥🍔🍗 siempre es un placer recibirte.",
    "¡Bienvenido al WhatsApp de *El Carretero*🔥🍔🍗! ",
    "¡Hola! ¡Qué gusto tenerte aquí en *El Carretero*🔥🍔🍗! ",
    "¡Bienvenido a *El Carretero*🔥🍔🍗! ",
    "¡Hola! ¡Bienvenido al WhatsApp de *El Carretero*🔥🍔🍗!",
    "¡Hola amigo! ¡Qué bueno verte de nuevo en *El Carretero*🔥🍔🍗! ",
    "¡Hola! ¡Qué emoción tenerte aquí en *El Carretero*🔥🍔🍗!",
    "¡Bienvenido a *El Carretero*🔥🍔🍗! "
  ]

function aleatorio(lista) {
    try {
        let aleatorio = lista[Math.floor(Math.random() * lista.length)];
        return aleatorio;
    } catch (err) {
        console.log(err);
        return;
    }
}

const flowSaludo = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { state, provider, flowDynamic ,gotoFlow}) => {
        try {
            await typing(ctx, provider)
            const sal=aleatorio(saludoInicial)
            await flowDynamic(sal)
            await handleHistory({ content: sal, role: 'assistant' }, state)
           // gotoFlow(welcomeFlow)

        } catch (error) {
            console.log(`[ERROR]:`, error)
            return error
        }

    })


export { flowSaludo }
