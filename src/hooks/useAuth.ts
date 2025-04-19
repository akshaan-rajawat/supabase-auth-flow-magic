
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/sonner'
import { User, Session } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Setup auth state listener and check initial session
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
      }
    )

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setIsInitialized(true)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
        // First check if the table exists to prevent 404 errors
        try {
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
        } catch (error) {
          console.error('Profile creation error:', error)
          toast.warning('User registered but could not create profile. The user_profiles table may not exist yet.')
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
      setSession(data.session)
      return data.user
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Email not confirmed') {
          toast.error('Please check your email to confirm your account before logging in')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error('Login failed')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logoutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error(error.message)
      } else {
        setUser(null)
        setSession(null)
        toast.success('Logged out successfully')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  return { 
    registerUser, 
    loginUser, 
    logoutUser,
    user,
    session,
    isLoading,
    isInitialized
  }
}
