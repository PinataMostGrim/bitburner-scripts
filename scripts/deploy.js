import {deployScriptOnServer} from "hacklib.js";

/** @param {NS} ns **/
export async function main(ns)
{
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length < 2)
    {
        ns.tprint("This script deploys another script on a server with maximum threads possible.");
        ns.tprint(`Usage: run ${ns.getScriptName()} SERVER SCRIPT ARGUMENTS`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles basic_hack.js foodnstuff`);
        return;
    }

    const server = args._[0];
    const script = args._[1];
    const scriptArgs = args._.slice(2);

    if (!ns.serverExists(server))
    {
        ns.tprint(`Server '${server}' does not exist. Aborting.`);
        return;
    }

    if (!ns.ls(ns.getHostname()).find(f => f === script))
    {
        ns.tprint(`Script '${script}' does not exist. Aborting.`);
        return;
    }

    await deployScriptOnServer(ns, server, script, ...scriptArgs);
}
