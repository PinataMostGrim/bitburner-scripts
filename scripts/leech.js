/** @param {NS} ns **/
export async function main(ns)
{
    var targetServer = ns.args[0];
    var moneyThreshold = ns.getServerMaxMoney(targetServer) * 0.75;
    var securityThreshold = ns.getServerMinSecurityLevel(targetServer) + 5;

    while(true)
    {
        if (ns.getServerSecurityLevel(targetServer) > securityThreshold)
        {
            await ns.weaken(targetServer);
            continue;
        }

        if (ns.getServerMoneyAvailable(targetServer) < moneyThreshold)
        {
            await ns.grow(targetServer);
            continue;
        }

        await ns.hack(targetServer);
    }
}


export function autocomplete(data, args)
{
    return data.servers;
}
