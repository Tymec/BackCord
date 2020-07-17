const { spawn } = require('child_process');
const schedule = require('node-schedule');
const { WebhookClient } = require('discord.js');
const helper = require('./helper');

class Scheduler {
    constructor(schedulesPath, ) {
        this.schedulesPath = schedulesPath;
        this.schedules = require(helper.getFullPath(schedulesPath));
        this.servers = schedules['servers'];
        this.jobs = _init();
    }

    stop() {
        this.jobs.forEach(job => {
            job.cancel();
        });
    }

    add(serverId, schedule, webhook) {
        // Push dictionary with values specified to servers array
        this.servers.push({
            id: serverId,
            schedule: schedule,
            webhook: {
                id: webhook['id'],
                token: webhook['token']
            }
        })
        _reload();
    }

    remove(serverId) {
        let serverIdx = -1;
        
        // Loop over all servers in server array
        this.servers.forEach(server => {
            // Check if current server ID matches specified server ID
            if (server['id'] === serverId) {
                // Get index of current server and break out of loop
                serverIdx = this.servers.indexOf(server);
                break;
            }
        });
        
        // Remove specified server from server array
        this.servers.splice(serverIdx, 1);
        _reload();
    }

    _init() {
        // For each server start a cron job
        let _jobs = [];
        this.servers.forEach(server => {
            let cronSyntax = helper.getScheduleCron(this.schedules, server['schedule']);
            var job = schedule.scheduleJob(cronSyntax, function(webhook) {
                _send(webhook);
            }).bind(null, server['webhook']);
            _jobs.push(job);
        });

        return _jobs;
    }

    _send(webhook) {
        let webhookClient = new WebhookClient(webhook['id'], webhook['token']);
        webhookClient.send('!!create');
    }

    _reload() {
        // Reload schedules object
        this.schedules = helper.writeFile(this.schedulesPath, this.schedules);
        this.servers = schedules['servers'];
    }
}

module.exports = Scheduler;