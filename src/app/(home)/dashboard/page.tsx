'use client';
import { LayoutComponent } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from 'next/link'
import { FileText, Search, BarChart2 } from 'lucide-react'
const recentFIRs = [
  { id: 'FIR001', title: 'Theft at Bhopal Railway Station', status: 'In Progress' },
  { id: 'FIR002', title: 'Assault near Indore Market', status: 'Completed' },
  { id: 'FIR003', title: 'Vandalism at Ujjain Temple', status: 'Under Review' },
  { id: 'FIR004', title: 'Robbery at Gwalior Mall', status: 'New' },
];
const firStatuses = [
  { id: 'FIR001', title: 'Theft at Bhopal Railway Station', status: 'In Progress', officer: 'Inspector Rajesh Kumar' },
  { id: 'FIR002', title: 'Assault near Indore Market', status: 'Completed', officer: 'Sub-Inspector Priya Verma' },
  { id: 'FIR003', title: 'Vandalism at Ujjain Temple', status: 'UnderReview', officer: 'Inspector Mohit Sharma' },
  { id: 'FIR004', title: 'Robbery at Gwalior Mall', status: 'New', officer: 'Head Constable Anil Singh' },
];

export default function Dashboard() {
  return (
    <LayoutComponent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#000080]">Recent FIRs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentFIRs.map((fir) => (
              <div key={fir.id} className="mb-4 p-4 border rounded-lg">
                <h3 className="font-semibold">{fir.title}</h3>
                <p className="text-sm text-gray-600">Status: {fir.status}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#000080]">FIR Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Officer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {firStatuses.map((fir) => (
                  <TableRow key={fir.id}>
                    <TableCell>{fir.id}</TableCell>
                    <TableCell>{fir.title}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        fir.status === 'Completed' ? 'bg-green-200 text-green-800' :
                        fir.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' :
                        fir.status === 'Under Review' ? 'bg-blue-200 text-blue-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {fir.status}
                      </span>
                    </TableCell>
                    <TableCell>{fir.officer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-4">
        <Link href="/create-fir">
          <Button className="w-full h-24 text-lg bg-[#8B0000] hover:bg-[#6B0000]">
            <FileText className="mr-2 h-6 w-6" /> Create New FIR
          </Button>
        </Link>
        <Link href="/search-fir">
          <Button className="w-full h-24 text-lg bg-[#000080] hover:bg-[#000060]">
            <Search className="mr-2 h-6 w-6" /> Search FIRs
          </Button>
        </Link>
        <Link href="/analytics">
          <Button className="w-full h-24 text-lg bg-[#8B0000] hover:bg-[#6B0000]">
            <BarChart2 className="mr-2 h-6 w-6" /> View Analytics
          </Button>
        </Link>
      </div>
    </LayoutComponent>
  )
}