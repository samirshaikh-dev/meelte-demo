"use client";

import React, { useState } from 'react';
import {
  NEWSLETTER_ERROR,
  submitNewsletterSubscription,
} from '@/services/newsletter';
import {
  TOAST_COPY,
  TOAST_ID,
  notifyError,
  notifyInfo,
  notifySuccess,
} from '@/lib/toast-feedback';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus('error');
      setMessage(TOAST_COPY.newsletterInvalidEmail);
      notifyError(TOAST_COPY.newsletterInvalidEmail, { id: TOAST_ID.newsletter });
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await submitNewsletterSubscription(email.trim());
      setStatus('success');
      setEmail('');
      setMessage(TOAST_COPY.newsletterSuccess);
      notifySuccess(TOAST_COPY.newsletterSuccess, { id: TOAST_ID.newsletter });
    } catch (error) {
      // Honest failure states — the toast channel makes the single announcement; the inline
      // text below is the persistent visual record (intentionally no aria-live, to avoid
      // double-announcing the same event to screen readers).
      let errorMessage = TOAST_COPY.newsletterError;

      if (error?.code === NEWSLETTER_ERROR.NOT_CONFIGURED) {
        errorMessage = TOAST_COPY.newsletterNotConnected;
        notifyError(errorMessage, { id: TOAST_ID.newsletter });
      } else if (error?.code === NEWSLETTER_ERROR.ALREADY_SUBSCRIBED) {
        errorMessage = TOAST_COPY.newsletterAlreadySubscribed;
        setStatus('success');
        setEmail('');
        setMessage(errorMessage);
        notifyInfo(errorMessage, { id: TOAST_ID.newsletter });
        return;
      } else {
        notifyError(errorMessage, { id: TOAST_ID.newsletter });
      }

      setStatus('error');
      setMessage(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">Get neighborhood updates</p>
        {/* <p className="text-xs text-foreground-secondary">
          New shops, events and people near you.
        </p> */}
      </div>

      {status === 'success' ? (
        <p className="mt-3 text-sm font-medium text-primary">{message}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2" noValidate>
          <label htmlFor="footer-newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="flex w-full items-center overflow-hidden rounded-full border border-border bg-surface shadow-sm focus-within:ring-2 focus-within:ring-primary/40">
            <input
              id="footer-newsletter-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setMessage('');
                }
              }}
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-foreground-secondary focus:outline-none"
              aria-invalid={status === 'error' ? 'true' : 'false'}
              aria-describedby={status === 'error' && message ? 'footer-newsletter-error' : undefined}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center whitespace-nowrap bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {/* <p className="text-[11px] text-foreground-secondary">We never share your email.</p> */}
          {status === 'error' && message && (
            <p id="footer-newsletter-error" className="text-xs text-error">
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

export default NewsletterForm;
