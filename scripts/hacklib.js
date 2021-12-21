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
