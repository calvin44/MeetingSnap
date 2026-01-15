import { ImageResponse } from 'next/og'

/**
 * Architectural Metadata:
 * Using 32x32 for standard tabs; Next.js handles the scaling.
 */
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

/**
 * GENERATED ICON ARCHITECTURE
 * This function turns your JSX into a physical PNG at build time.
 */
export default function Icon() {
  const brandColor = '#473ce2'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke={brandColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Lucide: presentation */}
          <path d="M2 3h20" />
          <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
          <path d="m7 21 5-5 5 5" />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  )
}
