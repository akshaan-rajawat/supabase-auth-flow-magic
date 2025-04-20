
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const Welcome = () => {
  const navigate = useNavigate();
  const { user, profile, logoutUser } = useAuth();
  
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="mt-2 text-gray-600">
            Hello {profile.first_name} {profile.last_name}!
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">
              {profile.first_name} {profile.last_name}
            </p>
          </div>
          {profile.date_of_birth && (
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">
                {format(new Date(profile.date_of_birth), 'PPP')}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium">
              {format(new Date(profile.created_at), 'PPP')}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleLogout} 
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
