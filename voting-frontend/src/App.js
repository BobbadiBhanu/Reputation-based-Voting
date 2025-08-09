import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if Petra wallet is installed
  const isPetraInstalled = () => {
    return typeof window !== 'undefined' && 'aptos' in window;
  };

  // Connect to Petra wallet
  const connectWallet = async () => {
    if (!isPetraInstalled()) {
      alert('Please install Petra Wallet extension');
      return;
    }

    try {
      setLoading(true);
      const response = await window.aptos.connect();
      setAccount(response);
      setIsConnected(true);
      console.log('Connected to wallet:', response);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Check if already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (isPetraInstalled()) {
        try {
          const isConnected = await window.aptos.isConnected();
          if (isConnected) {
            const account = await window.aptos.account();
            setAccount(account);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };
    checkConnection();
  }, []);

  const handleVote = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    try {
      setLoading(true);
      // Call your contract's cast_vote function
      const payload = {
        type: "entry_function_payload",
        function: "a7e0942609e060f5245db1d84c48c58c7f382cb3b18397bd2fc6184161f456ea::VotingPower::cast_vote",
        arguments: ["a7e0942609e060f5245db1d84c48c58c7f382cb3b18397bd2fc6184161f456ea"]
      };
      
      const response = await window.aptos.signAndSubmitTransaction(payload);
      console.log('Vote cast successfully:', response);
      alert('Vote cast successfully!');
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Failed to cast vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Voting Power System
        </h1>
        
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Welcome to the Voting System</h2>
            {isConnected ? (
              <div className="flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-lg">
                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                <span className="text-sm">
                  {account?.address ? `${account.address.slice(0, 8)}...${account.address.slice(-6)}` : 'Connected'}
                </span>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
          
          <p className="text-gray-300 mb-4">
            This system rewards consistent participation with increased voting power.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-400">Your Voting Power</h3>
              <p className="text-2xl font-bold">220</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-emerald-400">Votes Cast</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-rose-400">Current Round</h3>
              <p className="text-2xl font-bold">16</p>
            </div>
          </div>
          
          <button 
            onClick={handleVote}
            disabled={!isConnected || loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Cast Vote'}
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Contract Address</h3>
          <p className="text-sm text-gray-400 font-mono break-all">
            a7e0942609e060f5245db1d84c48c58c7f382cb3b18397bd2fc6184161f456ea
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;