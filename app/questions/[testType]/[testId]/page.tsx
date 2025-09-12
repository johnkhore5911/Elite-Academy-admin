// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Loader2, Plus, Trash2 } from "lucide-react"
// import { api } from "@/lib/api"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import Header from "@/components/header"
// import React from "react"

// interface Question {
//   _id: string
//   testType: "SectionTest" | "MockTest"
//   test: string
//   questionText: string
//   options: string[]
//   correctOption: number
// }

// interface QuestionsPageProps {
//   params: Promise<{
//     testType: string
//     testId: string
//   }>
// }

// export default function QuestionsPage({ params }: QuestionsPageProps) {
//   // const { testType, testId } = params
//   // const router = useRouter()
//     const resolvedParams = React.use(params)
//   const { testType, testId } = resolvedParams
//   const router = useRouter()

//   const [testName, setTestName] = useState("")
//   const [questions, setQuestions] = useState<Question[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")

//   // Delete question dialog state
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [questionToDelete, setQuestionToDelete] = useState<{ id: string; text: string } | null>(null)
//   const [confirmationText, setConfirmationText] = useState("")
//   const [deleteLoading, setDeleteLoading] = useState(false)

//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setLoading(true)
//       console.log("Fetching questions for testId:", testId)
//       const questionsResponse = await api.get(`/questions/test/${testId}`)
//       // If no questions are returned, treat it as an empty array
//       if (questionsResponse.data.length === 0) {
//         setQuestions([])
//         setError("No questions found for this test.")
//       } else {
//         setQuestions(questionsResponse.data)
//       }
//     } catch (error: any) {
//       console.error("Error fetching questions data:", error)
//       // If 404 is received, consider it as no data found instead of an error state
//       if (error.response?.status === 404) {
//         setQuestions([])
//         setError("No questions found for this test.")
//       } else {
//         setError("Failed to load questions data. Please try again.")
//       }
//     } finally {
//       setLoading(false)
//     }
//   }
//   fetchData()
// }, [testId, testType, router])

//   const openDeleteDialog = (id: string, text: string) => {
//     setQuestionToDelete({ id, text })
//     setDeleteDialogOpen(true)
//     setConfirmationText("")
//   }

//   const handleDeleteQuestion = async () => {
//     if (!questionToDelete) return

//     const expectedText = `please delete this ${questionToDelete.id} question I confirm`

//     if (confirmationText !== expectedText) {
//       setError("Confirmation text doesn't match. Please try again.")
//       return
//     }

//     try {
//       setDeleteLoading(true)
//       await api.delete(`/questions/${questionToDelete.id}`)

//       // Update questions list
//       setQuestions(questions.filter((question) => question._id !== questionToDelete.id))
//       setDeleteDialogOpen(false)
//       setQuestionToDelete(null)
//     } catch (error) {
//       console.error("Error deleting question:", error)
//       setError("Failed to delete question. Please try again.")
//     } finally {
//       setDeleteLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 text-[#3b82f6] animate-spin" />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-[#f8fafc]">
//       <Header title={`Questions: ${testName}`} showBackButton />

//       <main className="container mx-auto px-4 py-8">
//         {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-[#1f2937]">Questions</h2>
//           <Button
//             onClick={() => router.push(`/questions/create?testType=${testType}&testId=${testId}`)}
//             className="bg-[#3b82f6] hover:bg-[#2563eb]"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Question
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 gap-4">
//           {questions.length > 0 ? (
//             questions.map((question) => (
//               <Card key={question._id} className="hover:shadow-md transition-shadow">
//                 <CardContent className="p-4 relative">
//                   <div
//                     className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-red-100"
//                     onClick={() => openDeleteDialog(question._id, question.questionText)}
//                   >
//                     <Trash2 className="h-4 w-4 text-[#dc2626]" />
//                   </div>

//                   <div className="mb-4">
//                     <h3 className="font-medium text-[#1f2937]">{question.questionText}</h3>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     {question.options.map((option, index) => (
//                       <div
//                         key={index}
//                         className={`p-2 rounded border ${
//                           index === question.correctOption ? "bg-green-50 border-green-200" : ""
//                         }`}
//                       >
//                         <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
//                         {option}
//                         {index === question.correctOption && (
//                           <span className="ml-2 text-green-600 text-xs">(Correct)</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <p className="text-[#6b7280]">No questions found. Add your first question!</p>
//           )}
//         </div>
//       </main>

