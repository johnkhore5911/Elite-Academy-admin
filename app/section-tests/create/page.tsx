"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, X } from "lucide-react"
import { api } from "@/lib/api"
import Header from "@/components/header"

export default function CreateSectionTestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get("courseId")

  const [name, setName] = useState("")
  const [totalQuestions, setTotalQuestions] = useState("")
  const [totalMarks, setTotalMarks] = useState("")
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("")
  const [instructions, setInstructions] = useState<string[]>([""])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!courseId) {
      router.push("/dashboard")
    }
  }, [courseId, router])

  const addInstructionField = () => {
    setInstructions([...instructions, ""])
  }

  const removeInstructionField = (index: number) => {
    const newInstructions = [...instructions]
    newInstructions.splice(index, 1)
    setInstructions(newInstructions)
  }

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions]
    newInstructions[index] = value
    setInstructions(newInstructions)
  }

  const handleCreateSectionTest = async () => {
    try {
      setError("")
      setLoading(true)

      // Validate inputs
      if (!name.trim()) {
        setError("Test name is required")
        return
      }

      if (isNaN(Number(totalQuestions)) || Number(totalQuestions) <= 0) {
        setError("Total questions must be a positive number")
        return
      }

      if (isNaN(Number(totalMarks)) || Number(totalMarks) <= 0) {
        setError("Total marks must be a positive number")
        return
      }

      if (isNaN(Number(timeLimitMinutes)) || Number(timeLimitMinutes) <= 0) {
        setError("Time limit must be a positive number")
        return
      }

      // Filter out empty instructions
      const filteredInstructions = instructions.filter((i) => i.trim() !== "")

      const response = await api.post("/section-tests", {
        course: courseId,
        name,
        totalQuestions: Number(totalQuestions),
        totalMarks: Number(totalMarks),
        timeLimitMinutes: Number(timeLimitMinutes),
        instructions: filteredInstructions,
      })

      router.push(`/courses/${courseId}`)
    } catch (error: any) {
      console.error("Create section test failed:", error)
      setError(error.response?.data?.message || "Failed to create section test. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header title="Create Section Test" showBackButton />

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#1f2937]">Create New Section Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Test Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. English Grammar Section Test"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalQuestions">Total Questions</Label>
                <Input
                  id="totalQuestions"
                  type="number"
                  placeholder="e.g. 10"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  placeholder="e.g. 20"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimitMinutes">Time Limit (minutes)</Label>
                <Input
                  id="timeLimitMinutes"
                  type="number"
                  placeholder="e.g. 20"
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Instructions</Label>
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder={`Instruction ${index + 1}`}
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                    />
                    {instructions.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeInstructionField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addInstructionField}>
                  Add Instruction
                </Button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex space-x-4 pt-4">
                <Button variant="outline" onClick={() => router.push(`/courses/${courseId}`)}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#3b82f6] hover:bg-[#2563eb]"
                  onClick={handleCreateSectionTest}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Create Section Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
