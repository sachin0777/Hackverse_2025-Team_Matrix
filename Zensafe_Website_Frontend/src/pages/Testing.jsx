import React, { useState } from "react";
import { Button } from "@mui/material";
import { BrowserProvider, formatEther } from "ethers"; // ✔️ Updated import

const Testing = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum); // ✔️ Updated usage
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        await accountChangedHandler(signer, provider);
      } catch (error) {
        console.error(error);
        setErrorMessage("Connection failed");
      }
    } else {
      setErrorMessage("Please install MetaMask!");
    }
  };

  const accountChangedHandler = async (signer, provider) => {
    const address = await signer.getAddress();
    setDefaultAccount(address);
    const balance = await provider.getBalance(address);
    setUserBalance(formatEther(balance));
  };

  return (
    <div className="WalletCard">
      <h3 className="h4">Welcome to a Decentralized Application</h3>
      <Button
        style={{ background: defaultAccount ? "#A5CC82" : "white" }}
        onClick={connectWalletHandler}
      >
        {defaultAccount ? "Connected!!" : "Connect"}
      </Button>
      <div className="displayAccount">
        <h4 className="walletAddress">Address: {defaultAccount}</h4>
        <div className="balanceDisplay">
          <h3>Wallet Amount: {userBalance} ETH</h3>
        </div>
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Testing;
