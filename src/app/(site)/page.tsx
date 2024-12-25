import { HeroSection } from "./_components/HeroSection";
import { FeaturesSection } from "./_components/FeaturesSection";
import { PricingSection } from "./_components/PricingSection";
import { FaqSection } from "./_components/FaqSection";
import { CtaSection } from "./_components/CtaSection";

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<FeaturesSection />
			<PricingSection />
			<FaqSection />
			<CtaSection />
		</>
	);
}
