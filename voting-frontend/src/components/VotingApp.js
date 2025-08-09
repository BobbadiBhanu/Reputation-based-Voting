import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import aptosService from '../services/aptosService';
import toast from 'react-hot-toast';
import { 
  Users, Zap, CheckCircle, Clock, Vote, 
  TrendingUp, Info, Wallet 
} from 'lucide-react';

// Import all your components here (StatsCard, VotingInterface, etc.)
// ... (Use the components from the HTML artifact above)

const VotingApp = () => {
  const { isConnected, account, connectWallet, loading: walletLoading } = useWallet();
  const [voterData, setVoterData] = useState(null);
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load data when wallet connects
  useEffect(() => {
    if (isConnected && account) {
      loadUserData();
      loadSystemData();
    }
  }, [isConnected, account]);

  const loadUserData = async () => {
    try {
      const profile = await aptosService.getVoterProfile(account.address);
      setVoterData(profile);
    } catch (error) {
      console.error('Error loading user data:', error);
      // If user is not registered, show default values
      setVoterData(null);
    }
  };

  const loadSystemData = async () => {
    try {
      const system = await aptosService.getVotingSystem();
      setSystemData(system);
    } catch (error) {
      console.error('Error loading system data:', error);
    }
  };

  const handleVote = async (selectedOption) => {
    if (!isConnected || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Casting your vote...');
      
      const response = await aptosService.castVote(account);
      
      toast.dismiss();
      toast.success('Vote cast successfully! Your voting power has increased.');
      
      // Reload data to show updated stats
      await loadUserData();
      await loadSystemData();
      
    } catch (error) {
      toast.dismiss();
      console.error('Error casting vote:', error);
      toast.error('Failed to cast vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg animate-gradient min-h-screen">
      {/* Your complete UI here - use the HTML artifact as reference */}
      {/* Remember to replace mock data with real data from state */}
    </div>
  );
};

export default VotingApp;