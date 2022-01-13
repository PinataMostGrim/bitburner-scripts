const MAX_NODE_COUNT = 8;
const UPGRADE_DELAY = 10000;
const LEVEL_MAX = 80;
const LEVEL_UPGRADE_STEP = 10;
const RAM_MAX = 16;
const RAM_UPGRADE_STEP = 2;
const CORES_MAX = 8;
const CORE_UPGRADE_STEP = 1;


/** @param {NS} ns **/
export async function main(ns) 
{
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("sleep");		

	await purchaseNodes(ns);
	await upgradeNodeLevel(ns);
	await upgradeNodeRAM(ns);
	await upgradeNodeCores(ns);
}

/** @param {NS} ns **/
async function purchaseNodes(ns)
{
	while(ns.hacknet.numNodes() < MAX_NODE_COUNT)
	{
		let cost = ns.hacknet.getPurchaseNodeCost()
		while (getMyMoney(ns) < cost)
		{
			let difference = cost - getMyMoney(ns);
			ns.tprint(`Need another ${formatter.format(difference)} for the next node purchase`);
			await ns.sleep(UPGRADE_DELAY);
		}

		let index = ns.hacknet.purchaseNode();
		ns.tprint(`Purchased hacknet Node with index ${index}`);
	}

	ns.tprint(`Purchased all ${ns.hacknet.numNodes()} hacknet nodes`);
}

/** @param {NS} ns **/
async function upgradeNodeLevel(ns)
{
	let formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	for (var i = 0; i < MAX_NODE_COUNT; i++) 
	{
		while (ns.hacknet.getNodeStats(i).level <= LEVEL_MAX) 
		{
			let cost = ns.hacknet.getLevelUpgradeCost(i, LEVEL_UPGRADE_STEP);
			while (getMyMoney(ns) < cost) 
			{
				let difference = cost - getMyMoney(ns);
				ns.tprint(`Need another ${formatter.format(difference)} for the next level upgrade`);
				await ns.sleep(UPGRADE_DELAY);
			}

			ns.hacknet.upgradeLevel(i, LEVEL_UPGRADE_STEP);
		}
	}

	ns.tprint(`All nodes upgraded to level ${ns.hacknet.getNodeStats(0).level}`);
}

/** @param {NS} ns **/
async function upgradeNodeRAM(ns)
{
	let formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	for (var i = 0; i < MAX_NODE_COUNT; i++) 
	{
	    while (ns.hacknet.getNodeStats(i).ram < RAM_MAX)
	    {
	        let cost = ns.hacknet.getRamUpgradeCost(i, RAM_UPGRADE_STEP);
	        while (getMyMoney(ns) < cost)
	        {
	        	let difference = cost - getMyMoney(ns);
	            ns.tprint(`Need another ${formatter.format(difference)} for the next RAM upgrade`);
	            await ns.sleep(UPGRADE_DELAY);
	        }

	        ns.hacknet.upgradeRam(i, RAM_UPGRADE_STEP);
	    }
	}

	ns.tprint(`All nodes upgraded to ${ns.hacknet.getNodeStats(0).ram}GB RAM`);
}

/** @param {NS} ns **/
async function upgradeNodeCores(ns)
{
	let formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	for (var i = 0; i < MAX_NODE_COUNT; i++) 
	{
	    while (ns.hacknet.getNodeStats(i).cores < CORES_MAX) 
	    {
	        let cost = ns.hacknet.getCoreUpgradeCost(i, CORE_UPGRADE_STEP);
	        while (getMyMoney(ns) < cost)
	        {
	        	let difference = cost - getMyMoney(ns);
	            ns.tprint(`Need another ${formatter.format(difference)} for the next core upgrade`);
	            await ns.sleep(UPGRADE_DELAY);
	        }

	        ns.hacknet.upgradeCore(i, CORE_UPGRADE_STEP);
	    }
	}

	ns.tprint(`All nodes upgraded to ${ns.hacknet.getNodeStats(0).cores} cores`);
}

/** @param {NS} ns **/
function getMyMoney(ns)
{
    return ns.getServerMoneyAvailable("home");
}
