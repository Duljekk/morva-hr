export const SickLeaveIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="5" y="3" width="14" height="18" rx="2" fill="currentColor" fillOpacity="0.2" />
    <rect x="6" y="4" width="12" height="16" rx="1.5" fill="currentColor" />
    <path
      d="M12 8V12M12 12V16M12 12H8M12 12H16"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="9" cy="2" r="1.5" fill="currentColor" />
    <circle cx="15" cy="2" r="1.5" fill="currentColor" />
  </svg>
);

export const AnnualLeaveIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="7" width="16" height="12" rx="2" fill="currentColor" />
    <rect x="4" y="7" width="16" height="3" rx="1" fill="currentColor" fillOpacity="0.3" />
    <path
      d="M8 7V5C8 4.44772 8.44772 4 9 4H15C15.5523 4 16 4.44772 16 5V7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="14" r="1.5" fill="white" fillOpacity="0.8" />
  </svg>
);

export const EmergencyLeaveIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L4 9V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V9L12 3Z"
      fill="currentColor"
    />
    <rect x="10" y="13" width="4" height="8" fill="white" fillOpacity="0.3" />
    <rect x="14" y="10" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.3" />
  </svg>
);



