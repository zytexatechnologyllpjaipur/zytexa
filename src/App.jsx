import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import { Achievements, ClientStrip, Services, Process, WhyChoose, Industries, SingleRoof } from './components/Sections.jsx';
import Testimonials from './components/Testimonials.jsx';
import AIInnovation from './components/AIInnovation.jsx';
import { FaqSection, ContactSection } from './components/FaqContact.jsx';
import { Cta, Footer } from './components/CtaFooter.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Achievements />
        <ClientStrip />
        <Services />
        <Process />
        <WhyChoose />
        <Industries />
        <SingleRoof />
        <Testimonials />
        <AIInnovation />
        <FaqSection />
        <ContactSection />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
