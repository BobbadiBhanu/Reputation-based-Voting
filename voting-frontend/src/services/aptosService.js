import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Your deployed contract address
const CONTRACT_ADDRESS = "0xa7e0942609e060f5245db1d84c48c58c7f382cb3b18397bd2fc6184161f456ea";
const MODULE_NAME = "VotingPower";

class AptosService {
  constructor() {
    const config = new AptosConfig({ network: Network.TESTNET });
    this.aptos = new Aptos(config);
  }

  // Initialize voting system (only needed once by admin)
  async initializeVotingSystem(account) {
    try {
      const transaction = await this.aptos.transaction.build.simple({
        sender: account.address,
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::initialize_voting_system`,
          functionArguments: [],
        },
      });

      const response = await this.aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      await this.aptos.waitForTransaction({ transactionHash: response.hash });
      return response;
    } catch (error) {
      console.error("Failed to initialize voting system:", error);
      throw error;
    }
  }

  // Cast a vote (main function users will call)
  async castVote(account, systemOwnerAddress = CONTRACT_ADDRESS) {
    try {
      const transaction = await this.aptos.transaction.build.simple({
        sender: account.address,
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::cast_vote`,
          functionArguments: [systemOwnerAddress],
        },
      });

      const response = await this.aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      await this.aptos.waitForTransaction({ transactionHash: response.hash });
      return response;
    } catch (error) {
      console.error("Failed to cast vote:", error);
      throw error;
    }
  }

  // Get voter profile data
  async getVoterProfile(address) {
    try {
      const resource = await this.aptos.getAccountResource({
        accountAddress: address,
        resourceType: `${CONTRACT_ADDRESS}::${MODULE_NAME}::VoterProfile`,
      });
      return resource.data;
    } catch (error) {
      console.error("Voter not registered or error fetching profile:", error);
      return null;
    }
  }

  // Get voting system data
  async getVotingSystem(systemOwnerAddress = CONTRACT_ADDRESS) {
    try {
      const resource = await this.aptos.getAccountResource({
        accountAddress: systemOwnerAddress,
        resourceType: `${CONTRACT_ADDRESS}::${MODULE_NAME}::VotingSystem`,
      });
      return resource.data;
    } catch (error) {
      console.error("Error fetching voting system data:", error);
      throw error;
    }
  }
}

export default new AptosService();