/** @param {NS} ns **/
export async function main(ns)
{
    const args = ns.flags([["help", false]]);
    if (args.help || args._.length < 1)
    {
        ns.tprint("This script attempts to gain root access on the target host.");
        ns.tprint(`Usage: run ${ns.getScriptName()} HOST`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    const host = args._[0];

    if (!ns.serverExists(host))
    {
        ns.tprint(`Server '${host}' does not exist. Aborting.`);
        return;
    }

    var requiredHackLevel = ns.getServerRequiredHackingLevel(host);
    var hackLevel = ns.getHackingLevel();
    if (requiredHackLevel > hackLevel)
    {
        ns.tprint(`Hack level too low ('${hackLevel}'); server '${host}' requires a hacking level of '${requiredHackLevel}'`)
        return;
    }

    ns.tprint(`Cracking server '${host}'`)

    ns.tprint(`Brute forcing ssh`)
    ns.brutessh(host);

    ns.tprint(`Cracking ftp`)
    ns.ftpcrack(host);

    ns.tprint(`Nuking host`)
    ns.nuke(host);

    if (!ns.hasRootAccess(host))
    {
        ns.tprint(`Failed to gain root access on host '${host}'`)
        return;
    }

    ns.tprint(`Root access on host '${host}' gained`)
}
