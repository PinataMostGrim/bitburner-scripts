/** @param {NS} ns **/
import {openRootAccess, findHackableServers, findHackedServers, deployScriptOnServer} from "hacklib.js";

export async function main(ns)
{
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length < 3)
    {
        ns.tprint("Hacks all servers possible within a max depth of a starting server and deploys a script with arguments.");
        ns.tprint(`Usage: run ${ns.getScriptName()} SERVER DEPTH SCRIPT ARGS`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} home 5 leech.js n00dles`);
        return;
    }

    let startServer = args._[0];
    let maxDepth = args._[1];
    let script = args._[2];
    let scriptArgs = args._.slice(3);

    hackViableServers(ns, startServer, maxDepth);
    await deployToAllHackedServers(ns, startServer, maxDepth, script, ...scriptArgs);
}


function hackViableServers(ns, startServer, maxDepth)
{
    let targetServers = findHackableServers(ns, startServer, maxDepth, true);
    for (let server of targetServers)
    {
        openRootAccess(ns, server);
    }
}

async function deployToAllHackedServers(ns, startServer, maxDepth, script, ...args)
{
    let hackedServers = findHackedServers(ns, startServer, maxDepth);
    for (let server of hackedServers)
    {
        await deployScriptOnServer(ns, server, script, ...args);
    }
}
