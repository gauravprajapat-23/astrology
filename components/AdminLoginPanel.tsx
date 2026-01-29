'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLogIn, FiAlertCircle } from 'react-icons/fi';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';

export default function AdminLoginPanel() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a slight delay for authentication
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (login(username, password)) {
      setUsername('');
      setPassword('');
    } else {
      setError('Invalid credentials. Demo: admin / admin123');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-gold-500 rounded-full flex items-center justify-center animate-glow mx-auto mb-4">
              <span className="text-white text-3xl">ॐ</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-saffron-600 dark:text-saffron-400 mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Divine Rituals Management</p>
          </div>

          {/* Demo Credentials Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-semibold">Demo Credentials:</span>
              <br />
              Username: <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">admin</code>
              <br />
              Password: <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">admin123</code>
            </p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-saffron-500 to-gold-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  <span>Login to Admin Panel</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
            This is a demo login panel for local development only.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
