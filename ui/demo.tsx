import { HeroSection } from "@/components/ui/hero-section-with-smooth-bg-shader"

export default function DemoOne() {
  return <HeroSection distortion={1.2} speed={0.8} />
}

/*
Usage examples:

// Basic usage with defaults
<HeroSection />

// Custom content
<HeroSection
  title="Revolutionary AI Solutions for"
  highlightText="Modern Business"
  description="Streamline operations with cutting-edge AI technology"
  buttonText="Get Started"
  onButtonClick={() => console.log("Button clicked!")}
/>

// Custom colors and animation
<HeroSection
  colors={["#ff6b6b", "#4ecdc4", "#45b7d1"]}
  distortion={1.2}
  speed={0.8}
/>
*/
