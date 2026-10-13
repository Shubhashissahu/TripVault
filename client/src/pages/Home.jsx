import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '📍',
    title: 'Keep every destination',
    description: 'Save where you went and when, all together in your personal travel log.',
  },
  {
    icon: '✍️',
    title: 'Capture the little things',
    description: 'Add notes, highlights, and ratings while the moments are still fresh.',
  },
  {
    icon: '🔒',
    title: 'Your own private vault',
    description: 'Your trips stay connected to your account, ready whenever you want to revisit them.',
  },
];

export default function Home() {
  const { user } = useAuth();
  const primaryHref = user ? '/dashboard' : '/register';

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="hero-eyebrow">
            <span aria-hidden="true">✦</span> YOUR JOURNEYS, KEPT FOREVER
          </span>
          <h1>
            The best trips
            <br />
            <span>deserve a place</span>
            <br />
            in your story.
          </h1>
          <p className="hero-description">
            TripVault makes it easy to save the places you have been, the
            moments you loved, and the memories you never want to lose.
          </p>
          <div className="hero-actions">
            <Link to={primaryHref} className="hero-primary-cta">
              {user ? 'Open my vault' : 'Start your travel vault'}
              <span aria-hidden="true">→</span>
            </Link>
            <a href="#features" className="hero-text-link">
              Discover more
            </a>
          </div>
          <div className="hero-note">
            <span className="hero-note-icon" aria-hidden="true">✓</span>
            A little space for all your big adventures
          </div>
        </div>

        <div className="hero-art" aria-label="A preview of a saved trip to Kyoto">
          <div className="art-orbit art-orbit-one" />
          <div className="art-orbit art-orbit-two" />
          <div className="art-sun" />
          <div className="art-mountain art-mountain-back" />
          <div className="art-mountain art-mountain-front" />
          <div className="art-water" />
          <div className="art-postcard">
            <div className="postcard-topline">
              <span className="postcard-label">TRIP MEMORY</span>
              <span aria-hidden="true">↗</span>
            </div>
            <div className="postcard-place">Kyoto</div>
            <div className="postcard-country">JAPAN · SPRING ESCAPE</div>
            <div className="postcard-divider" />
            <div className="postcard-bottom">
              <span>One for the memory book</span>
              <span className="postcard-stars" aria-label="5 out of 5 stars">★★★★★</span>
            </div>
          </div>
          <div className="floating-stamp" aria-hidden="true">✈</div>
          <div className="floating-pin" aria-hidden="true">⌖</div>
        </div>
      </section>

      <section className="home-features" id="features">
        <div className="features-heading">
          <span className="section-eyebrow">MADE FOR YOUR MEMORIES</span>
          <h2>Every journey has a story.</h2>
          <p>Keep all the details together, from the first plan to the best part.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <span className={`feature-icon feature-icon-${index + 1}`} aria-hidden="true">
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-bottom-cta">
        <div>
          <span className="section-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>Ready to keep your travels close?</h2>
        </div>
        <Link to={primaryHref} className="hero-primary-cta">
          {user ? 'Go to my trips' : 'Create your free account'}
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
