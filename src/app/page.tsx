'use client';

import React from 'react'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { motion, useScroll, useTransform } from "framer-motion"
import { FileText, Shield, Zap, Users, CheckCircle, ArrowRight, Menu } from 'lucide-react'
// import Image from 'next/image'
import Link from 'next/link'

const Home = () => {
  const [email, setEmail] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { icon: <FileText className="h-6 w-6" />, title: "Easy FIR Creation", description: "Create detailed FIRs with our intuitive interface" },
    { icon: <Shield className="h-6 w-6" />, title: "Secure & Compliant", description: "Bank-level security ensures your data is always protected" },
    { icon: <Zap className="h-6 w-6" />, title: "AI-Powered Insights", description: "Get intelligent suggestions for legal sections" },
    { icon: <Users className="h-6 w-6" />, title: "Collaborative Platform", description: "Seamlessly work with your team on cases" },
  ]

  const testimonials = [
    { name: "John Doe", role: "Police Inspector", quote: "LawScribe has revolutionized our FIR process. It's faster and more accurate than ever." },
    { name: "Jane Smith", role: "Legal Consultant", quote: "The AI suggestions are incredibly helpful. It's like having a legal expert by your side." },
    { name: "Mike Johnson", role: "Station Head", quote: "The analytics feature gives us valuable insights into crime patterns. A game-changer!" },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const NavLinks = () => (
    <>
      <Link href="#features" className="text-gray-700 hover:text-[#8B0000]">Features</Link>
      <Link href="#how-it-works" className="text-gray-700 hover:text-[#8B0000]">How It Works</Link>
      <Link href="#testimonials" className="text-gray-700 hover:text-[#8B0000]">Testimonials</Link>
      <Link href="#faq" className="text-gray-700 hover:text-[#8B0000]">FAQ</Link>
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#8B0000]">LawScribe</Link>
          <div className="hidden md:flex space-x-6">
            <NavLinks />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-40 overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity }}
        >
          {/* <Image 
            src="/placeholder.svg?height=1080&width=1920" 
            alt="Law background" 
            layout="fill" 
            objectFit="cover" 
            className="opacity-20"
          /> */}
        </motion.div>
        <div className="container mx-auto px-4 pt-20 text-center relative z-10">
          <motion.h1 
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#8B0000] to-[#000080]"
            {...fadeInUp}
          >
            LawScribe: Revolutionizing FIR Management
          </motion.h1>
          <motion.p 
            className="text-xl mb-8 text-gray-600"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Streamline your FIR process with AI-powered insights and seamless collaboration
          </motion.p>
          <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Link href={'/dashboard'}>
            <Button className="bg-[#8B0000] hover:bg-[#6B0000] text-white px-8 py-6 text-lg rounded-full">
             
              Get Started
              
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            </Link>
          </motion.div>
        </div>
        <motion.div 
          className="mt-12 max-w-3xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#000080]">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-[#8B0000] p-3 rounded-full text-white mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* USP Section */}
      <section className="bg-[#000080] text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LawScribe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <CheckCircle className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">99.9% Accuracy</h3>
              <p>Our AI-powered system ensures highly accurate FIR creation</p>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">50% Time Saved</h3>
              <p>Streamlined processes cut FIR creation time in half</p>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <CheckCircle className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p>Our dedicated team is always ready to assist you</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#000080]">How It Works</h2>
        <Tabs defaultValue="create" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create FIR</TabsTrigger>
            <TabsTrigger value="review">Review & Submit</TabsTrigger>
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Easy FIR Creation</h3>
                <p>Our intuitive interface guides you through the FIR creation process. Input incident details, and our AI suggests relevant legal sections.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="review" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Thorough Review Process</h3>
                <p>Review AI-suggested legal sections, make necessary modifications, and digitally sign the FIR before submission.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analyze" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Insightful Analytics</h3>
                <p>Gain valuable insights into crime patterns, FIR statuses, and officer performance through our comprehensive analytics dashboard.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#000080]">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <p className="italic mb-4 flex-grow">{testimonial.quote}</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#000080]">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="max-w-2xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is LawScribe secure?</AccordionTrigger>
            <AccordionContent>
              Yes, LawScribe uses bank-level encryption to ensure all your data is secure and protected.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I integrate LawScribe with existing systems?</AccordionTrigger>
            <AccordionContent>
              LawScribe offers API integration options to seamlessly connect with your current systems.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How accurate are the AI suggestions?</AccordionTrigger>
            <AccordionContent>
              Our AI model is trained on vast legal databases and achieves a 99.9% accuracy rate in suggesting relevant legal sections.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA Footer */}
      <section className="bg-[#8B0000] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your FIR Process?</h2>
          <p className="text-xl mb-8">Join thousands of law enforcement professionals using LawScribe</p>
          <div className="flex justify-center items-center space-x-4">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-xs bg-white text-black"
            />
            <Button className="bg-white text-[#8B0000] hover:bg-gray-100">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LawScribe</h3>
              <p className="text-sm">Revolutionizing FIR management with AI-powered insights and seamless collaboration.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm hover:text-gray-300">Features</Link></li>
                <li><Link href="#how-it-works" className="text-sm hover:text-gray-300">How It Works</Link></li>
                <li><Link href="#testimonials" className="text-sm hover:text-gray-300">Testimonials</Link></li>
                <li><Link href="#faq" className="text-sm hover:text-gray-300">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy-policy" className="text-sm hover:text-gray-300">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-sm hover:text-gray-300">Terms of Service</Link></li>
                <li><Link href="/cookie-policy" className="text-sm hover:text-gray-300">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} LawScribe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


export default Home