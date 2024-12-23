import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { PricingSection } from "./_components/pricing-section";
import { FaqSection } from "./_components/faq-section";
import { CtaSection } from "./_components/cta-section";

export default function HomePage() {
	return (
		<div>
			<HeroSection />
			<FeaturesSection />
			<PricingSection />
			<FaqSection />
			<CtaSection />
		</div>
	);
}
