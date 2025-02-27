"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation"; // Use Next.js navigation
import AuthContext from "@/context/authContext";

const Message = () => {
    const { user } = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)//change this to .env
            if (!res.ok) {
            throw new Error("Failed to fetch users")
            }
            const data = await res.json()
            setUsers(data)
        } catch (error) {
            console.error("Error fetching users:", error)
            setError("Failed to load users. Please try again later.")
        } finally {
            setIsLoading(false)
        }
        }
        fetchUsers()
    }, [])

    if (isLoading) return <p className="text-gray-500 text-center pt-20">Loading...</p>
    if (error) return <p className="text-red-500 text-center pt-20">{error}</p>
    if (!user) return <p className="text-gray-500 text-center pt-20">Please log in to view messages.</p>

    return (
        <div className="flex min-h-screen items-start justify-center bg-gray-100 p-6 pt-9">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-green-600">Users</h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {users.length === 0 ? (
                <p className="text-center text-gray-500">No other users found.</p>
            ) : (
                users.map(
                (u) =>
                    u._id !== user._id && (
                    <div
                        key={u._id}
                        className="p-3 bg-gray-200 rounded-lg text-center cursor-pointer hover:bg-gray-300 transition"
                        onClick={() => router.push(`/chat?user=${u._id}`)}
                    >
                        {u.name}
                    </div>
                    ),
                )
            )}
            </div>
        </div>
        </div>
    )
    };

export default Message

