import Header from '../components/Header'
import Hero from '../components/Hero'
import Testimonial from '../components/Testimonial'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Pricing from '../components/Pricing'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-sand-50">
      <Header />
      <main>
        <Hero />
        <Testimonial />
        <HowItWorks />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}