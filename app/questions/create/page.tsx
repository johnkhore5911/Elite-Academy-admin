// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Loader2, X, Plus } from "lucide-react"
// import { api } from "@/lib/api"
// import Header from "@/components/header"

// export default function CreateQuestionPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const testType = searchParams.get("testType")
//   const testId = searchParams.get("testId")

//   const [questionText, setQuestionText] = useState("")
//   const [options, setOptions] = useState<string[]>(["", "", "", ""])
//   const [correctOption, setCorrectOption] = useState<number | null>(null)
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     if (!testType || !testId) {
//       router.push("/dashboard")
//     }
//   }, [testType, testId, router])

//   const updateOption = (index: number, value: string) => {
//     const newOptions = [...options]
//     newOptions[index] = value
//     setOptions(newOptions)
//   }

//   const addOptionField = () => {
//     setOptions([...options, ""])
//   }

//   const removeOptionField = (index: number) => {
//     if (options.length <= 2) {
//       setError("At least 2 options are required")
//       return
//     }

//     const newOptions = [...options]
//     newOptions.splice(index, 1)
//     setOptions(newOptions)

//     // Adjust correctOption if needed
//     if (correctOption !== null) {
//       if (correctOption === index) {
//         setCorrectOption(null)
//       } else if (correctOption > index) {
//         setCorrectOption(correctOption - 1)
//       }
//     }
//   }

//   const handleCreateQuestion = async () => {
//     try {
//       setError("")
//       setLoading(true)

//       // Validate inputs
//       if (!questionText.trim()) {
//         setError("Question text is required")
//         return
//       }

//       // Check if all options have content
//       if (options.some((option) => !option.trim())) {
//         setError("All options must have content")
//         return
//       }

//       if (correctOption === null) {
//         setError("Please select the correct option")
//         return
//       }

//       const response = await api.post("/questions", {
//             questions: [
//               {
//                 testType,
//                 test: testId,
//                 questionText,
//                 options,
//                 correctOption,
//               },
//             ],
//       })

//       router.push(`/questions/${testType}/${testId}`)
//     } catch (error: any) {
//       console.error("Create question failed:", error)
//       setError(error.response?.data?.message || "Failed to create question. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#f8fafc]">
//       <Header title="Create Question" showBackButton />

//       <main className="container mx-auto px-4 py-8">
//         <Card className="max-w-2xl mx-auto">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-[#1f2937]">Create New Question</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="questionText">Question Text</Label>
//                 <Input
//                   id="questionText"
//                   placeholder="e.g. What is 2+2?"
//                   value={questionText}
//                   onChange={(e) => setQuestionText(e.target.value)}
//                 />
//               </div>

//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <Label>Options</Label>
//                   <Button type="button" variant="outline" size="sm" onClick={addOptionField}>
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Option
//                   </Button>
//                 </div>

//                 <RadioGroup
//                   value={correctOption !== null ? correctOption.toString() : undefined}
//                   onValueChange={(value) => setCorrectOption(Number.parseInt(value))}
//                 >
//                   {options.map((option, index) => (
//                     <div key={index} className="flex items-center space-x-2 mb-2">
//                       <RadioGroupItem value={index.toString()} id={`option-${index}`} />
//                       <div className="flex-1">
//                         <Input
//                           placeholder={`Option ${index + 1}`}
//                           value={option}
//                           onChange={(e) => updateOption(index, e.target.value)}
//                         />
//                       </div>
//                       {options.length > 2 && (
//                         <Button type="button" variant="ghost" size="icon" onClick={() => removeOptionField(index)}>
//                           <X className="h-4 w-4" />
//                         </Button>
//                       )}
//                     </div>
//                   ))}
//                 </RadioGroup>
//                 <p className="text-xs text-[#6b7280]">Select the radio button next to the correct answer</p>
//               </div>

//               {error && <p className="text-red-500 text-sm">{error}</p>}

//               <div className="flex space-x-4 pt-4">
//                 <Button variant="outline" onClick={() => router.push(`/questions/${testType}/${testId}`)}>
//                   Cancel
//                 </Button>
//                 <Button className="bg-[#3b82f6] hover:bg-[#2563eb]" onClick={handleCreateQuestion} disabled={loading}>
//                   {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//                   Create Question
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   )
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, X, Plus } from "lucide-react";
import { api } from "@/lib/api";
import Header from "@/components/header";
import { v4 as uuidv4 } from "uuid";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOption: number | null;
  error?: string;
}

