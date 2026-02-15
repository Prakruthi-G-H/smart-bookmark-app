'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <button
            onClick={handleSignOut}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
            Sign out
        </button>
    )
}
