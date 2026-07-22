import { useEffect, useState } from 'react';
import SectionHead from './SectionHead';

function Stars({ rating }) {
  const full = Math.round(rating || 0);
  return (
    <span className="google-reviews-stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}
      {'☆'.repeat(5 - full)}
    </span>
  );
}

function ReviewCard({ review, profileUrl }) {
  return (
    <article className="google-review-card panel">
      {review.snapshot ? (
        <a
          href={profileUrl || undefined}
          target={profileUrl ? '_blank' : undefined}
          rel={profileUrl ? 'noopener noreferrer' : undefined}
        >
          <img
            className="google-review-snapshot"
            src={review.snapshot}
            alt={review.snapshotAlt || `${review.authorName || 'Google user'} review`}
            loading="lazy"
          />
        </a>
      ) : (
        <>
          <header>
            <strong>{review.authorName || 'Google user'}</strong>
            <Stars rating={review.rating} />
          </header>
          {review.text && <p>{review.text}</p>}
          {review.relativeTime && <time>{review.relativeTime}</time>}
        </>
      )}
    </article>
  );
}

export default function GoogleReviews({ heading, data }) {
  if (!data?.rating) return null;

  const reviews = (data.reviews || []).slice(0, 5);
  const profileUrl = data.profileUrl;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reviews.length <= 1 || paused) return undefined;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % reviews.length);
    }, 4500);

    return () => window.clearInterval(id);
  }, [reviews.length, paused]);

  return (
    <section className="google-reviews">
      <div className="wrap">
        {heading && <SectionHead eyebrow={heading.eyebrow} headline={heading.headline} />}
        <div className="google-reviews-summary panel">
          <Stars rating={data.rating} />
          <p>
            <strong>{Number(data.rating).toFixed(1)}</strong>
            {data.reviewCount ? (
              <> · {data.reviewCount} Google reviews</>
            ) : null}
            {data.businessName ? (
              <> · {data.businessName}</>
            ) : null}
          </p>
          {profileUrl && (
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              See all reviews on Google →
            </a>
          )}
        </div>
        {reviews.length > 0 && (
          <div
            className="google-reviews-gallery"
            aria-roledescription="carousel"
            aria-label="Google reviews"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
            }}
          >
            <div className="google-reviews-viewport">
              <div
                className="google-reviews-track"
                style={{ transform: `translateX(-${active * 100}%)` }}
              >
                {reviews.map((r, i) => (
                  <div key={r.authorName || i} className="google-reviews-slide">
                    <ReviewCard review={r} profileUrl={profileUrl} />
                  </div>
                ))}
              </div>
            </div>
            {reviews.length > 1 && (
              <div className="google-reviews-dots" aria-hidden="true">
                {reviews.map((r, i) => (
                  <span
                    key={r.authorName || i}
                    className={i === active ? 'is-active' : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <p className="google-reviews-attrib">Reviews from Google</p>
      </div>
    </section>
  );
}
