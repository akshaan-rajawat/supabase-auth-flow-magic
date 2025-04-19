
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/sonner'

export const useAuth = () => {
  const [user, setUser] = useState(null)

  const registerUser = async (userData: {
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    dateOfBirth: Date
  }) => {
    try {
      // Register user in Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (authError) throw authError

      // If auth successful, add profile to user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user?.id,
          first_name: userData.firstName,
          last_name: userData.lastName,
          date_of_birth: userData.dateOfBirth
        })

      if (profileError) throw profileError

      toast.success('Registration Successful!')
      return data.user
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
      throw error
    }
  }

  const loginUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast.success('Login Successful!')
      setUser(data.user)
      return data.user
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
      throw error
    }
  }

  const logoutUser = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { 
    registerUser, 
    loginUser, 
    logoutUser,
    user 
  }
}
