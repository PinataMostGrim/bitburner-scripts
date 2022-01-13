import {execMaxThreads} from "/scripts/hacklib.js";

/** @param {NS} ns **/
export async function main(ns)
{
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length < 1)
    {
        ns.tprint("This script deploys another script on a server with maximum threads possible.");
        ns.tprint(`Usage: run ${ns.getScriptName()} SCRIPT ARGUMENTS`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles basic_hack.js foodnstuff`);
        return;
    }

    const script = args._[0];
    const scriptArgs = args._.slice(1);

    if (!ns.ls("home").find(f => f === script))
    {
        ns.tprint(`Script '${script}' does not exist. Aborting.`);
        return;
    }

    let threadCount = await execMaxThreads(ns, "home", script, ...scriptArgs);
    ns.tprint(`Executed ${threadCount} instances of '${script} ${scriptArgs}'`);
}
