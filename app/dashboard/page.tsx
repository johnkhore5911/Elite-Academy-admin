// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Loader2, UserIcon, BookOpenIcon, PlusIcon, Trash2Icon } from "lucide-react"
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
// import { ScrollArea } from "@/components/ui/scroll-area"
// import Header from "@/components/header"

// interface Course {
//   _id: string
//   name: string
//   price: number
//   totalQuestions: number
//   features: string[]
//   createdAt: string
//   updatedAt: string
// }

// export default function DashboardPage() {
//   const router = useRouter()
//   const [users, setUsers] = useState<any[]>([])
//   const [courses, setCourses] = useState<Course[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")

//   // Delete course dialog state
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
//   const [confirmationText, setConfirmationText] = useState("")
//   const [deleteLoading, setDeleteLoading] = useState(false)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)

//         // Fetch users
//         const usersResponse = await api.get("/admin/all-users")
//         setUsers(usersResponse.data.users)

//         // Fetch courses
//         const coursesResponse = await api.get("/courses")
//         setCourses(coursesResponse.data)
//       } catch (error: any) {
//         console.error("Error fetching dashboard data:", error)
//         setError("Failed to load dashboard data. Please try again.")

//         // If unauthorized, redirect to login
//         if (error.response?.status === 401) {
//           localStorage.removeItem("token")
//           router.push("/login")
//         }
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [router])

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     router.push("/login")
//   }

//   const openDeleteDialog = (course: Course) => {
//     setCourseToDelete(course)
//     setDeleteDialogOpen(true)
//     setConfirmationText("")
//   }

//   const handleDeleteCourse = async () => {
//     if (!courseToDelete) return

//     const expectedText = `please delete this ${courseToDelete._id} course I confirm`

//     if (confirmationText !== expectedText) {
//       setError("Confirmation text doesn't match. Please try again.")
//       return
//     }

//     try {
//       setDeleteLoading(true)
//       await api.delete(`/courses/${courseToDelete._id}`)

//       // Update courses list
//       setCourses(courses.filter((course) => course._id !== courseToDelete._id))
//       setDeleteDialogOpen(false)
//       setCourseToDelete(null)
//     } catch (error) {
//       console.error("Error deleting course:", error)
//       setError("Failed to delete course. Please try again.")
//     } finally {
//       setDeleteLoading(false)
//     }
//   }

//   const navigateToCourseDetails = (courseId: string) => {
//     router.push(`/courses/${courseId}`)
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
//       <Header title="Dashboard" onLogout={handleLogout} />

//       <main className="container mx-auto px-4 py-8">
//         {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

//         {/* Students Section */}
//         <section className="mb-10">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-[#1f2937]">Students</h2>
//           </div>
//             <ScrollArea className="w-full overflow-x-auto pb-4">
//               <div className="flex space-x-4 min-w-max">
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <Card key={user._id} className="min-w-[250px] bg-gradient-to-br from-[#ffffff] to-[#f0fdf4]">
//                     <CardContent className="p-4">
//                       <div className="flex items-center space-x-4">
//                         <div className="bg-[#3b82f6] rounded-full p-2">
//                           <UserIcon className="h-5 w-5 text-white" />
//                         </div>
//                         <div>
//                           <h3 className="font-medium text-[#1f2937]">Student</h3>
//                           <p className="text-sm text-[#6b7280]">{user.email}</p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))
//               ) : (
//                 <p className="text-[#6b7280]">No students found.</p>
//               )}
//             </div>
//           </ScrollArea>
//         </section>

//         {/* Courses Section */}
//         <section>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-[#1f2937]">Courses</h2>
//             <Button onClick={() => router.push("/courses/create")} className="bg-[#3b82f6] hover:bg-[#2563eb]">
//               <PlusIcon className="h-4 w-4 mr-2" />
//               Add Course
//             </Button>
//           </div>

//           <ScrollArea className="w-full whitespace-nowrap pb-4">
//             <div className="flex space-x-4">
//               {courses.length > 0 ? (
//                 courses.map((course) => (
//                   <Card
//                     key={course._id}
//                     className="min-w-[300px] cursor-pointer hover:shadow-md transition-shadow"
//                     onClick={() => navigateToCourseDetails(course._id)}
//                   >
//                     <CardContent className="p-4 relative">
//                       <div
//                         className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-red-100"
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           openDeleteDialog(course)
//                         }}
//                       >
//                         <Trash2Icon className="h-4 w-4 text-[#dc2626]" />
//                       </div>

//                       <div className="flex items-center space-x-4 mb-3">
//                         <div className="bg-gradient-to-br from-[#3b82f6] via-[#7B61FF] to-[#6366f1] rounded-full p-2">
//                           <BookOpenIcon className="h-5 w-5 text-white" />
//                         </div>
//                         <div>
//                           <h3 className="font-medium text-[#1f2937]">{course.name}</h3>
//                           <p className="text-sm text-[#6b7280]">₹{course.price}</p>
//                         </div>
//                       </div>

