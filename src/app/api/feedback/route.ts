import { NextResponse } from 'next/server'


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

    const requestUrl = new URL(request.url)
    const referer = request.headers.get('referer') || requestUrl.origin

    // 2. Submit data to FormSubmit AJAX endpoint
    // FormSubmit does not require API keys, making it a perfect zero-config solution.
    // We explicitly supply Referer, User-Agent, and _url to prevent FormSubmit from blocking
    // the serverless backend fetch request with "pages browsed as HTML files" errors.
    const response = await fetch('https://formsubmit.co/ajax/harukiwaves@zohomail.in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': referer,
        'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: `Feedback from CSS Frosting website:\n\nSender: ${name} (${email})\nSource: ${pageSource || 'Unknown'}\n\nMessage:\n${message}`,
        _subject: `[CSS Frosting Feedback] Message from ${name}`,
        _url: referer,
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
        message: 'Thank you! Your message has been sent.',
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('FormSubmit API error:', error)
    return NextResponse.json(
      { error: 'Failed to process feedback submission. Please try again later.' },
      { status: 500 }
    )
  }
}
