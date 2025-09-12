
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Loader2, X, Plus } from "lucide-react";
// import { api } from "@/lib/api";
// import Header from "@/components/header";
// import { v4 as uuidv4 } from "uuid";

// interface Question {
//   id: string;
//   questionText: string;
//   options: string[];
//   correctOption: number | null;
//   error?: string;
// }

// export default function CreateQuestionPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const testType = searchParams.get("testType");
//   const testId = searchParams.get("testId");

//   const [questions, setQuestions] = useState<Question[]>([
//     {
//       id: uuidv4(),
//       questionText: "",
//       options: ["", "", "", ""],
//       correctOption: null,
//     },
//   ]);
//   const [globalError, setGlobalError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!testType || !testId) {
//       router.push("/dashboard");
//     }
//   }, [testType, testId, router]);

//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         id: uuidv4(),
//         questionText: "",
//         options: ["", "", "", ""],
//         correctOption: null,
//       },
//     ]);
//   };

//   const removeQuestion = (id: string) => {
//     if (questions.length <= 1) {
//       setGlobalError("At least one question is required.");
//       return;
//     }
//     setQuestions(questions.filter((question) => question.id !== id));
//     setGlobalError("");
//   };

//   const updateQuestionText = (id: string, value: string) => {
//     setQuestions(
//       questions.map((question) =>
//         question.id === id ? { ...question, questionText: value, error: "" } : question
//       )
//     );
//   };

//   const updateOption = (questionId: string, optionIndex: number, value: string) => {
//     setQuestions(
//       questions.map((question) =>
//         question.id === questionId
//           ? {
//               ...question,
//               options: question.options.map((opt, idx) =>
//                 idx === optionIndex ? value : opt
//               ),
//               error: "",
//             }
//           : question
//       )
//     );
//   };

//   const addOptionField = (questionId: string) => {
//     setQuestions(
//       questions.map((question) =>
//         question.id === questionId
//           ? { ...question, options: [...question.options, ""], error: "" }
//           : question
//       )
//     );
//   };

//   const removeOptionField = (questionId: string, optionIndex: number) => {
//     setQuestions(
//       questions.map((question) => {
//         if (question.id !== questionId) return question;
//         if (question.options.length <= 2) {
//           return { ...question, error: "At least 2 options are required." };
//         }
//         const newOptions = [...question.options];
//         newOptions.splice(optionIndex, 1);
//         let newCorrectOption = question.correctOption;
//         if (newCorrectOption !== null) {
//           if (newCorrectOption === optionIndex) {
//             newCorrectOption = null;
//           } else if (newCorrectOption > optionIndex) {
//             newCorrectOption -= 1;
//           }
//         }
//         return { ...question, options: newOptions, correctOption: newCorrectOption, error: "" };
//       })
//     );
//   };

//   const setCorrectOption = (questionId: string, value: number) => {
//     setQuestions(
//       questions.map((question) =>
//         question.id === questionId
//           ? { ...question, correctOption: value, error: "" }
//           : question
//       )
//     );
//   };

//   const validateQuestions = () => {
//     let isValid = true;
//     const updatedQuestions = questions.map((question) => {
//       if (!question.questionText.trim()) {
//         isValid = false;
//         return { ...question, error: "Question text is required." };
//       }
//       if (question.options.some((option) => !option.trim())) {
//         isValid = false;
//         return { ...question, error: "All options must have content." };
//       }
//       if (question.correctOption === null) {
//         isValid = false;
//         return { ...question, error: "Please select the correct option." };
//       }
//       return { ...question, error: "" };
//     });
//     setQuestions(updatedQuestions);
//     return isValid;
//   };

//   const handleCreateQuestions = async () => {
//     try {
//       setGlobalError("");
//       setLoading(true);

//       if (!validateQuestions()) {
//         setGlobalError("Please fix errors in the questions before submitting.");
//         return;
//       }

//       const payload = {
//         questions: questions.map((question) => ({
//           testType,
//           test: testId,
//           questionText: question.questionText,
//           options: question.options,
//           correctOption: question.correctOption,
//         })),
//       };

//       const response = await api.post("/questions", payload);

