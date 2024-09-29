'use client'

import { LayoutComponent } from '@/components/layout';
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from 'next/router'

const initialSuggestions = [
  { id: 1, section: "Section 302", description: "Punishment for murder", act: "Indian Penal Code" },
  { id: 2, section: "Section 376", description: "Punishment for rape", act: "Indian Penal Code" },
  { id: 3, section: "Section 420", description: "Cheating and dishonestly inducing delivery of property", act: "Indian Penal Code" },
]

export function AiSuggestions() {
  const [suggestions, setSuggestions] = useState(initialSuggestions)
  const [modificationReason, setModificationReason] = useState("")
  const [modifyingId, setModifyingId] = useState<number | null>(null)
  const router = useRouter()

  const handleApprove = (id: number) => {
    setSuggestions(suggestions.filter(suggestion => suggestion.id !== id))
  }

  const handleModify = (id: number) => {
    setModifyingId(id)
  }

  const handleSubmitModification = (id: number) => {
    // Here you would typically send the modification to your backend
    console.log(`Modifying section ${id} with reason: ${modificationReason}`)
    setModifyingId(null)
    setModificationReason("")
  }

  const handleProceed = () => {
    // Here you would typically save the final suggestions
    console.log("Final suggestions:", suggestions)
    router.push('/fir-review')
  }

  return (
    <LayoutComponent>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#8B0000]">AI-Suggested Legal Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="mb-4 shadow-md">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-[#000080]">{suggestion.section}</h3>
                  <p className="text-gray-600">{suggestion.description}</p>
                  <p className="text-sm text-[#8B0000] mt-1">{suggestion.act}</p>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button onClick={() => handleApprove(suggestion.id)} className="bg-[#8B0000] hover:bg-[#6B0000]">
                      Approve
                    </Button>
                    <Button onClick={() => handleModify(suggestion.id)} className="bg-[#000080] hover:bg-[#000060]">
                      Modify
                    </Button>
                  </div>
                  {modifyingId === suggestion.id && (
                    <div className="mt-4">
                      <Textarea
                        placeholder="Reason for modification"
                        value={modificationReason}
                        onChange={(e) => setModificationReason(e.target.value)}
                        className="mb-2"
                      />
                      <Button onClick={() => handleSubmitModification(suggestion.id)} className="bg-[#8B0000] hover:bg-[#6B0000]">
                        Submit Modification
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          <div className="mt-6 text-center">
            <Button onClick={handleProceed} className="bg-[#8B0000] hover:bg-[#6B0000]">
              Proceed to Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </LayoutComponent>
  )
}