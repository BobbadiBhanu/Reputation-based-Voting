import React, { createContext, useContext, useState } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);
      
      // Check if Aptos wallet is installed
      if (!window.aptos) {
        alert('Please install Petra Wallet or another Aptos wallet');
        return;
      }

      // Connect to wallet
      const response = await window.aptos.connect();
      
      setAccount({
        address: response.address,
        publicKey: response.publicKey,
      });
      setIsConnected(true);
      
      console.log('Connected to wallet:', response.address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.aptos) {
        await window.aptos.disconnect();
      }
      setAccount(null);
      setIsConnected(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const signAndSubmitTransaction = async (transaction) => {
    if (!window.aptos || !isConnected) {
      throw new Error('Wallet not connected');
    }
    
    return await window.aptos.signAndSubmitTransaction(transaction);
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        account,
        loading,
        connectWallet,
        disconnectWallet,
        signAndSubmitTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};