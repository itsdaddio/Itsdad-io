/**
 * EarningsDisclaimer.tsx — FTC-compliant Earnings Disclaimer for itsdad.io
 * Required for affiliate marketing sites per FTC guidelines.
 */

export default function EarningsDisclaimer() {
  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Earnings Disclaimer</h1>
        <p className="text-slate-400 mb-10 text-sm">Effective Date: March 27, 2026 | Last Updated: March 27, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">No Earnings Guarantees</h2>
            <p>
              Its Dad LLC ("we," "us," or "our") operates itsdad.io as an affiliate marketing education
              platform. We provide tools, resources, and educational content designed to help individuals
              learn affiliate marketing. However, we make <strong>no guarantees</strong> regarding income,
              earnings, or financial results.
            </p>
            <p className="mt-4">
              Any income or earnings statements, examples, or results shown on this Site are estimates
              of what may be possible. There is no assurance that you will achieve the same results.
              Your results will depend on many factors, including but not limited to your background,
              experience, work ethic, market conditions, and the effort you put into applying what you learn.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Individual Results Vary</h2>
            <p>
              The testimonials and examples used on this Site are not intended to represent or guarantee
              that anyone will achieve the same or similar results. Each individual's success depends on
              their dedication, desire, motivation, and many other factors. We do not guarantee that you
              will earn any money using the techniques and ideas presented on this Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Affiliate Relationships</h2>
            <p>
              itsdad.io contains affiliate links to third-party products and services. When you click on
              an affiliate link and make a purchase, we may receive a commission at no additional cost to
              you. These affiliate relationships do not influence our recommendations — we only feature
              products we believe provide genuine value to our members.
            </p>
            <p className="mt-4">
              In accordance with the Federal Trade Commission (FTC) guidelines, we disclose that some of
              the links on this Site are affiliate links. This means we may earn a commission if you click
              through and complete a purchase. This disclosure applies to all affiliate links across the
              entire Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Commission Calculator Disclaimer</h2>
            <p>
              The Commission Calculator tool available on our Free Tools page provides <strong>estimates
              only</strong>. Projected earnings are based on hypothetical scenarios and do not represent
              actual or guaranteed income. Actual earnings depend on traffic volume, conversion rates,
              product availability, and many other variables outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Not Financial Advice</h2>
            <p>
              Nothing on this Site should be construed as financial, legal, or professional advice. The
              content provided is for educational and informational purposes only. Before making any
              financial decisions, consult with a qualified professional who can assess your individual
              circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Forward-Looking Statements</h2>
            <p>
              Any statements on this Site that are not statements of historical fact may be considered
              forward-looking statements. These statements are based on current expectations and assumptions
              and are subject to risks and uncertainties. Actual results may differ materially from those
              expressed or implied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Your Responsibility</h2>
            <p>
              By using this Site and its services, you acknowledge that you are solely responsible for
              your own financial decisions and results. You agree that Its Dad LLC is not liable for any
              success or failure of your business that is directly or indirectly related to the purchase
              and use of our products and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p>
              If you have questions about this Earnings Disclaimer, please contact us:
            </p>
            <p className="mt-2">
              <strong>Its Dad LLC</strong><br />
              Email:{" "}
              <a href="mailto:itsdad@itsdad.io" className="text-amber-400 hover:underline">itsdad@itsdad.io</a><br />
              Website:{" "}
              <a href="https://itsdad.io" className="text-amber-400 hover:underline">itsdad.io</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