//       {/* Delete Question Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-[#dc2626]">Delete Question</DialogTitle>
//             <DialogDescription>
//               This action cannot be undone. This will permanently delete the question.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <p className="text-sm text-[#6b7280]">
//               To confirm, type:{" "}
//               <span className="font-mono bg-gray-100 p-1 rounded text-xs">
//                 please delete this {questionToDelete?.id} question I confirm
//               </span>
//             </p>
//             <Input
//               value={confirmationText}
//               onChange={(e) => setConfirmationText(e.target.value)}
//               placeholder="Type confirmation text here"
//             />
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button className="bg-[#dc2626] hover:bg-red-700" onClick={handleDeleteQuestion} disabled={deleteLoading}>
//               {deleteLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//               Delete Question
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { api } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import React from "react"

interface Option {
  text: string
  image?: {
    url: string | null
    public_id: string | null
  }
  _id?: string
}

interface Question {
  _id: string
  testType: "SectionTest" | "MockTest"
  test: string
  questionText: string
  questionImage?: {
    url: string | null
    public_id: string | null
  }
  options: Option[]
  correctOption: number
}

interface QuestionsPageProps {
  params: Promise<{
    testType: string
    testId: string
  }>
}

export default function QuestionsPage({ params }: QuestionsPageProps) {
  const resolvedParams = React.use(params)
  const { testType, testId } = resolvedParams
  const router = useRouter()

  const [testName, setTestName] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Delete question dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<{ id: string; text: string } | null>(null)
  const [confirmationText, setConfirmationText] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log("Fetching questions for testId:", testId)
        const questionsResponse = await api.get(`/questions/test/${testId}`)
        // If no questions are returned, treat it as an empty array
        if (questionsResponse.data.length === 0) {
          setQuestions([])
          setError("No questions found for this test.")
        } else {
          setQuestions(questionsResponse.data)
        }
      } catch (error: any) {
        console.error("Error fetching questions data:", error)
        // If 404 is received, consider it as no data found instead of an error state
        if (error.response?.status === 404) {
          setQuestions([])
          setError("No questions found for this test.")
        } else {
          setError("Failed to load questions data. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [testId, testType, router])

  const openDeleteDialog = (id: string, text: string) => {
    setQuestionToDelete({ id, text })
    setDeleteDialogOpen(true)
    setConfirmationText("")
  }

  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return

    const expectedText = `please delete this ${questionToDelete.id} question I confirm`

    if (confirmationText !== expectedText) {
      setError("Confirmation text doesn't match. Please try again.")
      return
    }

    try {
      setDeleteLoading(true)
      await api.delete(`/questions/${questionToDelete.id}`)

      // Update questions list
      setQuestions(questions.filter((question) => question._id !== questionToDelete.id))
      setDeleteDialogOpen(false)
      setQuestionToDelete(null)
    } catch (error) {
      console.error("Error deleting question:", error)
      setError("Failed to delete question. Please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-[#3b82f6] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header title={`Questions: ${testName}`} showBackButton />

      <main className="container mx-auto px-4 py-8">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1f2937]">Questions</h2>
          <Button
            onClick={() => router.push(`/questions/create?testType=${testType}&testId=${testId}`)}
            className="bg-[#3b82f6] hover:bg-[#2563eb]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {questions.length > 0 ? (
            questions.map((question) => (
              <Card key={question._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 relative">
                  <div
                    className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-red-100 cursor-pointer"
                    onClick={() => openDeleteDialog(question._id, question.questionText)}
                  >
                    <Trash2 className="h-4 w-4 text-[#dc2626]" />
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium text-[#1f2937]">{question.questionText}</h3>
                    {/* Render question image if exists */}
                    {question.questionImage?.url && (
                      <img
                        src={question.questionImage.url}
                        alt="Question"
                        className="mt-2 max-w-xs max-h-48 rounded"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded border ${
                          index === question.correctOption ? "bg-green-50 border-green-200" : ""
                        }`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                        
                        {/* Render option text */}
                        <span className="mr-2">{option.text}</span>

                        {/* Render option image if exists */}
                        {option.image?.url && (
                          <img
                            src={option.image.url}
                            alt={`Option ${index + 1}`}
                            className="inline-block ml-2 max-w-[50px] max-h-[50px] rounded"
                          />
                        )}

                        {index === question.correctOption && (
                          <span className="ml-2 text-green-600 text-xs">(Correct)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-[#6b7280]">No questions found. Add your first question!</p>
          )}
        </div>
      </main>

      {/* Delete Question Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#dc2626]">Delete Question</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the question.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-[#6b7280]">
              To confirm, type:{" "}
              <span className="font-mono bg-gray-100 p-1 rounded text-xs">
                please delete this {questionToDelete?.id} question I confirm
              </span>
            </p>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type confirmation text here"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#dc2626] hover:bg-red-700" onClick={handleDeleteQuestion} disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
