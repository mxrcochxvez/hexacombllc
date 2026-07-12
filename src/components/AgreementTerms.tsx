type AgreementTermsProps = {
  clientName: string;
  maintenanceFeeMonthly: number;
  agreementDate?: string;
};

function formatFee(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

/**
 * HTML port of public/website_agreement.pdf (7 sections).
 */
export function AgreementTerms({
  clientName,
  maintenanceFeeMonthly,
  agreementDate,
}: AgreementTermsProps) {
  const dateLabel = agreementDate?.trim() || "the date of acceptance below";

  return (
    <article className="agreement-doc">
      <header className="agreement-doc__header">
        <p className="agreement-doc__eyebrow">Hexacomb LLC · Service template</p>
        <h1 className="agreement-doc__title">
          Website Design, Hosting, &amp; Maintenance Agreement
        </h1>
      </header>

      <p>
        THIS AGREEMENT is entered into as of {dateLabel}, by and between:
      </p>
      <ul className="agreement-doc__parties">
        <li>
          <strong>Service Provider:</strong> Hexacomb LLC (&quot;Hexacomb&quot;),
          and
        </li>
        <li>
          <strong>Client:</strong> {clientName || "________________"} (&quot;Client&quot;).
        </li>
      </ul>

      <section>
        <h2>1. Scope of Work &amp; Free Development</h2>
        <p>
          Hexacomb agrees to design, build, and deploy a custom website for the
          Client (the &quot;Website&quot;). The initial design, development, and
          deployment phases of the Website are provided to the Client free of
          charge ($0.00 upfront development fee). The specific features, pages,
          and technical requirements of the initial Website build must be
          mutually agreed upon and defined in writing prior to the commencement
          of any work.
        </p>
      </section>

      <section>
        <h2>2. Mandatory Pairing of Hosting and Maintenance</h2>
        <p>
          In consideration for the free design and deployment services described
          in Section 1, the Client explicitly agrees that the Website must be
          hosted and maintained by Hexacomb. This Agreement strictly pairs the
          free upfront development with a recurring service commitment consisting
          of the following monthly costs:
        </p>
        <ul>
          <li>
            <strong>Hosting Fee:</strong> Fixed at $30.00 per month.
          </li>
          <li>
            <strong>Maintenance Fee:</strong> Fixed at{" "}
            {formatFee(maintenanceFeeMonthly)} per month.
          </li>
        </ul>
        <p>
          Billing shall commence immediately upon the deployment/launch of the
          Website, or on an alternatively agreed-upon date, and will repeat on a
          monthly cycle.
        </p>
      </section>

      <section>
        <h2>3. Maintenance Terms &amp; Exclusions</h2>
        <p>
          The monthly maintenance fee covers minor standard updates, small
          technical fixes, stability updates, and routine content modifications
          required to keep the Website operational and current. Monthly
          maintenance specifically does not include full website redesigns,
          structural modifications, or the addition of entirely new features or
          complex functionalities. Any such expansions or redesigns fall outside
          this standard template and must be negotiated, defined, and priced
          separately in writing upfront before work begins.
        </p>
      </section>

      <section>
        <h2>4. Termination &amp; Exit Policy</h2>
        <p>
          The Client has the right to exit and terminate this contract at any
          time, for any reason, without incurring termination penalties. To
          trigger termination, the Client must provide written notice to
          Hexacomb. Upon termination, the Client explicitly recognizes and agrees
          that the Website will no longer remain online after the conclusion of
          the current paid billing period. Hexacomb will cease hosting and
          technical operations for the Website upon the expiration of said
          billing cycle.
        </p>
      </section>

      <section>
        <h2>5. Intellectual Property &amp; Content Ownership</h2>
        <p>
          The Client retains full and exclusive ownership of all original text,
          branding, logos, graphics, and data provided to Hexacomb for inclusion
          on the Website (&quot;Client Content&quot;). Hexacomb lays no claim of
          ownership to proprietary Client Content or trademarks. However, the
          Client explicitly grants Hexacomb a non-exclusive, worldwide,
          royalty-free license to use the copyright and creative layout assets
          from the finalized Website for promotional, operational, or development
          purposes, unless such elements are explicitly trademarked by the
          Client.
        </p>
      </section>

      <section>
        <h2>6. Promotional Rights &amp; Advertising</h2>
        <p>
          The Client hereby releases rights to and grants Hexacomb permission to
          publicly advertise, showcase, and credit themselves for the creation of
          the Website. This includes, but is not limited to, featuring screenshot
          previews, case studies, and links to the Website within Hexacomb&apos;s
          professional portfolio, marketing materials, social media profiles, and
          professional digital channels.
        </p>
      </section>

      <section>
        <h2>7. Acceptance of Terms</h2>
        <p>
          By accepting below, both Hexacomb and the Client acknowledge that they
          have read, understood, and agreed to all terms, pricing structures, and
          termination clauses outlined in this Agreement.
        </p>
      </section>
    </article>
  );
}
