/* eslint-disable @typescript-eslint/no-explicit-any */
import sdk from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";
import StreakLeaderboard from "./StreakLeaderboard";
import { motion } from 'framer-motion';
import { ArrowLeft } from "lucide-react";

export default function StreakLeaderBoardPage({onBack}: { onBack: () => void }) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStreakData();
      }, []);
    
      const fetchStreakData = async () => {
        try {
          setLoading(true);
    
          // Fetch leaderboard
          const leaderboardResponse = await fetch('/api/streak?action=leaderboard&limit=10');
          console.log('Leaderboard response:', leaderboardResponse);
          if (leaderboardResponse.ok) {
            const leaderboardData = await leaderboardResponse.json();
            setLeaderboard(leaderboardData.streaks);
          }
        } catch (error) {
          console.error('Error fetching streak data:', error);
        } finally {
          setLoading(false);
        }
      };
      if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading streak data...</p>
        </div>
      </motion.div>
    );
  }
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="flex items-center space-x-4 mb-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Streak Dashboard</h1>
            </div>
          </div>

        <motion.div
                      key="leaderboard"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StreakLeaderboard entries={leaderboard} />
                    </motion.div>
        </div>
    );
}