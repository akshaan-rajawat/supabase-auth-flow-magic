
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow text-center">
        <h1 className="text-3xl font-bold">Welcome to Our App</h1>
        <p className="text-xl text-gray-600">Please register or login to continue</p>
        
        <div className="flex flex-col space-y-4 pt-4">
          <Button onClick={() => navigate('/register')}>
            Register
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
