"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, X, Upload, Trash2 } from "lucide-react";
import { api } from "@/lib/api"
import Header from "@/components/header";
import Image from "next/image";
import {  Plus,ImageIcon } from "lucide-react"

interface Option {
  text: string;
  image?: { url: string; public_id?: string } | File | string | null;
  imagePreview?: string;
}

interface Question {
  questionText: string;
  questionImage?: { url: string; public_id?: string } | File | string | null;
  questionImagePreview?: string;
  options: Option[];
  correctOption: number | null;
  error?: string;
}

function EditQuestionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testType = searchParams.get("testType");
  const testId = searchParams.get("testId");
  const questionId = searchParams.get("questionId");

  const [question, setQuestion] = useState<Question>({
    questionText: "",
    questionImage: null,
    questionImagePreview: "",
    options: [
      { text: "", image: null, imagePreview: "" },
      { text: "", image: null, imagePreview: "" },
      { text: "", image: null, imagePreview: "" },
      { text: "", image: null, imagePreview: "" },
    ],
    correctOption: null,
  });

  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (!testType || !testId || !questionId) {
      router.push("/dashboard");
      return;
    }
    fetchQuestionData();
  }, [testType, testId, questionId, router]);

  const fetchQuestionData = async () => {
    try {
      setFetchLoading(true);
      const response = await api.get(`/questions/test/${testId}`);
      const questionData = response.data.find((q: any) => q._id === questionId);

      if (questionData) {
        setQuestion({
          questionText: questionData.questionText,
          questionImage: questionData.questionImage || null,
          questionImagePreview: questionData.questionImage?.url || "",
          options: questionData.options.map((opt: any) => ({
            text: opt.text || "",
            image: opt.image || null,
            imagePreview: opt.image?.url || "",
          })),
          correctOption: questionData.correctOption,
        });
      } else {
        setGlobalError("Question not found");
      }
    } catch (error: any) {
      console.error("Error fetching question:", error);
      setGlobalError("Failed to load question data");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleFileUpload = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const updateQuestionText = (value: string) => {
    setQuestion({ ...question, questionText: value, error: "" });
  };

  const updateQuestionImage = (file: File | null) => {
    setQuestion({
      ...question,
      questionImage: file,
      questionImagePreview: file ? handleFileUpload(file) : "",
      error: "",
    });
  };

  const removeQuestionImage = () => {
    setQuestion({
      ...question,
      questionImage: null,
      questionImagePreview: "",
    });
  };

  const updateOptionText = (optionIndex: number, value: string) => {
    setQuestion({
      ...question,
      options: question.options.map((opt, idx) =>
        idx === optionIndex ? { ...opt, text: value } : opt
      ),
      error: "",
    });
  };

  const updateOptionImage = (optionIndex: number, file: File | null) => {
    setQuestion({
      ...question,
      options: question.options.map((opt, idx) =>
        idx === optionIndex
          ? { ...opt, image: file, imagePreview: file ? handleFileUpload(file) : "" }
          : opt
      ),
      error: "",
    });
  };

  const removeOptionImage = (optionIndex: number) => {
    setQuestion({
      ...question,
      options: question.options.map((opt, idx) =>
        idx === optionIndex ? { ...opt, image: null, imagePreview: "" } : opt
      ),
    });
  };

  const addOptionField = () => {
    setQuestion({
      ...question,
      options: [...question.options, { text: "", image: null, imagePreview: "" }],
      error: "",
    });
  };

  const removeOptionField = (optionIndex: number) => {
    if (question.options.length <= 2) {
      setQuestion({ ...question, error: "At least 2 options are required." });
      return;
    }

    const newOptions = [...question.options];
    newOptions.splice(optionIndex, 1);

    let newCorrectOption = question.correctOption;
    if (newCorrectOption !== null) {
      if (newCorrectOption === optionIndex) {
        newCorrectOption = null;
      } else if (newCorrectOption > optionIndex) {
        newCorrectOption = newCorrectOption - 1;
      }
    }

    setQuestion({
      ...question,
      options: newOptions,
      correctOption: newCorrectOption,
      error: "",
    });
  };

  const setCorrectOption = (value: number) => {
    setQuestion({ ...question, correctOption: value, error: "" });
  };

  const validateQuestion = (): boolean => {
    if (!question.questionText.trim()) {
      setQuestion({ ...question, error: "Question text is required." });
      return false;
    }

    if (question.options.some((option) => !option.text.trim() && !option.image)) {
      setQuestion({ ...question, error: "All options must have either text or an image." });
      return false;
    }

    if (question.correctOption === null) {
      setQuestion({ ...question, error: "Please select the correct option." });
      return false;
    }

    return true;
  };

  const uploadFileToBackend = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.fileUrl;
    } catch (error) {
      // Fallback to base64
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      setGlobalError("");
      setLoading(true);

      if (!validateQuestion()) {
        setGlobalError("Please fix errors before submitting.");
        return;
      }

      let questionImageUrl = question.questionImage;
      if (question.questionImage instanceof File) {
        questionImageUrl = await uploadFileToBackend(question.questionImage);
      }

      const processedOptions = await Promise.all(
        question.options.map(async (option) => {
          let optionImageUrl = option.image;
          if (option.image instanceof File) {
            optionImageUrl = await uploadFileToBackend(option.image);
          }
          return { text: option.text, image: optionImageUrl };
        })
      );

      const payload = {
        testType,
        test: testId,
        questionText: question.questionText,
        questionImage: questionImageUrl,
        options: processedOptions,
        correctOption: question.correctOption,
      };

      await api.put(`/questions/${questionId}`, payload);
      router.push(`/questions/${testType}/${testId}`);
    } catch (error: any) {
      console.error("Update question failed:", error);
      setGlobalError(
        error.response?.data?.message || "Failed to update question. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-f8fafc">
      <Header title="Edit Question" showBackButton />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-1f2937">Edit Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Question Text */}
              <div className="space-y-2">
                <Label htmlFor="questionText">Question Text</Label>
                <Input
                  id="questionText"
                  placeholder="e.g. What is the capital of India?"
                  value={question.questionText}
                  onChange={(e) => updateQuestionText(e.target.value)}
                />
              </div>

              {/* Question Image Upload */}
              <div className="space-y-2">
                <Label>Question Image (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      updateQuestionImage(file || null);
                    }}
                    className="hidden"
                    id="question-image"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("question-image")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  {question.questionImagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeQuestionImage}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                {question.questionImagePreview && (
                  <div className="mt-2">
                    <Image
                      src={question.questionImagePreview}
                      alt="Question preview"
                      width={300}
                      height={200}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Options</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addOptionField}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                <RadioGroup
                  value={question.correctOption !== null ? question.correctOption.toString() : undefined}
                  onValueChange={(value) => setCorrectOption(Number.parseInt(value))}
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`option-${optionIndex}`}
                        />
                        <Label htmlFor={`option-${optionIndex}`} className="font-medium">
                          Option {optionIndex + 1}
                        </Label>
                        {question.options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOptionField(optionIndex)}
                            className="ml-auto"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <Input
                        placeholder={`Enter option ${optionIndex + 1} text`}
                        value={option.text}
                        onChange={(e) => updateOptionText(optionIndex, e.target.value)}
                      />

                      {/* Option Image Upload */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              updateOptionImage(optionIndex, file || null);
                            }}
                            className="hidden"
                            id={`option-image-${optionIndex}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document.getElementById(`option-image-${optionIndex}`)?.click()
                            }
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Add Image
                          </Button>
                          {option.imagePreview && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOptionImage(optionIndex)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Image
                            </Button>
                          )}
                        </div>
                        {option.imagePreview && (
                          <Image
                            src={option.imagePreview}
                            alt={`Option ${optionIndex + 1} preview`}
                            width={150}
                            height={100}
                            className="rounded-md object-cover"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-xs text-6b7280">
                  Select the radio button next to the correct answer
                </p>
              </div>

              {question.error && <p className="text-red-500 text-sm">{question.error}</p>}
            </div>

            {globalError && <p className="text-red-500 text-sm">{globalError}</p>}

            <div className="flex space-x-4 pt-4">
              <Button variant="outline" onClick={() => router.push(`/questions/${testType}/${testId}`)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                className="bg-3b82f6 hover:bg-2563eb"
                onClick={handleUpdateQuestion}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Update Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function EditQuestionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <EditQuestionForm />
    </Suspense>
  );
}
