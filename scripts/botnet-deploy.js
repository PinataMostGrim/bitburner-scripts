import {retrieveBotIndex} from "/scripts/botlib.js";
import {deployScriptOnServer} from "/scripts/hacklib.js";

/** @param {NS} ns **/
export async function main(ns)
{
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length < 2)
    {
        ns.tprint("This script deploys the specified script on all servers listed in the botnet index file.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        return;
    }

    let script = args._[0];
    let scriptArgs = args._.slice(1);

    let botnetServers = await retrieveBotIndex(ns);
    let count = 0;

    for (let server of botnetServers)
    {
        if (!ns.hasRootAccess(server))
        {
            ns.tprint(`Unable to deploy on server '${server}'; need root access`);
            continue;
        }

        ns.tprint(`Deploying script '${script} ${scriptArgs}' on ${server}`);
        await deployScriptOnServer(ns, server, script, ...scriptArgs);
        count++;
    }

    ns.tprint(`Script '${script}' deployed on ${count} server(s).`);
}
