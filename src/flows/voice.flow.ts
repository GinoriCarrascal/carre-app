//require("dotenv").config();
import { addKeyword,EVENTS } from "@bot-whatsapp/bot";
import {handlerAI} from "../services/ai/whisper"
import {handleHistory } from "../utils/handleHistory";

import welcomeFlow from "./welcome.flow";


const flowVoice = addKeyword(EVENTS.VOICE_NOTE)
.addAction(async(ctx,{state, flowDynamic,gotoFlow})=>{
    await flowDynamic("Dame un momento para escucharte...")
    
    const text = await handlerAI(ctx)
    console.log(text)
    
    await handleHistory({ content: text, role: 'user' }, state)
    gotoFlow(welcomeFlow)
})


 export {flowVoice}
