const { ProposalBuilder } = require("@celo/contractkit/lib/governance/proposals");
const { CeloContract } = require("@celo/contractkit/lib/base");
const { newKit } = require("@celo/contractkit");
const { RPC_ENDPOINT } = require("../config");

const kit = newKit(RPC_ENDPOINT);
const builder = new ProposalBuilder(kit);

// proposalDrafts is a list of 1 or more proposal transaction objects
// The example below is a simple proposal (consisting of only 1 method call)
// to update the electable validator set min and max values.
// For more complex proposals, you may need to add more method objects.
const proposalDrafts = [
  {
    // Name of the contract
    contractName: "Election",
    // Contract method to call
    contractMethod: "setElectableValidators",
    // Contract arguments (check contract source code)
    contractMethodArguments: ["1", "120"],
    // Value to send in the transaction (if required)
    value: "0",
    // Contract address (function below will set this)
    to: "",
  },
];
