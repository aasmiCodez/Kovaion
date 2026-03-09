export default function EyeIcon({ open }) {
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.7a3 3 0 0 0 4.1 4.1" />
      <path d="M9.9 5.1A11.6 11.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-4.2 5.2" />
      <path d="M6.2 6.2A17.4 17.4 0 0 0 2 12s3.5 7 10 7a10.9 10.9 0 0 0 2.1-.2" />
    </svg>
  );
}