//       router.push(`/questions/${testType}/${testId}`);
//     } catch (error: any) {
//       console.error("Create questions failed:", error);
//       setGlobalError(
//         error.response?.data?.message || "Failed to create questions. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc]">
//       <Header title="Create Questions" showBackButton />

//       <main className="container mx-auto px-4 py-8">
//         <Card className="max-w-2xl mx-auto">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-[#1f2937]">
//               Create New Questions
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-8">
//               {questions.map((question, questionIndex) => (
//                 <div key={question.id} className="space-y-6 border-b pb-6 last:border-b-0">
//                   <div className="flex justify-between items-center">
//                     <Label className="text-lg font-semibold">
//                       Question {questionIndex + 1}
//                     </Label>
//                     {questions.length > 1 && (
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => removeQuestion(question.id)}
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor={`questionText-${question.id}`}>Question Text</Label>
//                     <Input
//                       id={`questionText-${question.id}`}
//                       placeholder="e.g. What is 2+2?"
//                       value={question.questionText}
//                       onChange={(e) => updateQuestionText(question.id, e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <Label>Options</Label>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => addOptionField(question.id)}
//                       >
//                         <Plus className="h-4 w-4 mr-2" />
//                         Add Option
//                       </Button>
//                     </div>

//                     <RadioGroup
//                       value={
//                         question.correctOption !== null
//                           ? question.correctOption.toString()
//                           : undefined
//                       }
//                       onValueChange={(value) =>
//                         setCorrectOption(question.id, Number.parseInt(value))
//                       }
//                     >
//                       {question.options.map((option, optionIndex) => (
//                         <div key={optionIndex} className="flex items-center space-x-2 mb-2">
//                           <RadioGroupItem
//                             value={optionIndex.toString()}
//                             id={`option-${question.id}-${optionIndex}`}
//                           />
//                           <div className="flex-1">
//                             <Input
//                               placeholder={`Option ${optionIndex + 1}`}
//                               value={option}
//                               onChange={(e) =>
//                                 updateOption(question.id, optionIndex, e.target.value)
//                               }
//                             />
//                           </div>
//                           {question.options.length > 2 && (
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => removeOptionField(question.id, optionIndex)}
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           )}
//                         </div>
//                       ))}
//                     </RadioGroup>
//                     <p className="text-xs text-[#6b7280]">
//                       Select the radio button next to the correct answer
//                     </p>
//                   </div>

//                   {question.error && (
//                     <p className="text-red-500 text-sm">{question.error}</p>
//                   )}
//                 </div>
//               ))}

//               <div className="flex justify-end">
//                 <Button type="button" variant="outline" onClick={addQuestion}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Another Question
//                 </Button>
//               </div>

//               {globalError && <p className="text-red-500 text-sm">{globalError}</p>}

//               <div className="flex space-x-4 pt-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => router.push(`/questions/${testType}/${testId}`)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   className="bg-[#3b82f6] hover:bg-[#2563eb]"
//                   onClick={handleCreateQuestions}
//                   disabled={loading}
//                 >
//                   {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//                   Create Questions
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, X, Plus, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import Header from "@/components/header";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

interface Option {
  text: string;
  image?: File | string | null;
  imagePreview?: string;
}

interface Question {
  id: string;
  questionText: string;
  questionImage?: File | string | null;
  questionImagePreview?: string;
  options: Option[];
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
      questionImage: null,
      questionImagePreview: "",
      options: [
        { text: "", image: null, imagePreview: "" },
        { text: "", image: null, imagePreview: "" },
        { text: "", image: null, imagePreview: "" },
        { text: "", image: null, imagePreview: "" },
      ],
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

  // File upload helper function
  const handleFileUpload = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: uuidv4(),
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

  const updateQuestionImage = (id: string, file: File | null) => {
    setQuestions(
      questions.map((question) =>
        question.id === id
          ? {
              ...question,
              questionImage: file,
              questionImagePreview: file ? handleFileUpload(file) : "",
              error: "",
            }
          : question
      )
    );
  };

  const removeQuestionImage = (id: string) => {
    setQuestions(
      questions.map((question) =>
        question.id === id
          ? {
              ...question,
              questionImage: null,
              questionImagePreview: "",
            }
          : question
      )
    );
  };

