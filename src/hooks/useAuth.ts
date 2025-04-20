import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/sonner'
import { User, Session } from '@supabase/supabase-js'
import type { UserProfile } from '@/types/auth'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        
        if (currentSession?.user) {
          fetchProfile(currentSession.user.id)
        } else {
          setProfile(null)
        }
      }
    )

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id)
      }
      setIsInitialized(true)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const registerUser = async (userData: {
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    dateOfBirth: Date
  }) => {
    setIsLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName
          }
        }
      })

      if (authError) throw authError

      if (data?.user) {
        toast.success('Registration successful! You can now log in.')
        return data.user
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
        toast.error(error.message)
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
    profile,
    isLoading,
    isInitialized
  }
}
