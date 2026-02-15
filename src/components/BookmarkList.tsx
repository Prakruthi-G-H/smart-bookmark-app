'use client'

import { createClient } from '@/lib/supabase'
import { Bookmark } from '@/types'
import { useEffect, useState } from 'react'

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()

    useEffect(() => {
        // Set initial bookmarks in case they weren't passed or to ensure client sync
        setBookmarks(initialBookmarks)

        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [initialBookmarks, supabase])

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from('bookmarks').delete().eq('id', id)
            if (error) throw error
        } catch (error) {
            console.error('Error deleting bookmark:', error)
            alert('Error deleting bookmark')
        }
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg">
                    <div>
                        <h3 className="mb-2 text-xl font-semibold text-gray-800 break-words">{bookmark.title}</h3>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline break-all"
                        >
                            {bookmark.url}
                        </a>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => handleDelete(bookmark.id)}
                            className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
            {bookmarks.length === 0 && (
                <p className="col-span-full text-center text-gray-500">No bookmarks yet. Add one!</p>
            )}
        </div>
    )
}
