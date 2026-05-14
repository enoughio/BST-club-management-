"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
// import { useToast } from "@/hooks/use-toast"

export default function RsvpForm({ eventId }) {
  const router = useRouter()
  // const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ticketType: "general",
    dietaryRestrictions: "",
    marketingConsent: false,
    termsAccepted: false
  })
  
  // Error state
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ticketType: "",
    termsAccepted: ""
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
  }
  
  // Handle checkbox changes
  const handleCheckboxChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked
    })
    
    // Clear error when user checks the box
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
  }
  
  // Handle radio button changes
  const handleRadioChange = (value) => {
    setFormData({
      ...formData,
      ticketType: value
    })
    
    if (errors.ticketType) {
      setErrors({
        ...errors,
        ticketType: ""
      })
    }
  }
  
  // Validate form
  const validateForm = () => {
    let isValid = true
    const newErrors = {}
    
    // Validate first name
    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters."
      isValid = false
    }
    
    // Validate last name
    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters."
      isValid = false
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address."
      isValid = false
    }
    
    // Validate phone
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number."
      isValid = false
    }
    
    // Validate ticket type
    if (!["general", "vip", "student"].includes(formData.ticketType)) {
      newErrors.ticketType = "Please select a ticket type."
      isValid = false
    }
    
    // Validate terms acceptance
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions."
      isValid = false
    }
    
    setErrors(newErrors)
    return isValid
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        // toast({
        //   title: "Registration successful!",
        //   description: "Your ticket has been generated."
        // })
        
        // Redirect to ticket page
        router.push(`/events/${eventId}/ticket?email=${encodeURIComponent(formData.email)}`)
      }, 1500)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <Input 
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <Input 
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input 
            name="email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <Input 
            name="phone"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium mb-1">Ticket Type</label>
        <RadioGroup
          value={formData.ticketType}
          onValueChange={handleRadioChange}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="general" id="general" />
            <label htmlFor="general" className="font-normal text-sm">General Admission (₹500)</label>
          </div>
          <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="vip" id="vip" />
            <label htmlFor="vip" className="font-normal text-sm">VIP Experience (₹1,500)</label>
          </div>
          <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="student" id="student" />
            <label htmlFor="student" className="font-normal text-sm">Student (₹250)</label>
          </div>
        </RadioGroup>
        {errors.ticketType && (
          <p className="text-sm text-red-500 mt-1">{errors.ticketType}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Dietary Restrictions (Optional)</label>
        <Textarea
          name="dietaryRestrictions"
          placeholder="Please let us know if you have any dietary restrictions or allergies."
          className="resize-none"
          value={formData.dietaryRestrictions}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-row items-start space-x-3 space-y-0">
        <Checkbox 
          id="marketingConsent" 
          checked={formData.marketingConsent}
          onCheckedChange={(checked) => handleCheckboxChange("marketingConsent", checked)}
        />
        <div className="space-y-1 leading-none">
          <label htmlFor="marketingConsent" className="text-sm font-medium">
            I would like to receive updates about future events
          </label>
        </div>
      </div>

      <div className="flex flex-row items-start space-x-3 space-y-0">
        <Checkbox 
          id="termsAccepted" 
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", checked)}
        />
        <div className="space-y-1 leading-none">
          <label htmlFor="termsAccepted" className="text-sm font-medium">
            I agree to the terms and conditions
          </label>
          <p className="text-sm text-gray-500">
            By registering, you agree to our{" "}
            <a href="#" className="text-primary underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary underline">
              Privacy Policy
            </a>.
          </p>
          {errors.termsAccepted && (
            <p className="text-sm text-red-500">{errors.termsAccepted}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Register for Event"}
      </Button>
    </form>
  )
}
