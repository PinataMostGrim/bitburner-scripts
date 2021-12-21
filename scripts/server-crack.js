/** @param {NS} ns **/
import {canGetRootAccess, getRootAccess} from "hacklib.js";

export async function main(ns)
{
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length < 1)
    {
        ns.tprint("This script attempts to gain root access on the target host.");
        ns.tprint(`Usage: run ${ns.getScriptName()} HOST`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    const host = args._[0];

    if (!ns.serverExists(host))
    {
        ns.tprint(`Server '${host}' does not exist. Aborting.`);
        return;
    }

    let canHack = canGetRootAccess(ns, host);
    if (!canHack)
    {
        ns.tprint(`Unable to compromise server '${host}'`);
        return;
    }

    ns.tprint(`Compromising server '${host}'`);
    let success = getRootAccess(ns, host);

    if (success)
    {
        ns.tprint(`Root access on host '${host}' gained`);
        return;
    }

    ns.tprint(`Failed to gain root access on host '${host}'`);
}

export function autocomplete(data, args)
{
    return data.servers;
}
