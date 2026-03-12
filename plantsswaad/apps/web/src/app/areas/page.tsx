import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Delivery Areas in Bhagalpur | PlanetsSwaad Cloud Kitchen',
  description:
    'PlanetsSwaad delivers food to Nathnagar, Adampur, Barari, Sabour, Champanagar, TDC College area and all of Bhagalpur Bihar. Check your pincode and order now!',
  alternates: { canonical: 'https://planetsswaad.netlify.app/areas' },
  openGraph: {
    title: 'Food Delivery Areas in Bhagalpur | PlanetsSwaad',
    description: 'We deliver to all major areas of Bhagalpur. Check your locality below.',
    url: 'https://planetsswaad.netlify.app/areas',
  },
};

const areaJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DeliveryChargeSpecification',
  appliesToDeliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeDirectDownload',
  eligibleRegion: [
    { '@type': 'City', name: 'Bhagalpur', containedInPlace: { '@type': 'State', name: 'Bihar' } },
  ],
};

const areas = [
  { name: 'Nathnagar', emoji: '🏘️', desc: 'Express delivery in 25–35 mins' },
  { name: 'Adampur', emoji: '🏡', desc: 'Fast delivery to all sectors' },
  { name: 'Barari', emoji: '🌳', desc: 'Available all day 9 AM–11 PM' },
  { name: 'Sabour', emoji: '🎓', desc: 'Special student tiffin plans' },
  { name: 'Champanagar', emoji: '🏢', desc: 'Office lunch delivery available' },
  { name: 'TDC College Area', emoji: '📚', desc: 'Campus-friendly combos' },
  { name: 'Tilkamanjhi', emoji: '🛣️', desc: 'City-centre fast delivery' },
  { name: 'Tatarpur', emoji: '🏙️', desc: 'Residential delivery available' },
  { name: 'Mayaganj', emoji: '🏥', desc: 'Near hospital zone delivery' },
  { name: 'Bhagalpur City Centre', emoji: '🌆', desc: 'Prime zone — fastest delivery' },
  { name: 'Khalifabag', emoji: '🏠', desc: 'Home delivery across area' },
  { name: 'Mirjanhat', emoji: '🛵', desc: 'Full area coverage' },
];

export default function AreasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(areaJsonLd) }}
      />

      <div className="min-h-screen bg-earth-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block bg-nature-100 text-nature-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              🛵 Delivery Coverage
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-nature-900 mb-4">
              We Deliver Across Bhagalpur
            </h1>
            <p className="text-nature-600 text-lg max-w-xl mx-auto">
              PlanetsSwaad delivers hot, fresh food to every major neighbourhood in Bhagalpur, Bihar — 9 AM to 11 PM, every day.
            </p>
          </div>

          {/* Area Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {areas.map((area) => (
              <div
                key={area.name}
                className="bg-white border border-nature-200 rounded-2xl p-6 hover:shadow-lg hover:border-nature-400 transition-all duration-300 group cursor-default"
              >
                <div className="text-4xl mb-3">{area.emoji}</div>
                <h2 className="text-lg font-bold text-nature-900 mb-1 group-hover:text-nature-600 transition-colors">
                  {area.name}
                </h2>
                <p className="text-nature-600 text-sm">{area.desc}</p>
                <div className="mt-4">
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ✅ Delivery Available
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="bg-nature-50 border border-nature-200 rounded-2xl p-6 text-center mb-10">
            <p className="text-nature-700 text-base">
              📍 Don&apos;t see your area? We may still deliver to you.{' '}
              <strong>Order anyway</strong> and our team will confirm availability — we&apos;re always expanding coverage!
            </p>
          </div>

          {/* Delivery Info Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: '⏱️', title: '30–45 Min Delivery', sub: 'Hot food at your door' },
              { icon: '🆓', title: 'Free Above ₹199', sub: 'No hidden delivery fees' },
              { icon: '📅', title: 'Open Every Day', sub: '9 AM – 11 PM including holidays' },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-nature-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-nature-900">{item.title}</div>
                <div className="text-nature-600 text-sm mt-1">{item.sub}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/menu"
              className="inline-block px-10 py-4 bg-nature-500 hover:bg-nature-400 text-white rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-nature-500/30"
            >
              Order Now — We&apos;ll Deliver to You 🛵
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