  const updateOptionText = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((opt, idx) =>
                idx === optionIndex ? { ...opt, text: value } : opt
              ),
              error: "",
            }
          : question
      )
    );
  };

  const updateOptionImage = (questionId: string, optionIndex: number, file: File | null) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((opt, idx) =>
                idx === optionIndex
                  ? {
                      ...opt,
                      image: file,
                      imagePreview: file ? handleFileUpload(file) : "",
                    }
                  : opt
              ),
              error: "",
            }
          : question
      )
    );
  };

  const removeOptionImage = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((opt, idx) =>
                idx === optionIndex
                  ? { ...opt, image: null, imagePreview: "" }
                  : opt
              ),
            }
          : question
      )
    );
  };

  const addOptionField = (questionId: string) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [
                ...question.options,
                { text: "", image: null, imagePreview: "" },
              ],
              error: "",
            }
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
        return {
          ...question,
          options: newOptions,
          correctOption: newCorrectOption,
          error: "",
        };
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
      if (question.options.some((option) => !option.text.trim() && !option.image)) {
        isValid = false;
        return { ...question, error: "All options must have either text or an image." };
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

  // Helper function to upload file to backend or convert to base64
  const uploadFileToBackend = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.fileUrl; // Assuming backend returns file URL
    } catch (error) {
      // Fallback to base64 if upload fails
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleCreateQuestions = async () => {
    try {
      setGlobalError("");
      setLoading(true);

      if (!validateQuestions()) {
        setGlobalError("Please fix errors in the questions before submitting.");
        return;
      }

      // Process questions and upload files
      const processedQuestions = await Promise.all(
        questions.map(async (question) => {
          let questionImageUrl = null;
          if (question.questionImage && question.questionImage instanceof File) {
            questionImageUrl = await uploadFileToBackend(question.questionImage);
          }

          const processedOptions = await Promise.all(
            question.options.map(async (option) => {
              let optionImageUrl = null;
              if (option.image && option.image instanceof File) {
                optionImageUrl = await uploadFileToBackend(option.image);
              }
              return {
                text: option.text,
                image: optionImageUrl,
              };
            })
          );

          return {
            testType,
            test: testId,
            questionText: question.questionText,
            questionImage: questionImageUrl,
            options: processedOptions,
            correctOption: question.correctOption,
          };
        })
      );

      const payload = {
        questions: processedQuestions,
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
        <Card className="max-w-4xl mx-auto">
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

                  {/* Question Text */}
                  <div className="space-y-2">
                    <Label htmlFor={`questionText-${question.id}`}>Question Text</Label>
                    <Input
                      id={`questionText-${question.id}`}
                      placeholder="e.g. What is the capital of India?"
                      value={question.questionText}
                      onChange={(e) => updateQuestionText(question.id, e.target.value)}
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
                          updateQuestionImage(question.id, file || null);
                        }}
                        className="hidden"
                        id={`question-image-${question.id}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          document.getElementById(`question-image-${question.id}`)?.click();
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                      {question.questionImagePreview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestionImage(question.id)}
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
                        <div key={optionIndex} className="space-y-3 p-4 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={optionIndex.toString()}
                              id={`option-${question.id}-${optionIndex}`}
                            />
                            <Label
                              htmlFor={`option-${question.id}-${optionIndex}`}
                              className="font-medium"
                            >
                              Option {optionIndex + 1}
                            </Label>
                            {question.options.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOptionField(question.id, optionIndex)}
                                className="ml-auto"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {/* Option Text */}
                          <Input
                            placeholder={`Enter option ${optionIndex + 1} text`}
                            value={option.text}
                            onChange={(e) =>
                              updateOptionText(question.id, optionIndex, e.target.value)
                            }
                          />

                          {/* Option Image Upload */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  updateOptionImage(question.id, optionIndex, file || null);
                                }}
                                className="hidden"
                                id={`option-image-${question.id}-${optionIndex}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  document
                                    .getElementById(`option-image-${question.id}-${optionIndex}`)
                                    ?.click();
                                }}
                              >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Add Image
                              </Button>
                              {option.imagePreview && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOptionImage(question.id, optionIndex)}
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
