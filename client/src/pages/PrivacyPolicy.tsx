/**
 * PrivacyPolicy.tsx — Privacy Policy page for itsdad.io
 * GDPR/CCPA compliant. Required for Meta Ads and FTC compliance.
 */

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-400 mb-10 text-sm">Effective Date: March 27, 2026 | Last Updated: March 27, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p>
              Its Dad LLC ("we," "us," or "our") operates the website itsdad.io (the "Site"). This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit our Site,
              use our services, or interact with our platform. Please read this policy carefully. By using the
              Site, you consent to the practices described herein.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-white mb-2">Personal Information You Provide</h3>
            <p>We may collect the following when you voluntarily provide it:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Name and email address (when signing up for the Free Roadmap or creating an account)</li>
              <li>Payment information (processed securely through Stripe — we do not store card details)</li>
              <li>Any information you submit through contact forms or support chat</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2 mt-6">Information Collected Automatically</h3>
            <p>When you visit the Site, we may automatically collect:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited, time spent, and referring URLs</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information (receipts, confirmations)</li>
              <li>Send you the Free Affiliate Roadmap and related educational content</li>
              <li>Communicate with you about membership updates, new features, and support</li>
              <li>Monitor and analyze usage trends to improve user experience</li>
              <li>Detect, prevent, and address technical issues or fraudulent activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Payment Processing</h2>
            <p>
              All payment transactions are processed through <strong>Stripe, Inc.</strong> We do not store,
              collect, or have access to your full credit card number, expiration date, or CVV. Stripe's
              privacy policy governs the collection and use of your payment information. You can review
              Stripe's privacy policy at{" "}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
                stripe.com/privacy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze site traffic,
              and understand where our visitors come from. You can control cookie preferences through
              your browser settings. Disabling cookies may affect some features of the Site.
            </p>
            <p className="mt-2">Types of cookies we use:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Essential cookies:</strong> Required for the Site to function properly</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with the Site</li>
              <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements (e.g., Meta Pixel)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Services</h2>
            <p>We may share your information with the following third-party service providers:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>HubSpot:</strong> Email marketing and CRM</li>
              <li><strong>Meta (Facebook/Instagram):</strong> Advertising and analytics</li>
              <li><strong>Railway:</strong> Application hosting</li>
            </ul>
            <p className="mt-2">
              These services have their own privacy policies. We do not sell your personal information
              to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Affiliate Disclosure</h2>
            <p>
              itsdad.io is an affiliate marketing education platform. Some links on this Site are affiliate
              links, meaning we may earn a commission if you click through and make a purchase. This does
              not affect the price you pay. We only recommend products we believe provide genuine value.
              For full details, see our{" "}
              <a href="/disclaimer" className="text-amber-400 hover:underline">Earnings Disclaimer</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Data Security</h2>
            <p>
              We implement commercially reasonable security measures to protect your personal information.
              However, no method of transmission over the Internet or electronic storage is 100% secure.
              While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:itsdad@itsdad.io" className="text-amber-400 hover:underline">itsdad@itsdad.io</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. California Residents (CCPA)</h2>
            <p>
              If you are a California resident, you have additional rights under the California Consumer
              Privacy Act (CCPA), including the right to know what personal information we collect, the
              right to delete your data, and the right to opt out of the sale of personal information.
              We do not sell personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Children's Privacy</h2>
            <p>
              Our Site is not intended for individuals under the age of 18. We do not knowingly collect
              personal information from children. If we become aware that we have collected data from a
              child under 18, we will take steps to delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page
              with an updated "Last Updated" date. Your continued use of the Site after changes are posted
              constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us:
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
