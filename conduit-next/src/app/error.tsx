'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="home-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-12">
            <h2>Something went wrong!</h2>
            <button
              className="btn btn-outline-primary"
              onClick={() => reset()}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
