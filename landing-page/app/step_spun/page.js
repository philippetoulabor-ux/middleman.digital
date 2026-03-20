'use client'

import dynamic from 'next/dynamic'
import { logoConfig } from '@/lib/landing-config'
import { getProjectBySlug } from '@/content/projects'
import ImageSlideshow from '@/components/ImageSlideshow'

const LogoViewer = dynamic(
  () => import('@/components/LogoViewer'),
  { ssr: false, loading: () => <div className="logo-placeholder" /> }
)

const stepSpunProject = getProjectBySlug('step_spun')
const images = stepSpunProject?.images ?? []

export default function StepSpunPage() {
  return (
    <div className="page-step-spun">
      <header>
        <LogoViewer config={{ ...logoConfig, href: '/', followMouse: true }} />
      </header>
      <main className="step-spun-main">
        <ImageSlideshow images={images} className="step-spun-slideshow" />
      </main>
    </div>
  )
}
