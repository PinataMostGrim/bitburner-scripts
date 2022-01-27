import {getBotIndexCount, updateBotIndex} from "/scripts/botlib.js";

/** @param {NS} ns **/
export async function main(ns)
{
    const args = ns.flags([["help", false]]);
    if (args.help)
    {
        ns.tprint("Updates the botnet index file.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        return;
    }

    let previousBotCount = await getBotIndexCount(ns);
    let botCount = await updateBotIndex(ns);
    let addedBots = botCount - previousBotCount;

    ns.tprint(`Botnet index updated with ${botCount} entries (${addedBots} added)`);
}
