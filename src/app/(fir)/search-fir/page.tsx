'use client';

import { LayoutComponent } from '@/components/layout';
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

const initialFIRs = [
  { id: 'FIR001', title: 'Theft at Main Street', date: '2023-06-10', section: '379 IPC', crimeType: 'Theft', location: 'Main Street' },
  { id: 'FIR002', title: 'Assault in Central Park', date: '2023-06-12', section: '323 IPC', crimeType: 'Assault', location: 'Central Park' },
  { id: 'FIR003', title: 'Vandalism at City Hall', date: '2023-06-14', section: '427 IPC', crimeType: 'Vandalism', location: 'City Hall' },
  { id: 'FIR004', title: 'Robbery on Elm Street', date: '2023-06-15', section: '392 IPC', crimeType: 'Robbery', location: 'Elm Street' },
]

export default function SearchFIR() {
  const [searchResults, setSearchResults] = useState(initialFIRs)
  const [filters, setFilters] = useState({
    date: '',
    section: '',
    crimeType: '',
    location: '',
  })

  const handleSearch = () => {
    const results = initialFIRs.filter(fir => 
      (!filters.date || fir.date.includes(filters.date)) &&
      (!filters.section || fir.section.includes(filters.section)) &&
      (!filters.crimeType || fir.crimeType.includes(filters.crimeType)) &&
      (!filters.location || fir.location.includes(filters.location))
    )
    setSearchResults(results)
  }

  const handleClearFilters = () => {
    setFilters({
      date: '',
      section: '',
      crimeType: '',
      location: '',
    })
    setSearchResults(initialFIRs)
  }

  return (
    <LayoutComponent>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#8B0000]">Search FIRs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              placeholder="Search by Date"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
            />
            <Input
              placeholder="Search by Legal Section"
              value={filters.section}
              onChange={(e) => setFilters({...filters, section: e.target.value})}
            />
            <Select onValueChange={(value) => setFilters({...filters, crimeType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Crime Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Theft">Theft</SelectItem>
                <SelectItem value="Assault">Assault</SelectItem>
                <SelectItem value="Vandalism">Vandalism</SelectItem>
                <SelectItem value="Robbery">Robbery</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search by Location"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>
          <div className="flex justify-between mb-6">
            <Button onClick={handleSearch} className="bg-[#8B0000] hover:bg-[#6B0000]">
              Search
            </Button>
            <Button onClick={handleClearFilters} className="bg-[#000080] hover:bg-[#000060]">
              Clear Filters
            </Button>
          </div>
          <ScrollArea className="h-[50vh]">
            {searchResults.map((fir) => (
              <Card key={fir.id} className="mb-4 shadow-md">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-[#000080]">{fir.title}</h3>
                  <p className="text-sm text-gray-600">Date: {fir.date}</p>
                  <p className="text-sm text-gray-600">Section: {fir.section}</p>
                  <p className="text-sm text-gray-600">Crime Type: {fir.crimeType}</p>
                  <p className="text-sm text-gray-600">Location: {fir.location}</p>
                  <Button className="mt-2 bg-[#000080] hover:bg-[#000060]">
                    View FIR
                  </Button>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </LayoutComponent>
  )
}