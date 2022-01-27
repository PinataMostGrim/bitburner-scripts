import {findHackableServers} from "/scripts/hacklib.js";

const BotIndexPath = "/scripts/bot-index.txt";

/// <summary>
/// Writes a list of all hackable servers to an index file.
/// Returns the number of servers included in the bot-index.
/// </summary>
/** @param {NS} ns **/
export async function updateBotIndex(ns)
{
    let servers = findHackableServers(ns);
    let jsonStr = JSON.stringify(servers);

    await ns.write(BotIndexPath, jsonStr, 'w');

    return servers.length;
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


/// <summary>
/// Returns the number of servers currently stored in the
/// bot index.
/// </summary>
/** @param {NS} ns **/
export async function getBotIndexCount(ns)
{
    let servers = await retrieveBotIndex(ns);
    return servers.length;
}
