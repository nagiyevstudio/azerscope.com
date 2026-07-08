import Hero from '../components/sections/Hero';
import Overview from '../components/sections/Overview';
import Forecast from '../components/sections/Forecast';
import Features from '../components/sections/Features';
import Screens from '../components/sections/Screens';
import Tools from '../components/sections/Tools';
import Access from '../components/sections/Access';
import Trust from '../components/sections/Trust';
import Partners from '../components/sections/Partners';
import CTA from '../components/sections/CTA';

const Home = () => (
  <div className="home-page">
    <Hero />
    <Overview />
    <Forecast />
    <Features />
    <Screens />
    <Tools />
    <Access />
    <Trust />
    <Partners />
    <CTA />
  </div>
);

export default Home;
