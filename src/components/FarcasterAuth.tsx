'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import { sdk } from '@farcaster/miniapp-sdk';
import Image from 'next/image';

interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  avatar?: string;
}

interface FarcasterAuthProps {
  onUserChange: (user: FarcasterUser | null) => void;
  currentUser: FarcasterUser | null;
}

export default function FarcasterAuth({ onUserChange, currentUser }: FarcasterAuthProps) {
  const [user, setUser] = useState<FarcasterUser | null>(currentUser);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        if (currentUser) {
          setUser(currentUser);
          onUserChange(currentUser);
          setIsLoading(false);
          return;
        }
        const token = sdk.quickAuth.token;
        if (token) {
          // User is already authenticated
          const response = await sdk.quickAuth.fetch('/api/user');
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            onUserChange(userData);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Get Quick Auth token
      const { token } = await sdk.quickAuth.getToken();
      console.log('frontend token', token);
      console.log('Quick Auth token acquired');
      
      // Fetch user data from your backend
      const response = await sdk.quickAuth.fetch('/api/user');
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        onUserChange(userData);
      } else {
        console.error('Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setUser(null);
    onUserChange(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-lg"
      >
        <div className="flex items-center space-x-2">
          {user.avatar && (
            <Image
              src={user.avatar}
              alt={user.displayName || `User ${user.fid}`}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user.displayName || `User ${user.fid}`}
            </p>
            <p className="text-xs text-gray-500">
              {user.username ? `@${user.username}` : `FID: ${user.fid}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-3"
    >
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        <User className="w-4 h-4" />
        <span className="text-sm">
          {isConnecting ? 'Connecting...' : 'Connect with Farcaster'}
        </span>
      </button>
     
    </motion.div>
  );
} 