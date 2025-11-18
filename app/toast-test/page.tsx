'use client';

import { useToast } from '@/app/contexts/ToastContext';
import ButtonLarge from '@/app/components/ButtonLarge';

export default function ToastTestPage() {
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            Toast Notification Test Page
          </h1>
          <p className="text-neutral-600">
            Click the buttons below to preview all toast variants
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* Success Variant */}
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Success Toast</h2>
              <div className="flex flex-wrap gap-3">
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'success',
                      'Success',
                      'Your action was completed successfully!'
                    )
                  }
                  variant="primary"
                >
                  Show Success Toast
                </ButtonLarge>
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'success',
                      'Login successful',
                      'You have been logged in successfully.'
                    )
                  }
                  variant="primary"
                >
                  Login Success
                </ButtonLarge>
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'success',
                      'Data saved',
                      'Your changes have been saved successfully.'
                    )
                  }
                  variant="primary"
                >
                  Save Success
                </ButtonLarge>
              </div>
            </div>

            {/* Warning Variant */}
            <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-700">Warning Toast</h2>
              <div className="flex flex-wrap gap-3">
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'warning',
                      'Warning',
                      'Please review your input before proceeding.'
                    )
                  }
                  variant="primary"
                >
                  Show Warning Toast
                </ButtonLarge>
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'warning',
                      'Login failed',
                      'The username or password you entered is incorrect. Please try again.'
                    )
                  }
                  variant="primary"
                >
                  Login Warning
                </ButtonLarge>
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'warning',
                      'Incomplete form',
                      'Some required fields are missing. Please fill them in.'
                    )
                  }
                  variant="primary"
                >
                  Form Warning
                </ButtonLarge>
              </div>
            </div>

            {/* Danger Variant */}
            <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-700">Danger Toast</h2>
              <div className="flex flex-wrap gap-3">
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'danger',
                      'Error',
                      'Something went wrong. Please try again later.'
                    )
                  }
                  variant="primary"
                >
                  Show Danger Toast
                </ButtonLarge>
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'danger',
                      'Login failed',
                      'The username or password you entered is incorrect. Please try again.'
                    )
                  }
                  variant="primary"
                >
                  Login Error
                </ButtonLarge>
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'danger',
                      'Connection error',
                      'Unable to connect to the server. Please check your internet connection.'
                    )
                  }
                  variant="primary"
                >
                  Connection Error
                </ButtonLarge>
              </div>
            </div>

            {/* Custom Duration */}
            <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-700">Custom Duration</h2>
              <div className="flex flex-wrap gap-3">
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'success',
                      'Quick toast',
                      'This toast will disappear in 2 seconds.',
                      2000
                    )
                  }
                  variant="primary"
                >
                  2 Second Duration
                </ButtonLarge>
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'warning',
                      'Long toast',
                      'This toast will stay for 10 seconds.',
                      10000
                    )
                  }
                  variant="primary"
                >
                  10 Second Duration
                </ButtonLarge>
                <ButtonLarge
                  onClick={() =>
                    showToast(
                      'danger',
                      'Persistent toast',
                      'This toast will not auto-dismiss (duration: 0).',
                      0
                    )
                  }
                  variant="primary"
                >
                  No Auto-Dismiss
                </ButtonLarge>
              </div>
            </div>

            {/* Multiple Toasts */}
            <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-700">Multiple Toasts</h2>
              <div className="flex flex-wrap gap-3">
                <ButtonLarge
                  onClick={() => {
                    showToast('success', 'First toast', 'This is the first toast.');
                    setTimeout(() => {
                      showToast('warning', 'Second toast', 'This is the second toast.');
                    }, 500);
                    setTimeout(() => {
                      showToast('danger', 'Third toast', 'This is the third toast.');
                    }, 1000);
                  }}
                  variant="primary"
                >
                  Show 3 Toasts
                </ButtonLarge>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-neutral-100 rounded-xl p-6">
          <h3 className="text-base font-semibold text-neutral-700 mb-3">
            Instructions
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-neutral-600">
            <li>Click any button to show a toast notification</li>
            <li>Toasts appear in the top-right corner</li>
            <li>Default auto-dismiss duration is 5 seconds</li>
            <li>Multiple toasts stack vertically</li>
            <li>Toasts slide in from the right with animation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}



