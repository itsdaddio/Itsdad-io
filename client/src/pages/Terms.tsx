/**
 * Terms.tsx — Terms of Service page for itsdad.io
 * Required for membership site compliance and Meta Ads.
 */

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-slate-400 mb-10 text-sm">Effective Date: March 27, 2026 | Last Updated: March 27, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using itsdad.io (the "Site"), operated by Its Dad LLC ("we," "us," or "our"),
              you agree to be bound by these Terms of Service. If you do not agree to these terms, please
              do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>
              itsdad.io is an affiliate marketing education platform that provides membership-based access
              to curated affiliate products, educational courses (the "Affiliated Degree"), marketing tools,
              swipe files, and community resources. We offer multiple membership tiers with varying levels
              of access and features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Membership and Billing</h2>
            <p>
              Memberships are billed on a recurring monthly basis through Stripe. By subscribing, you
              authorize us to charge your payment method on file for the applicable membership fee.
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Starter Pack:</strong> $1 for the first 7 days, then $7/month</li>
              <li><strong>Builder Club:</strong> $19/month</li>
              <li><strong>Pro Creator:</strong> $49.99/month</li>
              <li><strong>Inner Circle Club:</strong> $99.99/month</li>
            </ul>
            <p className="mt-2">
              You may cancel your membership at any time. Cancellation takes effect at the end of your
              current billing period. No refunds are provided for partial months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Trial Period</h2>
            <p>
              The Starter Pack includes a 7-day trial period at a reduced rate of $1. If you do not cancel
              before the trial period ends, your membership will automatically renew at the standard monthly
              rate of $7/month. You may cancel at any time during the trial period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Affiliate Program</h2>
            <p>
              Members may earn commissions by referring new customers through our affiliate program.
              Commission rates vary by membership tier (30%–40%). Commissions are tracked through our
              platform and paid according to our affiliate program terms. We reserve the right to modify
              commission structures with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Use the Site for any unlawful purpose</li>
              <li>Share, redistribute, or resell membership content without authorization</li>
              <li>Misrepresent your identity or affiliation with any person or entity</li>
              <li>Interfere with or disrupt the Site's functionality or security</li>
              <li>Use automated systems (bots, scrapers) to access the Site without permission</li>
              <li>Make false or misleading income claims when promoting our products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
            <p>
              All content on the Site — including text, graphics, logos, course materials, swipe files,
              and software — is the property of Its Dad LLC or its licensors and is protected by
              copyright and intellectual property laws. You may not reproduce, distribute, or create
              derivative works from our content without express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Earnings Disclaimer</h2>
            <p>
              We make no guarantees regarding income or financial results. Individual results vary based
              on effort, experience, and market conditions. For full details, please review our{" "}
              <a href="/disclaimer" className="text-amber-400 hover:underline">Earnings Disclaimer</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Its Dad LLC shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of the Site
              or services. Our total liability shall not exceed the amount you paid to us in the 12 months
              preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Its Dad LLC, its officers, directors, employees,
              and agents from any claims, damages, or expenses arising from your use of the Site, violation
              of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our discretion, with or without
              notice, for conduct that we determine violates these Terms or is harmful to other users, us,
              or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of
              Georgia, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Changes will be posted on this page with an
              updated effective date. Your continued use of the Site after changes are posted constitutes
              acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact us:
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
