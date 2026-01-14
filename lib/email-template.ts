export function wrapWithBranding(content: string): string {
  const meetingMinuteUrl =
    'https://docs.google.com/document/d/1_fmXMlZSH6m3JvVkd30vJJxVdPdUzyeA3tFXf9MRPHk/edit?tab=t.t2soy69um8x2#heading=h.n4gtjvfjzmt4'
  return `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; color: #333;">
      <div class="meeting-content">
        ${content}
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${meetingMinuteUrl}" 
           style="background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
           View Full Meeting History
        </a>
      </div>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #70757a; text-align: center;">
        <p>This report was automatically generated and sent via <strong>MeetingSnap</strong>.</p>
        <p>© ${new Date().getFullYear()} MeetingSnap Team. All rights reserved.</p>
      </div>
    </div>
  `
}

export function cleanGoogleHtml(html: string, tabTitle: string): string {
  let cleaned = html

  // 1. Remove the Google Doc Title element
  // It looks for <p class="title"> ... TabTitle ... </p>
  const titleRegex = new RegExp(
    `<p[^>]*class=["\']title["\'][^>]*>\\s*<span[^>]*>\\s*${tabTitle}\\s*</span>\\s*</p>`,
    'gi',
  )
  cleaned = cleaned.replace(titleRegex, '')

  // 2. Fallback: If the span nesting is different, try a broader title match
  const broadTitleRegex = new RegExp(
    `<p[^>]*class=["\']title["\'][^>]*>\\s*${tabTitle}\\s*</p>`,
    'gi',
  )
  cleaned = cleaned.replace(broadTitleRegex, '')

  // 3. Strip structural HTML tags
  // We remove everything from <html> through <body> so only the core <div> or <table> remains.
  cleaned = cleaned.replace(
    /<html[^>]*>|<\/html>|<body[^>]*>|<\/body>|<head[^>]*>[\s\S]*?<\/head>|<!DOCTYPE[^>]*>/gi,
    '',
  )

  // 4. Clean up Google's default body styles that might bleed into the email
  // Google often adds 'padding: 72pt' which we don't want in a narrow email
  cleaned = cleaned.replace(/padding:\s*72pt\s*72pt\s*72pt\s*72pt/gi, 'padding: 0')

  return cleaned.trim()
}
