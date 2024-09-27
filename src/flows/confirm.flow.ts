import { addKeyword, EVENTS } from "@bot-whatsapp/bot";

import AIClass from "../services/ai/index";

import { getHistoryParse, handleHistory } from "../utils/handleHistory";

import {guardarConcepto} from "../services/api/concepto"
import {guardarVenta} from "../services/api/ventas"

const PROMPT = `
    
    tu tarea principal es analizar la información proporcionada en el contexto y generar un objeto JSON que se adhiera a la estructura especificada a continuación. 

    Historial de Conversacion:
    -----------------------------------
    {HISTORIAL_CONVERSACION}
    
    Objeto JSON a generar:
       {
   "nombre": "[obtener el nombre del cliente]",
   "tipo": "[recojo/delivery]",
   "direccion": "[obtener la dirección si es para delivery, de lo contrario, null]",
   "hora_de_recojo": "[obtener la hora si es para recojo, de lo contrario, null]",
   "metodo": "[obtener el método de pago: yape/plin/transferencia]",
   "dni": "[número de 8 cifras], de lo contrario null",
   "importe": [total del pedido],
   "ventas": [
     {"plato": "hamburguesa clásica", "cantidad": 2, "precio_unitario": 14},
     {"plato": "huevo adicional", "cantidad": 1, "precio_unitario": 3}
   ]
  
   Los siguientes datos, son obligatorios: Nombre, tipo, metodo de pago , importe y ventas.
 }
    `

const generateJsonParse = (history: string) => {

  const mainPrompt = PROMPT
      .replace('{HISTORIAL_CONVERSACION}', history)

  return mainPrompt
}

/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowConfirm = addKeyword(EVENTS.ACTION)
//Llamamos ia
//Guardamos en bd 
//Luego enviamos a judith
.addAction(async (_, {state, flowDynamic }) => {

    const history = getHistoryParse(state)
    console.log(history)

    const promptSchedule = generateJsonParse(history)
    const dataConcepto= await ai.handleMsgChatGPT(promptSchedule);
   console.log(dataConcepto)
 
      const a=dataConcepto.replace("```","").replace("json","").replace("```","").trim()
      //guardamos concepto
      await guardarConcepto(a)

      
      //con el for iteramos y guardamos cada valor 
     /* for (let i = 0; i < (valor.ventas.length); i++) {
        let dataVentas = {
          "hamburguesa": valor.ventas[i].plato,
          "cantidad": valor.ventas[i].cantidad,
          "precioUnitario": valor.ventas[i].precio_unitario,
          "importe": parseInt(valor.ventas[i].precio_unitario) * parseInt(valor.ventas[i].cantidad)
        }
        await guardarVenta(dataVentas)

      }*/
      //guardar concepto
      await flowDynamic('Pedido Confirmado. . .')

    /*  await flowDynamic([
        {
           media: 'G:\Proyectos IS\Chatbot\chatbotTs\bot-peluqueria\src\media\stickerconfirmado.webp'
            
        }
    ]) */
})

export { flowConfirm }