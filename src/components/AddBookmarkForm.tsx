'use client'

import { createClient } from '@/lib/supabase'
import { useState } from 'react'

export default function AddBookmarkForm() {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url || !title) return

        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                alert('You must be logged in to add a bookmark')
                return
            }

            const { error } = await supabase
                .from('bookmarks')
                .insert([{ title, url, user_id: user.id }])

            if (error) throw error

            setUrl('')
            setTitle('')
        } catch (error) {
            console.error('Error adding bookmark:', error)
            alert('Error adding bookmark')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Add New Bookmark</h3>
            <div className="mb-4">
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="My Favorite Site"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="url" className="mb-2 block text-sm font-medium text-gray-700">
                    URL
                </label>
                <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://example.com"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {loading ? 'Adding...' : 'Add Bookmark'}
            </button>
        </form>
    )
}
