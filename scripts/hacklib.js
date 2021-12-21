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
        return false;
    }

    let requiredPorts = ns.getServerNumPortsRequired(host);
    let portsOpenable = getPortsOpenable(ns);
    if (requiredPorts > portsOpenable)
    {
        return false;
    }

    return true;
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
        ns.tprint('Opened 0 ports');
        return true;
    }

    ns.brutessh(host);
    if (requiredPorts === 1)
    {
        ns.tprint('Opened 1 ports');
        return true;
    }

    ns.ftpcrack(host);
    if (requiredPorts === 2)
    {
        ns.tprint('Opened 2 ports');
        return true;
    }

    return false;
}
