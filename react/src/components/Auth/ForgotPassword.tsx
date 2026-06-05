import { useState } from "react";
import { authClient } from "../../lib/auth-client";

export function ForgotPassword({
  switchToLogin,
}: {
  switchToLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: err } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) throw new Error(err.message || "Failed to send reset email");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800">
        <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white dark:bg-gray-700 px-4 pb-4 pt-8 sm:rounded-lg sm:px-10 sm:pb-6 sm:shadow text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Check your email
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                If an account exists for {email}, you will receive a password reset link shortly.
              </p>
              <button
                onClick={switchToLogin}
                className="font-semibold text-indigo-600 dark:text-indigo-100 hover:text-indigo-500"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h1>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-700 px-4 pb-4 pt-8 sm:rounded-lg sm:px-10 sm:pb-6 sm:shadow">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/50 p-3 text-sm text-red-600 dark:text-red-200">
                {error}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-white">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400 dark:focus:ring-offset-2 disabled:cursor-wait disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
            <div className="m-auto mt-6 w-fit md:mt-8">
              <span className="m-auto dark:text-gray-400">
                Remember your password?{' '}
                <a className="font-semibold text-indigo-600 dark:text-indigo-100 cursor-pointer" onClick={switchToLogin}>
                  Back to Sign In
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
