/** @param {NS} ns **/

/// <summary>
/// Returns whether or not root access can be gained on the target host.
/// </summary>
export function canGetRootAccess(ns, host)
{
    let requiredHackLevel = ns.getServerRequiredHackingLevel(host);
    let hackLevel = ns.getHackingLevel();
    if (requiredHackLevel > hackLevel)
    {
        ns.tprint(`[hacklib] Hack level too low (${hackLevel}); server '${host}' requires a hacking level of '${requiredHackLevel}'`)
        return false;
    }

    let requiredPorts = ns.getServerNumPortsRequired(host);
    let portsOpenable = getPortsOpenable(ns);
    if (requiredPorts > portsOpenable)
    {
        ns.tprint(`[hacklib] Unable to open the required number of ports (${requiredPorts}); can only open ${portsOpenable} ports`)
        return false;
    }

    return true;
}


/// <summary>
/// Attempts to gain root access on the target host.
/// </summary>
export function getRootAccess(ns, host)
{
    openPorts(ns, host);

    ns.tprint(`[hacklib] Nuking server '${host}'`);
    ns.nuke(host);

    return ns.hasRootAccess(host)
}


/// <summary>
/// Returns the maximum number of ports that can currently be opened.
/// </summary>
export function getPortsOpenable(ns)
{
    let portCount = 0;

    if (ns.fileExists("BruteSSH.exe"))
    {
        portCount++;
    }

    if (ns.fileExists("FTPCrack.exe"))
    {
        portCount++;
    }

    return portCount;
}


/// <summary>
/// Opens the number of ports required to gain root access on a target host.
/// </summary>
export function openPorts(ns, host)
{
    let requiredPorts = ns.getServerNumPortsRequired(host);
    if (requiredPorts === 0)
    {
        ns.tprint('[hacklib] Opened 0 ports');
        return true;
    }

    ns.brutessh(host);
    if (requiredPorts === 1)
    {
        ns.tprint('[hacklib] Opened 1 ports');
        return true;
    }

    ns.ftpcrack(host);
    if (requiredPorts === 2)
    {
        ns.tprint('[hacklib] Opened 2 ports');
        return true;
    }

    return false;
}


/// <summary>
/// Returns an array of all servers reachable for a given
/// max depth from a start host.
/// </summary>
export function findAllServers(ns, startHost, maxDepth)
{
    let depth = 0;
    const servers = [];
    recursiveScan(ns, startHost, depth, maxDepth, servers);

    return servers;
}


function recursiveScan(ns, parentHost, depth, maxDepth, servers)
{
    if (!servers.includes(parentHost))
    {
        servers.push(parentHost);
    }

    depth++;
    if (depth > maxDepth)
    {
        return;
    }

    const children = ns.scan(parentHost);
    for (let child of children)
    {
        if (parent == child)
        {
            continue;
        }

        recursiveScan(ns, child, depth, maxDepth, servers);
    }
}


/// <summary>
/// Returns an array of all servers that are currently hackable
/// for a given max depth from a start host.
/// </summary>
export function findHackableServers(ns, startHost, maxDepth, filterOwned = false)
{
    const hackableServers = [];
    let servers = findAllServers(ns, startHost, maxDepth);
    for (let server of servers)
    {
        if (filterOwned && ns.hasRootAccess(server))
        {
            continue;
        }

        if (!canGetRootAccess(ns, server))
        {
            continue;
        }

        hackableServers.push(server);
    }

    return hackableServers;
}


/// <summary>
/// Returns an array of all servers that are currently hacked
/// for a given max depth from a start host.
/// </summary>
export function findHackedServers(ns, startHost, maxDepth)
{
    const hackedServers = [];
    let servers = findAllServers(ns, startHost, maxDepth);
    for (let server of servers)
    {
        if (ns.hasRootAccess(server))
        {
            hackedServers.push(server);
        }
    }

    return hackedServers;
}


/// <summary>
/// Finds the most lucrative server that is currently hackable.
/// </summary>
export function findMostLucrativeServer(ns, startHost, maxDepth)
{
    let bestServer = "";
    let maxMoney = 0;

    let servers = findHackableServers(ns, startHost, maxDepth);
    for (let server of servers)
    {
        let money = ns.getServerMaxMoney(server);
        if (money > maxMoney)
        {
            bestServer = server;
            maxMoney = money;
        }
    }

    return bestServer;
}


/// <summary>
/// Returns the max number of threads that can be used to run
/// a script on a given server.
/// </summary>
export function getMaxThreadsForScript(ns, script, host)
{
    let serverRam = ns.getServerMaxRam(host);
    let serverRamUsed = ns.getServerUsedRam(host);
    let scriptRam = ns.getScriptRam(script);

    return Math.floor((serverRam - serverRamUsed) / scriptRam);
}
