'use strict';


var AgentManager = function (ethAgents, ipfsAgents, redisAgents) {
  this.ethAgents = ethAgents;
  this.ipfsAgents = ipfsAgents;
  this.redisAgents = redisAgents;
};

AgentManager.prototype.start = function () {

};

AgentManager.prototype.createFromEnv = function() {

};


module.exports = new AgentManager();