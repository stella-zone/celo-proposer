const { ProposalBuilder } = require("@celo/contractkit/lib/governance/proposals");
const { CeloContract } = require("@celo/contractkit/lib/base");
const { newKit } = require("@celo/contractkit");
const bluebird = require("bluebird");
const fs = require('fs');
const { RPC_ENDPOINT, PROPOSAL } = require("../config");

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

// buildAndSubmitProposal marshals the proposal drafts by creating method tx objects
// adding them to the builder instance. Afterward, it submits the proposal
const buildAndSubmitProposal = async () => {
  try {
    await bluebird.Promise.map(
      proposalDrafts,
      async ({ contractName, contractMethod, contractMethodArguments, value }) => {
        // NOTE: There may not be a ContractKit wrapper available for all contracts (e.g. EpochRewards), which will result in an error
        const contract = await kit.contracts[`get${contractName}`]();
        const contractMethodTx = contract.contract.methods[contractMethod].apply(this, contractMethodArguments);

        return builder.addWeb3Tx(contractMethodTx, {
          value,
          to: contract.address,
        });
      },
    );

    const proposal = await builder.build();
    const governance = await kit.contracts.getGovernance();

    // Submit the proposal
    const proposalTxReceipt = await governance.propose(proposal, PROPOSAL.DESCRIPTION_URL).sendAndWaitForReceipt({
      from: PROPOSAL.PROPOSER,
      value: PROPOSAL.DEPOSIT,
    });

    // Appends the proposal tx receipt to a file for review
    return fs.appendFileSync('./proposalTxReceipts.txt', JSON.stringify(proposalTxReceipt));
  } catch (err) {
    throw err;
  }
};

buildAndSubmitProposal();
