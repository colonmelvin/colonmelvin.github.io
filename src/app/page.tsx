import SmoothScroll from '@/components/SmoothScroll';
import ForestHero from '@/components/ForestHero';
import MeditationTimer from '@/components/MeditationTimer';
import Quote from '@/components/Quote';
import BlobReveal from '@/components/BlobReveal';

export default function Home() {
  return (
    <SmoothScroll>
      <div className="noise bg-[#040704]">
        <BlobReveal />
        <ForestHero />
        <MeditationTimer />
        <Quote />
      </div>
    </SmoothScroll>
  );
}
