import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message, pageSource } = body

    // 1. Validate form fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // 2. Submit data to FormSubmit AJAX endpoint
    // FormSubmit does not require API keys, making it a perfect zero-config solution.
    const response = await fetch('https://formsubmit.co/ajax/harukiwaves@zohomail.in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: `Feedback from CSS Frosting website:\n\nSender: ${name} (${email})\nSource: ${pageSource || 'Unknown'}\n\nMessage:\n${message}`,
        _subject: `[CSS Frosting Feedback] Message from ${name}`,
      }),
    })

    const data = await response.json()

    // FormSubmit returns a "success" field as a string ("true" or "false")
    if (!response.ok || data.success === 'false') {
      console.error('FormSubmit error response:', data)
      return NextResponse.json(
        { error: data.message || 'Failed to submit feedback through FormSubmit.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        // The first email will prompt the user to activate their inbox
        message: 'Thank you! Your feedback has been sent. If this is your first submission, please check your inbox at harukiwaves@zohomail.in to confirm/activate FormSubmit.',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('FormSubmit API error:', error)
    return NextResponse.json(
      { error: 'Failed to process feedback submission. Please try again later.' },
      { status: 500 }
    )
  }
}
