import {findHackableServers} from "/scripts/hacklib.js";

const BotIndexPath = "/scripts/bot-index.txt";

/// <summary>
/// Writes a list of all hackable servers to an index file.
/// </summary>
/** @param {NS} ns **/
export async function updateBotIndex(ns)
{
    let servers = findHackableServers(ns);
    let jsonStr = JSON.stringify(servers);

    await ns.write(BotIndexPath, jsonStr, 'w');
}


/// <summary>
/// Retrieves a list of all servers to command from an index file.
/// </summary>
/** @param {NS} ns **/
export async function retrieveBotIndex(ns)
{
    let jsonResult = await ns.read(BotIndexPath);
    return JSON.parse(jsonResult);
}
