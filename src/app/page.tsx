import SmoothScroll from '@/components/SmoothScroll';
import ForestHero from '@/components/ForestHero';
import MeditationTimer from '@/components/MeditationTimer';
import Quote from '@/components/Quote';

export default function Home() {
  return (
    <SmoothScroll>
      <div className="noise bg-[#040704]">
        <ForestHero />
        <MeditationTimer />
        <Quote />
      </div>
    </SmoothScroll>
  );
}
