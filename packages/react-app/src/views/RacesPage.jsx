import React, { useState } from "react";
import { Button, Input } from "antd";
import { Contract, ContestContract, CreateContestModal, CreateGenericVotesTokenModal } from "../components";
import DeployedContestContract from "../contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import DeployedGenericVotesTokenContract from "../contracts/bytecodeAndAbi/GenericVotesToken.sol/GenericVotesToken.json";

export default function RacesPage({targetNetwork, price, signer, provider, address, blockExplorer, contractConfig}) {

  const [contestSearchInput, setContestSearchInput] = useState("");
  const [tokenSearchInput, setTokenSearchInput] = useState("");
  const [isCreateContestModalVisible, setIsCreateContestModalVisible] = useState(false);  
  const [isCreateTokenModalVisible, setIsCreateTokenModalVisible] = useState(false);  
  const [showContest, setShowContest] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [resultMessage, setResultMessage] = useState("")
  
  function generateCustomConfigBase() {
    let customConfigBase = {};
    customConfigBase["deployedContracts"] = {};
    customConfigBase["deployedContracts"][targetNetwork.chainId] = {};
    return customConfigBase;
  }

  function generateCustomContestConfig() {
    let customContestConfig = generateCustomConfigBase();
    customContestConfig["deployedContracts"][targetNetwork.chainId][targetNetwork.name] =
      {
        chainId: targetNetwork.chainId.toString(),
        contracts: {
          Contest: {
            abi: DeployedContestContract.abi,
            address: contestSearchInput
          }
        },
        name: targetNetwork.name
      }
    return customContestConfig;
  }
  
  function generateCustomTokenConfig() {
    let customTokenConfig = generateCustomConfigBase();
    customTokenConfig["deployedContracts"][targetNetwork.chainId][targetNetwork.name] =
      {
        chainId: targetNetwork.chainId.toString(),
        contracts: {
          GenericVotesToken: {
            abi: DeployedGenericVotesTokenContract.abi,
            address: tokenSearchInput
          }
        },
        name: targetNetwork.name
      }
    return customTokenConfig;
  }

  function searchContest() {
    if (contestSearchInput != "") {
      setShowContest(true)
    }
  }

  function searchToken() {
    if (tokenSearchInput != "") {
      setShowToken(true)
    }
  }

  const showContestModal = () => {
    setIsCreateContestModalVisible(true);
  };

  const showTokenModal = () => {
    setIsCreateTokenModalVisible(true);
  };
  
  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 64 }}>
      <Button onClick={() => {window.location.reload();}}>Refresh</Button>
      <Button type="primary" onClick={showTokenModal}>
        Create Generic Votes Token
      </Button>
      <Button type="primary" onClick={showContestModal}>
        Create Contest
      </Button>
      <CreateContestModal 
        modalVisible={isCreateContestModalVisible} 
        setModalVisible={setIsCreateContestModalVisible} 
        setResultMessage={setResultMessage} 
        signer={signer}
      />
      <CreateGenericVotesTokenModal 
        modalVisible={isCreateTokenModalVisible} 
        setModalVisible={setIsCreateTokenModalVisible} 
        setResultMessage={setResultMessage} 
        signer={signer}
      />
      <Button onClick={() => setResultMessage("")}>Clear message</Button>
      <div>
        <p>{resultMessage}</p>
      </div>
      <div>
        {/* Get rid of any whitespace or extra quotation marks */}
        <Input icon='search' placeholder='Search contests...' value={contestSearchInput} onChange={(e) => setContestSearchInput(e.target.value.trim().replace(/['"]+/g, ''))} />
        <Button onClick={searchContest}>Search Contests</Button>
      </div>
      {showContest ? 
        <div>
          <ContestContract
            name="Contest"
            price={price}
            signer={signer}
            provider={provider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={generateCustomContestConfig()}
          />
          <Contract
            name="Contest"
            price={price}
            signer={signer}
            provider={provider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={generateCustomContestConfig()}
          />
        </div> 
      : ""}
      <div>
        <Input icon='search' placeholder='Search tokens...' value={tokenSearchInput} onChange={(e) => setTokenSearchInput(e.target.value.trim().replace(/['"]+/g, ''))} />
        <Button onClick={searchToken}>Search ERC20Votes Tokens</Button>
      </div>
      {showToken ? 
        <Contract
          name="GenericVotesToken"
          price={price}
          signer={signer}
          provider={provider}
          address={address}
          blockExplorer={blockExplorer}
          contractConfig={generateCustomTokenConfig()}
        /> 
      : ""}
      <h5>jokecartel was here</h5>
    </div>
  );
}
