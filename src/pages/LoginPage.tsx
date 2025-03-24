
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LoginForm from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

const LoginPage = () => {
  return (
    <>
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="container px-4 py-20 max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your CryptoTracker account</p>
        </div>
        <LoginForm />
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default LoginPage;
