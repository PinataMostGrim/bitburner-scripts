/** @param {NS} ns **/

/// <summary>
/// Returns whether or not root access can be gained on a server.
/// </summary>
export function canGetRootAccess(ns, server)
{
    let requiredHackLevel = ns.getServerRequiredHackingLevel(server);
    let hackLevel = ns.getHackingLevel();
    if (requiredHackLevel > hackLevel)
    {
        ns.tprint(`[hacklib] Hack level too low (${hackLevel}); server '${server}' requires a hacking level of '${requiredHackLevel}'`)
        return false;
    }

    let requiredPorts = ns.getServerNumPortsRequired(server);
    let portsOpenable = getPortsOpenable(ns);
    if (requiredPorts > portsOpenable)
    {
        ns.tprint(`[hacklib] Unable to open the required number of ports (${requiredPorts}); can only open ${portsOpenable} ports`)
        return false;
    }

    return true;
}


/// <summary>
/// Attempts to gain root access on the target server.
/// </summary>
export function openRootAccess(ns, server)
{
    openPorts(ns, server);

    ns.tprint(`[hacklib] Nuking server '${server}'`);
    ns.nuke(server);

    return ns.hasRootAccess(server)
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
/// Opens the number of ports required to gain root access on a target server.
/// </summary>
export function openPorts(ns, server)
{
    let requiredPorts = ns.getServerNumPortsRequired(server);
    if (requiredPorts === 0)
    {
        ns.tprint('[hacklib] Opened 0 ports');
        return true;
    }

    ns.brutessh(server);
    if (requiredPorts === 1)
    {
        ns.tprint('[hacklib] Opened 1 ports');
        return true;
    }

    ns.ftpcrack(server);
    if (requiredPorts === 2)
    {
        ns.tprint('[hacklib] Opened 2 ports');
        return true;
    }

    return false;
}


/// <summary>
/// Returns an array of all servers reachable for a given
/// max depth from a starting server.
/// </summary>
export function findAllServers(ns, startServer, maxDepth)
{
    let depth = 0;
    const servers = [];
    recursiveScan(ns, startServer, depth, maxDepth, servers);

    return servers;
}


function recursiveScan(ns, parentServer, depth, maxDepth, servers)
{
    if (servers.includes(parentServer))
    {
        // We have already visited this server.
        return;
    }

    servers.push(parentServer);

    depth++;
    if (depth > maxDepth)
    {
        return;
    }

    const children = ns.scan(parentServer);
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
/// for a given max depth from a starting server.
/// </summary>
export function findHackableServers(ns, startServer, maxDepth, filterOwned = false)
{
    const hackableServers = [];
    let servers = findAllServers(ns, startServer, maxDepth);
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
/// for a given max depth from a starting server.
/// </summary>
export function findHackedServers(ns, startingServer, maxDepth)
{
    const hackedServers = [];
    let servers = findAllServers(ns, startingServer, maxDepth);
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
export function findMostLucrativeServer(ns, startingServer, maxDepth)
{
    let bestServer = "";
    let maxMoney = 0;

    let servers = findHackableServers(ns, startingServer, maxDepth);
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
/// Copies a script to a server and executes it with arguments using
/// the maximum number of threads possible.
/// </summary>
export async function deployScriptOnServer(ns, server, script, ...args)
{
    if (server == "home")
    {
        return;
    }

    await ns.scp(script, server);
    ns.killall(server);
    let threadCount = getMaxThreadsForScript(ns, script, server);
    ns.exec(script, server, threadCount, ...args);
}


/// <summary>
/// Returns the max number of threads that can be used to run
/// a script on a given server.
/// </summary>
export function getMaxThreadsForScript(ns, script, server)
{
    let serverRam = ns.getServerMaxRam(server);
    let serverRamUsed = ns.getServerUsedRam(server);
    let scriptRam = ns.getScriptRam(script);

    return Math.floor((serverRam - serverRamUsed) / scriptRam);
}
