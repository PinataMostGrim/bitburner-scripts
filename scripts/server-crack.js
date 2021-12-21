/** @param {NS} ns **/
import {canGetRootAccess, getRootAccess} from "hacklib.js";

export async function main(ns)
{
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length < 1)
    {
        ns.tprint("This script attempts to gain root access on the target server.");
        ns.tprint(`Usage: run ${ns.getScriptName()} SERVER`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    const server = args._[0];

    if (!ns.serverExists(server))
    {
        ns.tprint(`Server '${server}' does not exist. Aborting.`);
        return;
    }

    let canHack = canGetRootAccess(ns, server);
    if (!canHack)
    {
        ns.tprint(`Unable to compromise server '${server}'`);
        return;
    }

    ns.tprint(`Compromising server '${server}'`);
    let success = getRootAccess(ns, server);

    if (success)
    {
        ns.tprint(`Root access on server '${server}' gained`);
        return;
    }

    ns.tprint(`Failed to gain root access on server '${server}'`);
}

export function autocomplete(data, args)
{
    return data.servers;
}
