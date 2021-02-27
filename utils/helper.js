const fs = require('fs');
const path = require('path');

function writeFile(fileName, data) {
    // Convert data to json format, write to path and reimport
    let newPath = getFullPath(fileName);
    let newData = JSON.stringify(data, null, 4);

    fs.writeFileSync(newPath, newData, 'utf8');
    return require(newPath);
}

function checkPermission(memberships, userId, key, value) {
    let members = memberships['members'];
    
    // If user has a membership, get user's tier
    let tierIdx = 0;
    if (members[userId]) {
        tierIdx = members[userId]['tier'];
    }

    let perks = memberships['info']['perks'];
    let tier = memberships['info']['tiers'][tierIdx];

    // Check if perk exists
    if (perks[key]) {
        // Get required permission
        let requiredPermission = perks[key].indexOf(value);
        if (requiredPermission > -1) {
            let tierPerms = tier['perks'].split('');
            let idx = Object.keys(perks).indexOf(key);

            // Check if user's permission is bigger or equal to the required permission
            if (tierPerms[idx] >= requiredPermission) { return true; }
        }
    }

    return false;
}

function getUserTier(memberships, userId) {
    let members = memberships['members'];
    
    // If user has a membership, get user's tier
    let tierIdx = 0;
    if (members[userId]) {
        tierIdx = members[userId]['tier'];
    }

    return memberships['info']['tiers'][tierIdx]['name'];
}

function getScheduleCron(schedules, schedule) {
    let definitions = schedules['definitions'];

    // If specified schedule doesn't exist, default to never
    let cron = "0 5 31 2 *";
    if (definitions.indexOf(schedule) > -1) {
        cron = definitions[schedule];
    }
    return cron;
}

function getFullPath(path) {
    return path.join(process.cwd(), path);
}

module.exports = {
    writeFile: writeFile,
    checkPermission: checkPermission,
    getUserTier: getUserTier,
    getScheduleCron: getScheduleCron,
    getFullPath: getFullPath
};