import Header from '../components/Header'
import Hero from '../components/Hero'
import Testimonial from '../components/Testimonial'
import TonePlayground from '../components/TonePlayground'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Pricing from '../components/Pricing'
import CommunityBlog from '../components/CommunityBlog'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-sand-50">
      <Header />
      <main>
        <Hero />
        <TonePlayground />
        <Testimonial />
        <HowItWorks />
        <Features />
        <Pricing />
        <CommunityBlog />
      </main>
      <Footer />
    </div>
  )
}
