
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/sonner'
import { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const registerUser = async (userData: {
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    dateOfBirth: Date
  }) => {
    setIsLoading(true)
    try {
      // Register user in Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (authError) throw authError

      // If auth successful, add profile to user_profiles
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            date_of_birth: userData.dateOfBirth
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          toast.error('Account created but profile setup failed')
        } else {
          toast.success('Registration Successful! Please check your email to confirm your account.')
        }
        
        return data.user
      } else {
        throw new Error('User registration failed')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const logoutUser = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      setUser(null)
      toast.success('Logged out successfully')
    }
  }

  return { 
    registerUser, 
    loginUser, 
    logoutUser,
    user,
    isLoading
  }
}
