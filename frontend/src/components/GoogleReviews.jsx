import { useCallback, useEffect, useState } from 'react';
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

function ReviewCard({ review }) {
  const alt = review.snapshotAlt || `${review.authorName || 'Google user'} review`;

  return (
    <article className="google-review-card panel">
      {review.snapshot ? (
        <div className="google-review-frame">
          <img
            className="google-review-snapshot"
            src={review.snapshot}
            alt={alt}
            loading="lazy"
          />
        </div>
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

  const reviews = data.reviews || [];
  const profileUrl = data.profileUrl;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = reviews.length;
  const current = reviews[active];

  const goPrev = useCallback(() => {
    setActive((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActive((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || paused) return undefined;

    const id = window.setInterval(goNext, 4500);
    return () => window.clearInterval(id);
  }, [total, paused, goNext]);

  const onGalleryKeyDown = (event) => {
    if (total <= 1) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  };

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
        {total > 0 && current && (
          <div
            className="google-reviews-gallery"
            tabIndex={0}
            aria-roledescription="carousel"
            aria-label="Google reviews"
            onKeyDown={onGalleryKeyDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
            }}
          >
            <div className="google-reviews-carousel">
              {total > 1 && (
                <button
                  type="button"
                  className="google-reviews-nav google-reviews-nav--prev"
                  onClick={goPrev}
                  aria-label="Previous review"
                >
                  ‹
                </button>
              )}
              <div className="google-reviews-viewport" aria-live="polite">
                <ReviewCard key={active} review={current} />
              </div>
              {total > 1 && (
                <button
                  type="button"
                  className="google-reviews-nav google-reviews-nav--next"
                  onClick={goNext}
                  aria-label="Next review"
                >
                  ›
                </button>
              )}
            </div>
            {total > 1 && (
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
