
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import RegisterForm from '@/components/auth/RegisterForm';
import { motion } from 'framer-motion';

const RegisterPage = () => {
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
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground mt-2">Sign up to start tracking your crypto portfolio</p>
        </div>
        <RegisterForm />
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default RegisterPage;
