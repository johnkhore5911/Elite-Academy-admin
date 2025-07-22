"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function SplashScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          // Validate token or directly navigate to dashboard
          router.push("/dashboard")
        } else {
          // No token, redirect to login after 2 seconds
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#3b82f6] via-[#7B61FF] to-[#6366f1]">
      <h1 className="text-4xl font-bold text-white mb-8">Elite Academy</h1>
      {loading && <Loader2 className="h-8 w-8 text-white animate-spin" />}
    </div>
  )
}
