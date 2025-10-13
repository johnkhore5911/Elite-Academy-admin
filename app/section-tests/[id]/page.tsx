"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { api } from "@/lib/api"
import Header from "@/components/header"
import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Subsection {
  _id: string
  name: string
  totalQuestions: number
  totalMarks: number
  timeLimitMinutes: number
  instructions: string[]
}

interface SectionTestPageProps {
  params: Promise<{
    id: string
  }>
}

export default function SectionTestSubsectionsPage({ params }: SectionTestPageProps) {
  const resolvedParams = React.use(params)
  const { id } = resolvedParams
  const router = useRouter()

  const [subsections, setSubsections] = useState<Subsection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Delete subsection dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subsectionToDelete, setSubsectionToDelete] = useState<{ id: string; name: string } | null>(null)
  const [confirmationText, setConfirmationText] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchSubsections = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/subsections/sectiontest/${id}`)
        setSubsections(response.data)
      } catch (error: any) {
        console.error("Error fetching subsections:", error)
        if (error.response?.status === 404) {
          setSubsections([])
        } else {
          setError("Failed to load subsections. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSubsections()
  }, [id])

  const openDeleteDialog = (subsectionId: string, subsectionName: string) => {
    setSubsectionToDelete({ id: subsectionId, name: subsectionName })
    setDeleteDialogOpen(true)
    setConfirmationText("")
  }

  const handleDeleteSubsection = async () => {
    if (!subsectionToDelete) return

    const expectedText = `please delete this ${subsectionToDelete.id} subsection I confirm`

    if (confirmationText !== expectedText) {
      setError("Confirmation text doesn't match. Please try again.")
      return
    }

    try {
      setDeleteLoading(true)
      await api.delete(`/subsections/${subsectionToDelete.id}`)
      setSubsections(subsections.filter((subsection) => subsection._id !== subsectionToDelete.id))
      setDeleteDialogOpen(false)
      setSubsectionToDelete(null)
    } catch (error) {
      console.error("Error deleting subsection:", error)
      setError("Failed to delete subsection. Please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Header title="Section Test Subsections" showBackButton={true} />
      <div className="container mx-auto p-6">
        {error && <div className="text-sm text-red-500 mb-4">{error}</div>}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Subsections</h1>
          <Button
            onClick={() => router.push(`/subsections/create?sectionTestId=${id}`)}
            className="bg-[#3b82f6] hover:bg-[#2563eb]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Subsection
          </Button>
        </div>

        <div className="grid gap-4">
          {subsections.length > 0 ? (
            subsections.map((subsection) => (
              <Card key={subsection._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">{subsection.name}</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Questions</p>
                          <p className="font-medium">{subsection.totalQuestions}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Marks</p>
                          <p className="font-medium">{subsection.totalMarks}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Time Limit</p>
                          <p className="font-medium">{subsection.timeLimitMinutes} min</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => openDeleteDialog(subsection._id, subsection.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => router.push(`/questions/Subsection/${subsection._id}`)}
                      className="bg-[#3b82f6] hover:bg-[#2563eb]"
                    >
                      View Questions
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/questions/create?testType=Subsection&testId=${subsection._id}`)}
                    >
                      Add Questions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No subsections found. Add your first subsection!
            </div>
          )}
        </div>

        {/* Delete Subsection Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Subsection</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the subsection and all its questions.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p className="text-sm mb-2">
                To confirm, type:{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  please delete this {subsectionToDelete?.id} subsection I confirm
                </code>
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
              <Button variant="destructive" onClick={handleDeleteSubsection} disabled={deleteLoading}>
                {deleteLoading ? <Loader2 className="h-4 w-4" /> : null}
                Delete Subsection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
