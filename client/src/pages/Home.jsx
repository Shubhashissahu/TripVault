import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '📍',
    title: 'Keep every destination',
    description: 'Save where you went and when, all together in your personal travel log.',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    icon: '✍️',
    title: 'Capture the little things',
    description: 'Add notes, highlights, and ratings while the moments are still fresh.',
    bg: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  {
    icon: '🔒',
    title: 'Your own private vault',
    description: 'Your trips stay connected to your account, ready whenever you want to revisit them.',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  },
];

export default function Home() {
  const { user } = useAuth();
  const primaryHref = user ? '/dashboard' : '/register';

  return (
    <div className="overflow-hidden bg-[#f8fbfa] text-[#102a43]">
      {/* Hero Section */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold tracking-widest text-teal-800 uppercase backdrop-blur-sm">
            <span aria-hidden="true" className="text-amber-500">✦</span> YOUR JOURNEYS, KEPT FOREVER
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.08]">
            The best trips
            <br />
            <span className="text-teal-700">deserve a place</span>
            <br />
            in your story.
          </h1>

          <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-slate-600">
            TripVault makes it easy to save the places you have been, the moments you loved, and the memories you never want to lose.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to={primaryHref}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-teal-700 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-700/25 transition hover:bg-teal-800 hover:-translate-y-0.5"
            >
              <span>{user ? 'Open my vault' : 'Start your travel vault'}</span>
              <span aria-hidden="true" className="text-lg">→</span>
            </Link>

            <a href="#features" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 transition">
              Discover more
            </a>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800" aria-hidden="true">
              ✓
            </span>
            <span>A secure, private space for all your big adventures</span>
          </div>
        </div>

        {/* Hero Visual Card / Illustration */}
        <div
          className="relative mx-auto flex min-h-[380px] w-full max-w-lg items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-200 p-6 shadow-2xl shadow-teal-900/10"
          aria-label="A preview of a saved trip to Kyoto"
        >
          {/* Subtle Decorative Backdrop Elements */}
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-amber-100/60 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-teal-200/50 blur-2xl" />

          {/* Floating Travel Postcard */}
          <div className="relative z-10 w-full max-w-[320px] -rotate-3 rounded-2xl border border-white/90 bg-white/95 p-5 shadow-2xl shadow-slate-900/20 backdrop-blur-md transition duration-300 hover:rotate-0">
            <div className="flex items-center justify-between text-xs font-bold tracking-widest text-teal-800">
              <span>TRIP MEMORY</span>
              <span aria-hidden="true">↗</span>
            </div>

            <div className="mt-3 font-serif text-3xl font-bold tracking-tight text-slate-900">
              Kyoto
            </div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
              JAPAN · SPRING ESCAPE
            </div>

            <div className="my-4 h-px bg-slate-100" />

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>One for the memory book</span>
              <span className="font-medium tracking-widest text-amber-500" aria-label="5 out of 5 stars">
                ★★★★★
              </span>
            </div>
          </div>

          {/* Floating Stamps */}
          <div
            className="absolute left-6 top-8 z-20 flex h-12 w-12 -rotate-12 items-center justify-center rounded-2xl border border-white/80 bg-white text-xl shadow-lg shadow-teal-900/10"
            aria-hidden="true"
          >
            ✈️
          </div>
          <div
            className="absolute right-8 bottom-8 z-20 flex h-12 w-12 rotate-12 items-center justify-center rounded-2xl border border-white/80 bg-white text-xl shadow-lg shadow-teal-900/10"
            aria-hidden="true"
          >
            📍
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-slate-200/70 bg-white/60 py-16 sm:py-24" id="features">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
              MADE FOR YOUR MEMORIES
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Every journey has a story.
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Keep all the details together, from the first plan to the best part.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 sm:gap-8">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl ${feature.bg}`}
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-teal-200/60 bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 p-8 sm:p-12 md:flex-row shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
              YOUR NEXT CHAPTER STARTS HERE
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Ready to keep your travels close?
            </h2>
          </div>
          <Link
            to={primaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-base font-bold text-white shadow-md shadow-teal-700/20 transition hover:bg-teal-800 shrink-0"
          >
            <span>{user ? 'Go to my trips' : 'Create your free account'}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
