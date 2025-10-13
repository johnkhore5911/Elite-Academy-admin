// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Loader2, X } from "lucide-react"
// import { api } from "@/lib/api"
// import Header from "@/components/header"

// export default function CreateSubsectionPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const sectionTestId = searchParams.get("sectionTestId")

//   const [name, setName] = useState("")
//   const [totalQuestions, setTotalQuestions] = useState("")
//   const [totalMarks, setTotalMarks] = useState("")
//   const [timeLimitMinutes, setTimeLimitMinutes] = useState("")
//   const [instructions, setInstructions] = useState([""])
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     if (!sectionTestId) {
//       router.push("/dashboard")
//     }
//   }, [sectionTestId, router])

//   const addInstructionField = () => {
//     setInstructions([...instructions, ""])
//   }

//   const removeInstructionField = (index: number) => {
//     const newInstructions = [...instructions]
//     newInstructions.splice(index, 1)
//     setInstructions(newInstructions)
//   }

//   const updateInstruction = (index: number, value: string) => {
//     const newInstructions = [...instructions]
//     newInstructions[index] = value
//     setInstructions(newInstructions)
//   }

//   const handleCreateSubsection = async () => {
//     try {
//       setError("")
//       setLoading(true)

//       // Validate inputs
//       if (!name.trim()) {
//         setError("Subsection name is required")
//         return
//       }

//       if (isNaN(Number(totalQuestions)) || Number(totalQuestions) <= 0) {
//         setError("Total questions must be a positive number")
//         return
//       }

//       if (isNaN(Number(totalMarks)) || Number(totalMarks) <= 0) {
//         setError("Total marks must be a positive number")
//         return
//       }

//       if (isNaN(Number(timeLimitMinutes)) || Number(timeLimitMinutes) <= 0) {
//         setError("Time limit must be a positive number")
//         return
//       }

//       // Filter out empty instructions
//       const filteredInstructions = instructions.filter((i) => i.trim() !== "")

//       const response = await api.post("/subsections/create", {
//         sectionTest: sectionTestId,
//         name,
//         totalQuestions: Number(totalQuestions),
//         totalMarks: Number(totalMarks),
//         timeLimitMinutes: Number(timeLimitMinutes),
//         instructions: filteredInstructions,
//       })

//       router.push(`/section-tests/${sectionTestId}`)
//     } catch (error: any) {
//       console.error("Create subsection failed:", error)
//       setError(error.response?.data?.message || "Failed to create subsection. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <Header title="Create Subsection" showBackButton={true} />
//       <div className="container mx-auto p-6 max-w-2xl">
//         <Card>
//           <CardHeader>
//             <CardTitle>Create New Subsection</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="name">Subsection Name</Label>
//                 <Input
//                   id="name"
//                   placeholder="e.g., Math Basic, Math Advanced"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="totalQuestions">Total Questions</Label>
//                 <Input
//                   id="totalQuestions"
//                   type="number"
//                   placeholder="50"
//                   value={totalQuestions}
//                   onChange={(e) => setTotalQuestions(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="totalMarks">Total Marks</Label>
//                 <Input
//                   id="totalMarks"
//                   type="number"
//                   placeholder="100"
//                   value={totalMarks}
//                   onChange={(e) => setTotalMarks(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="timeLimitMinutes">Time Limit (minutes)</Label>
//                 <Input
//                   id="timeLimitMinutes"
//                   type="number"
//                   placeholder="60"
//                   value={timeLimitMinutes}
//                   onChange={(e) => setTimeLimitMinutes(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <Label>Instructions</Label>
//                 {instructions.map((instruction, index) => (
//                   <div key={index} className="flex gap-2 mb-2">
//                     <Input
//                       placeholder={`Instruction ${index + 1}`}
//                       value={instruction}
//                       onChange={(e) => updateInstruction(index, e.target.value)}
//                     />
//                     {instructions.length > 1 && (
//                       <Button
//                         type="button"
//                         variant="destructive"
//                         size="icon"
//                         onClick={() => removeInstructionField(index)}
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//                 <Button type="button" variant="outline" onClick={addInstructionField}>
//                   Add Instruction
//                 </Button>
//               </div>

//               {error && <div className="text-sm text-red-500">{error}</div>}

//               <div className="flex gap-2 justify-end">
//                 <Button variant="outline" onClick={() => router.push(`/section-tests/${sectionTestId}`)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handleCreateSubsection} disabled={loading}>
//                   {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
//                   Create Subsection
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </>
//   )
// }

"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, X } from "lucide-react"
import { api } from "@/lib/api"
import Header from "@/components/header"

function CreateSubsectionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sectionTestId = searchParams.get("sectionTestId")

  const [name, setName] = useState("")
  const [totalQuestions, setTotalQuestions] = useState("")
  const [totalMarks, setTotalMarks] = useState("")
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("")
  const [instructions, setInstructions] = useState([""])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sectionTestId) {
      router.push("/dashboard")
    }
  }, [sectionTestId, router])

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

  const handleCreateSubsection = async () => {
    try {
      setError("")
      setLoading(true)

      // Validate inputs
      if (!name.trim()) {
        setError("Subsection name is required")
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

      const response = await api.post("/subsections/create", {
        sectionTest: sectionTestId,
        name,
        totalQuestions: Number(totalQuestions),
        totalMarks: Number(totalMarks),
        timeLimitMinutes: Number(timeLimitMinutes),
        instructions: filteredInstructions,
      })

      router.push(`/section-tests/${sectionTestId}`)
    } catch (error: any) {
      console.error("Create subsection failed:", error)
      setError(error.response?.data?.message || "Failed to create subsection. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header title="Create Subsection" showBackButton={true} />
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Subsection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Subsection Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Math Basic, Math Advanced"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="totalQuestions">Total Questions</Label>
                <Input
                  id="totalQuestions"
                  type="number"
                  placeholder="50"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  placeholder="100"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="timeLimitMinutes">Time Limit (minutes)</Label>
                <Input
                  id="timeLimitMinutes"
                  type="number"
                  placeholder="60"
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(e.target.value)}
                />
              </div>

              <div>
                <Label>Instructions</Label>
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder={`Instruction ${index + 1}`}
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                    />
                    {instructions.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeInstructionField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addInstructionField}>
                  Add Instruction
                </Button>
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => router.push(`/section-tests/${sectionTestId}`)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSubsection} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Create Subsection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function CreateSubsectionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <CreateSubsectionForm />
    </Suspense>
  )
}