export default function CreateQuestionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testType = searchParams.get("testType");
  const testId = searchParams.get("testId");

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: uuidv4(),
      questionText: "",
      options: ["", "", "", ""],
      correctOption: null,
    },
  ]);
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!testType || !testId) {
      router.push("/dashboard");
    }
  }, [testType, testId, router]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: uuidv4(),
        questionText: "",
        options: ["", "", "", ""],
        correctOption: null,
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length <= 1) {
      setGlobalError("At least one question is required.");
      return;
    }
    setQuestions(questions.filter((question) => question.id !== id));
    setGlobalError("");
  };

  const updateQuestionText = (id: string, value: string) => {
    setQuestions(
      questions.map((question) =>
        question.id === id ? { ...question, questionText: value, error: "" } : question
      )
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
              error: "",
            }
          : question
      )
    );
  };

  const addOptionField = (questionId: string) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? { ...question, options: [...question.options, ""], error: "" }
          : question
      )
    );
  };

  const removeOptionField = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((question) => {
        if (question.id !== questionId) return question;
        if (question.options.length <= 2) {
          return { ...question, error: "At least 2 options are required." };
        }
        const newOptions = [...question.options];
        newOptions.splice(optionIndex, 1);
        let newCorrectOption = question.correctOption;
        if (newCorrectOption !== null) {
          if (newCorrectOption === optionIndex) {
            newCorrectOption = null;
          } else if (newCorrectOption > optionIndex) {
            newCorrectOption -= 1;
          }
        }
        return { ...question, options: newOptions, correctOption: newCorrectOption, error: "" };
      })
    );
  };

  const setCorrectOption = (questionId: string, value: number) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? { ...question, correctOption: value, error: "" }
          : question
      )
    );
  };

  const validateQuestions = () => {
    let isValid = true;
    const updatedQuestions = questions.map((question) => {
      if (!question.questionText.trim()) {
        isValid = false;
        return { ...question, error: "Question text is required." };
      }
      if (question.options.some((option) => !option.trim())) {
        isValid = false;
        return { ...question, error: "All options must have content." };
      }
      if (question.correctOption === null) {
        isValid = false;
        return { ...question, error: "Please select the correct option." };
      }
      return { ...question, error: "" };
    });
    setQuestions(updatedQuestions);
    return isValid;
  };

  const handleCreateQuestions = async () => {
    try {
      setGlobalError("");
      setLoading(true);

      if (!validateQuestions()) {
        setGlobalError("Please fix errors in the questions before submitting.");
        return;
      }

      const payload = {
        questions: questions.map((question) => ({
          testType,
          test: testId,
          questionText: question.questionText,
          options: question.options,
          correctOption: question.correctOption,
        })),
      };

      const response = await api.post("/questions", payload);

      router.push(`/questions/${testType}/${testId}`);
    } catch (error: any) {
      console.error("Create questions failed:", error);
      setGlobalError(
        error.response?.data?.message || "Failed to create questions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header title="Create Questions" showBackButton />

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#1f2937]">
              Create New Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {questions.map((question, questionIndex) => (
                <div key={question.id} className="space-y-6 border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-semibold">
                      Question {questionIndex + 1}
                    </Label>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`questionText-${question.id}`}>Question Text</Label>
                    <Input
                      id={`questionText-${question.id}`}
                      placeholder="e.g. What is 2+2?"
                      value={question.questionText}
                      onChange={(e) => updateQuestionText(question.id, e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Options</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOptionField(question.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>

                    <RadioGroup
                      value={
                        question.correctOption !== null
                          ? question.correctOption.toString()
                          : undefined
                      }
                      onValueChange={(value) =>
                        setCorrectOption(question.id, Number.parseInt(value))
                      }
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                          <RadioGroupItem
                            value={optionIndex.toString()}
                            id={`option-${question.id}-${optionIndex}`}
                          />
                          <div className="flex-1">
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                updateOption(question.id, optionIndex, e.target.value)
                              }
                            />
                          </div>
                          {question.options.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOptionField(question.id, optionIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                    <p className="text-xs text-[#6b7280]">
                      Select the radio button next to the correct answer
                    </p>
                  </div>

                  {question.error && (
                    <p className="text-red-500 text-sm">{question.error}</p>
                  )}
                </div>
              ))}

              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Question
                </Button>
              </div>

              {globalError && <p className="text-red-500 text-sm">{globalError}</p>}

              <div className="flex space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/questions/${testType}/${testId}`)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#3b82f6] hover:bg-[#2563eb]"
                  onClick={handleCreateQuestions}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Create Questions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}