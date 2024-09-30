"use client";

import { LayoutComponent } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const firStatusData = [
    { name: 'New', value: 40 },
    { name: 'In Progress', value: 50 },
    { name: 'Completed', value: 30 },
    { name: 'Under Review', value: 15 },
  ];
  

  const officerPerformanceData = [
    { name: 'Inspector Rajesh Kumar', firsHandled: 25, avgTimePerFIR: 2.5 },
    { name: 'Sub-Inspector Priya Verma', firsHandled: 20, avgTimePerFIR: 3.0 },
    { name: 'Inspector Mohit Sharma', firsHandled: 30, avgTimePerFIR: 2.1 },
    { name: 'Head Constable Anil Singh', firsHandled: 18, avgTimePerFIR: 2.9 },
  ];
  

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Analytics() {
  return (
    <LayoutComponent>
      <h1 className="text-3xl font-bold text-[#8B0000] mb-8 text-center">FIR Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#000080]">FIR Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={firStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {firStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#000080]">Officer Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={officerPerformanceData}>
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" stroke="#8884d8" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="firsHandled" fill="#8884d8" name="FIRs Handled" />
                <Bar yAxisId="left" dataKey="avgTimePerFIR" fill="#82ca9d" name="Avg Time per FIR (hours)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#000080]">FIR Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Total FIRs</TableCell>
                <TableCell>100</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>FIRs This Month</TableCell>
                <TableCell>25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Time to Close</TableCell>
                <TableCell>3.5 days</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Most Common Crime Type</TableCell>
                <TableCell>Theft</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button className="bg-[#8B0000] hover:bg-[#6B0000]">
          Export Report
        </Button>
      </div>
    </LayoutComponent>
  );
}
