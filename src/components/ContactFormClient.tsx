"use client";

import dynamic from "next/dynamic";

const ContactFormClient = dynamic(() => import("@/components/ContactForm").then((mod) => mod.ContactForm), {
  ssr: false,
  loading: () => (
    <form aria-label="Loading contact form..." aria-busy="true">
      <div className="form-group">
        <label htmlFor="name-loading">
          Full Name <span aria-hidden>*</span>
        </label>
        <input
          type="text"
          id="name-loading"
          required
          autoComplete="name"
          placeholder="Your full name"
          disabled
        />
      </div>
      <div className="form-group">
        <label htmlFor="email-loading">
          Email Address <span aria-hidden>*</span>
        </label>
        <input
          type="email"
          id="email-loading"
          required
          autoComplete="email"
          placeholder="you@yourbusiness.com"
          disabled
        />
      </div>
      <div className="form-group">
        <label htmlFor="business-loading">Business Name</label>
        <input
          type="text"
          id="business-loading"
          autoComplete="organization"
          placeholder="Your business name"
          disabled
        />
      </div>
      <div className="form-group">
        <label htmlFor="website-loading">Current Website URL</label>
        <input
          type="url"
          id="website-loading"
          autoComplete="url"
          placeholder="https://"
          disabled
        />
      </div>
      <div
        style={{ height: 65, display: "flex", alignItems: "center" }}
        aria-label="Loading security check"
      >
        <div className="loading-shimmer" style={{ width: 300, height: 65, borderRadius: 12 }} />
      </div>
      <button
        type="button"
        className="btn btn-primary"
        disabled
        style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
      >
        Loading...
      </button>
    </form>
  ),
});

export { ContactFormClient };
