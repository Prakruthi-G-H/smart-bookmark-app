'use client'

import { createClient } from '@/lib/supabase'
import { useState } from 'react'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleLogin = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error) {
            console.error('Error logging in:', error)
            alert('Error logging in')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg">
                <div className="px-6 py-8">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Smart Bookmarks</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign in to manage your bookmarks
                        </p>
                    </div>
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Redirecting...' : 'Sign in with Google'}
                    </button>
                </div>
            </div>
        </div>
    )
}
