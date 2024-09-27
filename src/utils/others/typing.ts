

const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

async function typing(ctx: any, provider: any): Promise<void> {
  if (provider && provider.vendor && provider.vendor.sendPresenceUpdate) {
    const id = ctx.key.remoteJid;
    await provider.vendor.sendPresenceUpdate('composing', id);
    await delay(1000); // Añadido await para que la función espere el delay
  }
}

export { typing };
