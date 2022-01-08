import {retrieveBotIndex} from "/scripts/botlib.js";
import {openRootAccess} from "/scripts/hacklib.js";

/** @param {NS} ns **/
export async function main(ns)
{
    const args = ns.flags([["help", false]]);
    if (args.help)
    {
        ns.tprint("This script attempts to root all servers listed in the botnet index file.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        return;
    }

    let botnetServers = await retrieveBotIndex(ns);
    let count = 0;
    for (let server of botnetServers)
    {
        if (ns.hasRootAccess(server))
        {
            continue;
        }

        openRootAccess(ns, server);
        count++;
    }

    ns.tprint(`${count} servers rooted.`)
}