//                       <div className="mt-2">
//                         <p className="text-xs text-[#6b7280] mb-1">Features:</p>
//                         <ul className="text-xs text-[#6b7280] list-disc pl-4">
//                           {course.features.slice(0, 3).map((feature, index) => (
//                             <li key={index}>{feature}</li>
//                           ))}
//                           {course.features.length > 3 && <li>+ more</li>}
//                         </ul>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))
//               ) : (
//                 <p className="text-[#6b7280]">No courses found. Add your first course!</p>
//               )}
//             </div>
//           </ScrollArea>
//         </section>
//       </main>

//       {/* Delete Course Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-[#dc2626]">Delete Course</DialogTitle>
//             <DialogDescription>
//               This action cannot be undone. This will permanently delete the course and all associated section tests,
//               mock tests, and questions.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <p className="text-sm text-[#6b7280]">
//               To confirm, type:{" "}
//               <span className="font-mono bg-gray-100 p-1 rounded text-xs">
//                 please delete this {courseToDelete?._id} course I confirm
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
//             <Button className="bg-[#dc2626] hover:bg-red-700" onClick={handleDeleteCourse} disabled={deleteLoading}>
//               {deleteLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//               Delete Course
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
import { Loader2, UserIcon, BookOpenIcon, PlusIcon, Trash2Icon } from "lucide-react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import Header from "@/components/header"

interface Course {
  _id: string
  name: string
  price: number
  totalQuestions: number
  features: string[]
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Delete course dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [confirmationText, setConfirmationText] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch users
        const usersResponse = await api.get("/admin/all-users")
        setUsers(usersResponse.data.users)

        // Fetch courses
        const coursesResponse = await api.get("/courses")
        setCourses(coursesResponse.data)
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try again.")

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
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const openDeleteDialog = (course: Course) => {
    setCourseToDelete(course)
    setDeleteDialogOpen(true)
    setConfirmationText("")
  }

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return

    const expectedText = `please delete this ${courseToDelete._id} course I confirm`

    if (confirmationText !== expectedText) {
      setError("Confirmation text doesn't match. Please try again.")
      return
    }

    try {
      setDeleteLoading(true)
      await api.delete(`/courses/${courseToDelete._id}`)

      // Update courses list
      setCourses(courses.filter((course) => course._id !== courseToDelete._id))
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    } catch (error) {
      console.error("Error deleting course:", error)
      setError("Failed to delete course. Please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const navigateToCourseDetails = (courseId: string) => {
    router.push(`/courses/${courseId}`)
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
      <Header title="Dashboard" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {/* Students Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#1f2937]">Students</h2>
          </div>
            <ScrollArea className="w-full overflow-x-auto pb-4">
              <div className="flex space-x-4 min-w-max">
              {users.length > 0 ? (
                users.map((user) => (
                  <Card key={user._id} className="min-w-[250px] bg-gradient-to-br from-[#ffffff] to-[#f0fdf4]">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-[#3b82f6] rounded-full p-2">
                          <UserIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#1f2937]">Student</h3>
                          <p className="text-sm text-[#6b7280]">{user.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-[#6b7280]">No students found.</p>
              )}
            </div>
          </ScrollArea>
        </section>

        {/* Courses Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#1f2937]">Courses</h2>
            <Button onClick={() => router.push("/courses/create")} className="bg-[#3b82f6] hover:bg-[#2563eb]">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>

          {/* Changed from ScrollArea with horizontal scrolling to a responsive grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Card
                  key={course._id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigateToCourseDetails(course._id)}
                >
                  <CardContent className="p-4 relative">
                    <div
                      className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-red-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        openDeleteDialog(course)
                      }}
                    >
                      <Trash2Icon className="h-4 w-4 text-[#dc2626]" />
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="bg-gradient-to-br from-[#3b82f6] via-[#7B61FF] to-[#6366f1] rounded-full p-2">
                        <BookOpenIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1f2937]">{course.name}</h3>
                        <p className="text-sm text-[#6b7280]">₹{course.price}</p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-xs text-[#6b7280] mb-1">Features:</p>
                      <ul className="text-xs text-[#6b7280] list-disc pl-4">
                        {course.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                        {course.features.length > 3 && <li>+ more</li>}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-[#6b7280] col-span-full">No courses found. Add your first course!</p>
            )}
          </div>
        </section>
      </main>

      {/* Delete Course Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#dc2626]">Delete Course</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the course and all associated section tests,
              mock tests, and questions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-[#6b7280]">
              To confirm, type:{" "}
              <span className="font-mono bg-gray-100 p-1 rounded text-xs">
                please delete this {courseToDelete?._id} course I confirm
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
            <Button className="bg-[#dc2626] hover:bg-red-700" onClick={handleDeleteCourse} disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}