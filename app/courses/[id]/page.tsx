"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, FileText, BookOpen, Plus, Trash2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SectionTest {
  _id: string
  course: string
  name: string
  totalQuestions: number
  totalMarks: number
  timeLimitMinutes: number
  instructions: string[]
}

interface MockTest {
  _id: string
  course: string
  name: string
  totalQuestions: number
  totalMarks: number
  timeLimitMinutes: number
  level: "Easy" | "Medium" | "Hard"
  instructions: string[]
}

interface CourseDetailsProps {
  params: {
    id: string
  }
}

export default function CourseDetailsPage({ params }: CourseDetailsProps) {
  console.log("CourseDetailsPage params:", params.id)
  const courseId = params?.id;
  // const courseId = params.id
  const router = useRouter()

  const [courseName, setCourseName] = useState("")
  const [sectionTests, setSectionTests] = useState<SectionTest[]>([])
  const [mockTests, setMockTests] = useState<MockTest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Delete test dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [testToDelete, setTestToDelete] = useState<{ id: string; type: "section" | "mock"; name: string } | null>(null)
  const [confirmationText, setConfirmationText] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log("Fetching course data for courseId:", courseId)
        if (!courseId) {
          setError("Course ID is missing.")
          return
        }

        // Fetch course details to get the name
        // const courseResponse = await api.get(`/courses/${courseId}`)
        // setCourseName(courseResponse.data.name)

        // Fetch section tests
        console.log("Fetching section tests for course:", courseId)
        const sectionTestsResponse = await api.get(`/section-tests/course/${courseId}`)
        console.log("Section Tests Response:", sectionTestsResponse.data)
        setSectionTests(sectionTestsResponse.data)

        // Fetch mock tests
        const mockTestsResponse = await api.get(`/mock-tests/course/${courseId}`)
        setMockTests(mockTestsResponse.data)
      } catch (error: any) {
        console.error("Error fetching course data:", error)
        setError("Failed to load course data. Please try again.")

        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem("token")
          router.push("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId, router])

  const openDeleteDialog = (id: string, type: "section" | "mock", name: string) => {
    setTestToDelete({ id, type, name })
    setDeleteDialogOpen(true)
    setConfirmationText("")
  }

  const handleDeleteTest = async () => {
    if (!testToDelete) return

    const expectedText = `please delete this ${testToDelete.id} ${testToDelete.type === "section" ? "section test" : "mock test"} I confirm`

    if (confirmationText !== expectedText) {
      setError("Confirmation text doesn't match. Please try again.")
      return
    }

    try {
      setDeleteLoading(true)

      if (testToDelete.type === "section") {
        await api.delete(`/section-tests/${testToDelete.id}`)
        setSectionTests(sectionTests.filter((test) => test._id !== testToDelete.id))
      } else {
        await api.delete(`/mock-tests/${testToDelete.id}`)
        setMockTests(mockTests.filter((test) => test._id !== testToDelete.id))
      }

      setDeleteDialogOpen(false)
      setTestToDelete(null)
    } catch (error) {
      console.error("Error deleting test:", error)
      setError("Failed to delete test. Please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const navigateToTestQuestions = (testId: string, testType: "SectionTest" | "MockTest") => {
    router.push(`/questions/${testType}/${testId}`)
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
      <Header title={courseName} showBackButton />

      <main className="container mx-auto px-4 py-8">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <Tabs defaultValue="section-tests" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="section-tests">Section Tests</TabsTrigger>
            <TabsTrigger value="mock-tests">Mock Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="section-tests">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#1f2937]">Section Tests</h2>
              <Button
                onClick={() => router.push(`/section-tests/create?courseId=${courseId}`)}
                className="bg-[#3b82f6] hover:bg-[#2563eb]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section Test
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectionTests.length > 0 ? (
                sectionTests.map((test) => (
                  <Card
                    key={test._id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigateToTestQuestions(test._id, "SectionTest")}
                  >
                    <CardContent className="p-4 relative">
                      <div
                        className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDeleteDialog(test._id, "section", test.name)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-[#dc2626]" />
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="bg-gradient-to-br from-[#ffffff] to-[#f0fdf4] rounded-full p-2 border">
                          <FileText className="h-5 w-5 text-[#3b82f6]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#1f2937]">{test.name}</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="text-xs">
                          <p className="text-[#6b7280]">Questions</p>
                          <p className="font-medium">{test.totalQuestions}</p>
                        </div>
                        <div className="text-xs">
                          <p className="text-[#6b7280]">Marks</p>
                          <p className="font-medium">{test.totalMarks}</p>
                        </div>
                        <div className="text-xs">
                          <p className="text-[#6b7280]">Time Limit</p>
                          <p className="font-medium">{test.timeLimitMinutes} min</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-[#6b7280] col-span-3">No section tests found. Add your first section test!</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mock-tests">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#1f2937]">Mock Tests</h2>
              <Button
                onClick={() => router.push(`/mock-tests/create?courseId=${courseId}`)}
                className="bg-[#3b82f6] hover:bg-[#2563eb]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Mock Test
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTests.length > 0 ? (
                mockTests.map((test) => (
                  <Card
                    key={test._id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigateToTestQuestions(test._id, "MockTest")}
                  >
                    <CardContent className="p-4 relative">
                      <div
                        className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDeleteDialog(test._id, "mock", test.name)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-[#dc2626]" />
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="bg-gradient-to-br from-[#ffffff] to-[#f0fdf4] rounded-full p-2 border">
                          <BookOpen className="h-5 w-5 text-[#3b82f6]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#1f2937]">{test.name}</h3>
                          <Badge
                            className={`text-xs mt-1 ${
                              test.level === "Easy"
                                ? "bg-green-100 text-green-800"
                                : test.level === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {test.level}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="text-xs">
                          <p className="text-[#6b7280]">Questions</p>
                          <p className="font-medium">{test.totalQuestions}</p>
                        </div>
                        <div className="text-xs">
                          <p className="text-[#6b7280]">Marks</p>
                          <p className="font-medium">{test.totalMarks}</p>
                        </div>
                        <div className="text-xs">
                          <p className="text-[#6b7280]">Time Limit</p>
                          <p className="font-medium">{test.timeLimitMinutes} min</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-[#6b7280] col-span-3">No mock tests found. Add your first mock test!</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Test Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#dc2626]">
              Delete {testToDelete?.type === "section" ? "Section Test" : "Mock Test"}
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the test and all associated questions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-[#6b7280]">
              To confirm, type:{" "}
              <span className="font-mono bg-gray-100 p-1 rounded text-xs">
                please delete this {testToDelete?.id} {testToDelete?.type === "section" ? "section test" : "mock test"}{" "}
                I confirm
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
            <Button className="bg-[#dc2626] hover:bg-red-700" onClick={handleDeleteTest} disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
