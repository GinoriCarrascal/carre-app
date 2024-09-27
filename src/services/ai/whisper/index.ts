import { downloadMediaMessage } from "@adiwajshing/baileys";
import OpenAI from "openai";
import * as fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { Transform } from "stream";
import * as path from "path";

// Función para convertir un Transform en un Buffer
const streamToBuffer = async (stream: Transform): Promise<Buffer> => {
    return new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};

// Función para convertir voz a texto
const voiceToText = async (filePath: string): Promise<any> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY as string,
    });

    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        response_format: "text",
    });

    return transcription;
};

// Función para convertir OGG a MP3
const convertOggMp3 = async (inputStream: string, outStream: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputStream)
            .audioQuality(96)
            .toFormat("mp3")
            .save(outStream)
            .on("progress", () => null)
            .on("end", () => {
                resolve(true);
            })
            .on("error", (err) => {
                reject(err);
            });
    });
};

// Handler principal
const handlerAI = async (ctx: any): Promise<string> => {
    let buffer: Buffer | Transform = await downloadMediaMessage(ctx, "buffer",{});
    if (buffer instanceof Transform) {
        buffer = await streamToBuffer(buffer);
    }
    console.log(buffer);

    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }

    const pathTmpOgg: string = path.join(tmpDir, `voice-note-${Date.now()}.ogg`);
    const pathTmpMp3: string = path.join(tmpDir, `voice-note-${Date.now()}.mp3`);

    await fs.promises.writeFile(pathTmpOgg, buffer);
    await convertOggMp3(pathTmpOgg, pathTmpMp3);

    const text: string = await voiceToText(pathTmpMp3);

    await fs.promises.unlink(pathTmpMp3);
    await fs.promises.unlink(pathTmpOgg);

    return text;
};

export { handlerAI };
