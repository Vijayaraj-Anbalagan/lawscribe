'use client'

import React from 'react'
import {LayoutComponent}  from '@/components/layout';
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pen } from 'lucide-react'
import { useRouter } from 'next/navigation'

const firData = {
    incidentDescription: "A robbery took place at Gwalior Mall, where the suspect snatched a woman's purse containing Rs. 50,000 cash and fled the scene.",
    location: "Gwalior Mall, Madhya Pradesh",
    dateTime: "2023-07-15T14:30:00",
    officerName: "Inspector Rajesh Kumar",
    legalSections: [
      { section: "Section 392", description: "Punishment for robbery", act: "Indian Penal Code" },
      { section: "Section 380", description: "Theft in dwelling house, etc.", act: "Indian Penal Code" },
    ]
  }
  
const FirReview = () => {
  const [signature, setSignature] = useState("")
  const router = useRouter()

  const handleEdit = (section: string) => {
    console.log(`Editing ${section}`)
    // Here you would typically open a modal or navigate to an edit page
  }

  const handleSubmit = () => {
    if (!signature) {
      alert("Please provide your digital signature before submitting.")
      return
    }
    console.log("Submitting FIR", { ...firData, signature })
    // Here you would typically send the FIR data to your backend
    // For demonstration, we'll just redirect to the dashboard
    router.push('/dashboard')
  }

  return (
    <LayoutComponent>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#8B0000]">Review and Submit FIR</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] mb-6">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-[#000080] flex items-center justify-between">
                  Incident Description
                  <Button onClick={() => handleEdit('description')} variant="ghost" size="sm">
                    <Pen className="h-4 w-4" />
                  </Button>
                </h3>
                <p className="mt-2">{firData.incidentDescription}</p>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-[#000080] flex items-center justify-between">
                  Location
                  <Button onClick={() => handleEdit('location')} variant="ghost" size="sm">
                    <Pen className="h-4 w-4" />
                  </Button>
                </h3>
                <p className="mt-2">{firData.location}</p>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-[#000080] flex items-center justify-between">
                  Date and Time
                  <Button onClick={() => handleEdit('dateTime')} variant="ghost" size="sm">
                    <Pen className="h-4 w-4" />
                  </Button>
                </h3>
                <p className="mt-2">{new Date(firData.dateTime).toLocaleString()}</p>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-[#000080]">Officer Name</h3>
                <p className="mt-2">{firData.officerName}</p>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-[#000080] mb-2">Legal Sections</h3>
                {firData.legalSections.map((section, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-[#8B0000]">{section.section}</h4>
                    <p>{section.description}</p>
                    <p className="text-sm text-gray-600">{section.act}</p>
                  </div>
                ))}
              </section>
            </div>
          </ScrollArea>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#000080] mb-2">Digital Signature</h3>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Type your full name as your digital signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full bg-[#8B0000] hover:bg-[#6B0000]">
            Submit FIR
          </Button>
        </CardContent>
      </Card>
    </LayoutComponent>
  )
}


export default FirReview