import {updateBotIndex} from "/scripts/botlib.js";

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

    let botCount = await updateBotIndex(ns);
    ns.tprint(`Botnet index updated with ${botCount} entries`);
}
