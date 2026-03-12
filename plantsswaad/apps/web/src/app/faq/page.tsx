import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ — Food Delivery Bhagalpur | PlanetsSwaad',
  description:
    'Frequently asked questions about PlanetsSwaad cloud kitchen — delivery areas, timings, minimum order, menu and more. The best food delivery service in Bhagalpur Bihar.',
  alternates: { canonical: 'https://planetsswaad.netlify.app/faq' },
  openGraph: {
    title: 'FAQ | PlanetsSwaad Cloud Kitchen Bhagalpur',
    description: 'Everything you need to know about ordering from PlanetsSwaad, Bhagalpur\'s top cloud kitchen.',
    url: 'https://planetsswaad.netlify.app/faq',
  },
};

const faqs = [
  {
    q: 'What is PlanetsSwaad?',
    a: 'PlanetsSwaad is Bhagalpur\'s premier cloud kitchen, delivering 100% pure veg North Indian food — including biryani, thali, curries, and daily tiffin — straight to your home, hostel, or office.',
  },
  {
    q: 'Does PlanetsSwaad deliver in all areas of Bhagalpur?',
    a: 'Yes! We deliver across Bhagalpur including Nathnagar, Adampur, Barari, Sabour, Champanagar, and surrounding areas. Check our delivery area page to confirm your pincode.',
  },
  {
    q: 'How do I order food from PlanetsSwaad?',
    a: 'Simply visit planetsswaad.netlify.app, browse our menu, add items to cart, and place your order. We accept UPI, credit/debit cards, and cash on delivery.',
  },
  {
    q: 'What is the minimum order for food delivery in Bhagalpur?',
    a: 'Our minimum order value is ₹99. There are no hidden charges — delivery is free above ₹199.',
  },
  {
    q: 'How fast does PlanetsSwaad deliver in Bhagalpur?',
    a: 'We aim to deliver within 30–45 minutes across Bhagalpur city. For express delivery zones, we target under 30 minutes.',
  },
  {
    q: 'What food is available for delivery in Bhagalpur at night?',
    a: 'PlanetsSwaad is open from 9 AM to 11 PM daily. You can order biryani, thali, paneer dishes, dal, and more even late at night.',
  },
  {
    q: 'Is PlanetsSwaad 100% vegetarian?',
    a: 'Yes! PlanetsSwaad is a 100% pure vegetarian cloud kitchen. All our meals are prepared in a strictly veg kitchen with no meat, poultry, or seafood.',
  },
  {
    q: 'Does PlanetsSwaad offer tiffin or daily meal subscriptions?',
    a: 'Yes, we offer daily tiffin service for students, working professionals, and families in Bhagalpur. Contact us for weekly and monthly subscription plans.',
  },
  {
    q: 'Can I place a bulk or party order from PlanetsSwaad?',
    a: 'Absolutely! We accept bulk orders for events, corporate lunches, and parties in Bhagalpur. Please contact us at least 24 hours in advance for large orders.',
  },
  {
    q: 'What makes PlanetsSwaad different from other cloud kitchens in Bhagalpur?',
    a: 'PlanetsSwaad is the only cloud kitchen in Bhagalpur combining authentic North Indian flavours, 100% vegetarian cooking, student-friendly pricing, and fast delivery — living by our motto: "Swad Jo Dil Ko Chhoo Jaye."',
  },
  {
    q: 'Which app delivers food in Bhagalpur?',
    a: 'You can order directly from PlanetsSwaad at planetsswaad.netlify.app without any app download. We also plan to list on Zomato and Swiggy soon.',
  },
  {
    q: 'What are the timings of PlanetsSwaad cloud kitchen?',
    a: 'PlanetsSwaad is open every day from 9:00 AM to 11:00 PM including Sundays and public holidays.',
  },
];

// JSON-LD FAQ schema for AEO featured snippets
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-earth-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block bg-nature-100 text-nature-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              Help Centre
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-nature-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-nature-600 text-lg">
              Everything you need to know about ordering from PlanetsSwaad — Bhagalpur&apos;s #1 cloud kitchen.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <details
                key={i}
                className="group bg-white border border-nature-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none font-semibold text-nature-900 text-base md:text-lg select-none">
                  <span>{q}</span>
                  <span className="text-nature-500 group-open:rotate-45 transition-transform duration-200 text-2xl flex-shrink-0">+</span>
                </summary>
                <div className="px-6 pb-6 text-nature-700 leading-relaxed border-t border-nature-100 pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-nature-900 rounded-3xl p-10 text-white">
            <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
            <p className="text-nature-300 mb-6">Our team is happy to help you with anything.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="px-8 py-3 bg-nature-500 hover:bg-nature-400 text-white rounded-full font-bold transition-all duration-300 hover:scale-105"
              >
                Order Now
              </Link>
              <Link
                href="/areas"
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold border border-white/20 transition-all duration-300"
              >
                Check Delivery Areas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
