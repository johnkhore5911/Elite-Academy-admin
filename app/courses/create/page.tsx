"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, X } from "lucide-react"
import { api } from "@/lib/api"
import Header from "@/components/header"

export default function CreateCoursePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [productId, setProductId] = useState("")
  const [entitlementId, setEntitlementId] = useState("")
  const [price, setPrice] = useState("")
  const [totalQuestions, setTotalQuestions] = useState("")
  const [features, setFeatures] = useState<string[]>([""])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const addFeatureField = () => {
    setFeatures([...features, ""])
  }

  const removeFeatureField = (index: number) => {
    const newFeatures = [...features]
    newFeatures.splice(index, 1)
    setFeatures(newFeatures)
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const handleCreateCourse = async () => {
    try {
      setError("")
      setLoading(true)

      // Validate inputs
      if (!name.trim()) {
        setError("Course name is required")
        return
      }
      if(!productId.trim()){
        setError("ProductId is required")
        return
      }

      if(!entitlementId.trim()){
        setError("entitlementId is required")
        return
      }

      if (isNaN(Number(price)) || Number(price) <= 0) {
        setError("Price must be a positive number")
        return
      }

      if (isNaN(Number(totalQuestions)) || Number(totalQuestions) <= 0) {
        setError("Total questions must be a positive number")
        return
      }

      // Filter out empty features
      const filteredFeatures = features.filter((f) => f.trim() !== "")

      if (filteredFeatures.length === 0) {
        setError("At least one feature is required")
        return
      }

      const response = await api.post("/courses", {
        name,
        productId:productId,
        price: Number(price),
        totalQuestions: Number(totalQuestions),
        features: filteredFeatures,
        entitlementId
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Create course failed:", error)
      setError(error.response?.data?.message || "Failed to create course. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header title="Create Course" />

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#1f2937]">Create New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. English Mastery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productId">Product Id</Label>
                <Input
                  id="productId"
                  placeholder="Get it from google play console"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entitlementId">Entitlement Id</Label>
                <Input
                  id="entitlementId"
                  placeholder="Get it from Revenuecat"
                  value={entitlementId}
                  onChange={(e) => setEntitlementId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g. 499"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalQuestions">Total Questions</Label>
                <Input
                  id="totalQuestions"
                  type="number"
                  placeholder="e.g. 100"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                    />
                    {features.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFeatureField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addFeatureField}>
                  Add Feature
                </Button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex space-x-4 pt-4">
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
                <Button className="bg-[#3b82f6] hover:bg-[#2563eb]" onClick={handleCreateCourse} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Create Course
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
