
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

type UserProfile = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
}

const Welcome = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/login');
        return;
      }
      
      // Fetch user profile data
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, date_of_birth')
        .eq('user_id', data.session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
      } else if (profileData) {
        setProfile(profileData);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  if (loading) {
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
          {profile && (
            <p className="mt-2 text-gray-600">
              Hello {profile.first_name} {profile.last_name}!
            </p>
          )}
        </div>
        
        <div className="space-y-4 pt-4">
          {profile && (
            <>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{profile.first_name} {profile.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {profile.date_of_birth ? format(new Date(profile.date_of_birth), 'PPP') : 'Not provided'}
                </p>
              </div>
            </>
          )}
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
