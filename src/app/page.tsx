import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import ForestHero from '@/components/ForestHero';
import MeditationTimer from '@/components/MeditationTimer';
import Quote from '@/components/Quote';
import Facts from '@/components/Facts';
import ForestMarquee from '@/components/ForestMarquee';
import ForestFooter from '@/components/ForestFooter';

export default function Home() {
  return (
    <SmoothScroll>
      <div className="noise bg-[#040704]">
        <CustomCursor />
        <ForestHero />
        <MeditationTimer />
        <Quote />
        <Facts />
        <ForestMarquee />
        <ForestFooter />
      </div>
    </SmoothScroll>
  );
}
