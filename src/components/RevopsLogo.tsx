const RevopsLogo = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#BE1869" />
        <stop offset="1" stopColor="#6224BE" />
      </linearGradient>
    </defs>
    {/* Two intertwined curved lines suggesting a track/loop */}
    <path
      d="M6 22C6 22 10 8 16 8C22 8 20 24 26 24"
      stroke="url(#logo-grad)"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M6 10C6 10 10 24 16 24C22 24 20 8 26 8"
      stroke="url(#logo-grad)"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />
  </svg>
);

export default RevopsLogo;
