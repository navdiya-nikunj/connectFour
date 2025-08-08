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
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"
          />
          <p className="text-sm text-gray-600">Loading streak data...</p>
        </div>
      </motion.div>
    );
  }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen max-w-full bg-gray-100 p-4">
        <div className="flex items-center w-full space-x-2 mb-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Streak Dashboard</h1>
            </div>
          </div>

        <motion.div
                      key="leaderboard"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <StreakLeaderboard entries={leaderboard} />
                    </motion.div>
        </div>
    );
}