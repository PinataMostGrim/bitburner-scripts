import {
    findMostLucrativeServer, findAllServers, findHackableServers,
    analyzeServer, getMaxThreadsForScript
    } from "/scripts/hacklib.js";

/** @param {NS} ns **/
export async function main(ns)
{
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length > 1)
    {
        ns.tprint("Prints the currently most profitable servers to hack. Prints 10 servers by default.");
        ns.tprint(`Usage: run ${ns.getScriptName()} <SERVER COUNT>`);
        return;
    }

    let serverCount = 10;
    if (args._.length > 0)
    {
        serverCount = args._[0];
    }

    // Print max money for hackable servers
    let results = [];
    let servers = findHackableServers(ns);
    for (let server of servers)
    {
        let money = ns.getServerMaxMoney(server);
        results.push({"server": server, "money": money});
    }
    results.sort((a, b) => parseFloat(b.money) - parseFloat(a.money));
    let formatter = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    for (let i = 0; i < serverCount; i++)
    {
        ns.tprint(`${results[i].server}: ${formatter.format(results[i].money)}`);
    }
}
