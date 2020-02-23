const { ProposalBuilder } = require("@celo/contractkit/lib/governance/proposals");
const { CeloContract } = require("@celo/contractkit/lib/base");
const { newKit } = require("@celo/contractkit");
const { RPC_ENDPOINT } = require("../config");

const kit = newKit(RPC_ENDPOINT);
const builder = new ProposalBuilder(kit);
