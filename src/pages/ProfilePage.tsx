
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { LogOut, User, Edit } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="container px-4 py-20 max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <Card className="w-full md:w-1/3">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} alt={user.name} />
                <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardFooter>
          </Card>
          
          <div className="w-full md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input id="name" defaultValue={user.name} readOnly />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" defaultValue={user.email} readOnly />
                </div>
                <div className="space-y-2">
                  <label htmlFor="user-id" className="text-sm font-medium">User ID</label>
                  <Input id="user-id" defaultValue={user.id} readOnly />
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile (Coming Soon)
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProfilePage;
