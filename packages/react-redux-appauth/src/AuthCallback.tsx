import { useAuth } from './useAuth';
import React, { ReactNode, useEffect, useState } from 'react';

interface StubHistory {
  push(uri: string): void;
}

interface AuthCallbackProps {
  history: StubHistory;
  defaultRedirect?: string;
  isPopup?: boolean;
  isSilent?: boolean;
  onError?: () => React.ReactNode;
  children?: ReactNode[] | ReactNode;
}
/**
 * Redirects back to a stored uri from localStorage or default if none was found
 * @param AuthCallbackProps
 * @returns
 */
export const AuthCallback: React.FC<AuthCallbackProps> = ({
  history,
  children,
  onError,
  defaultRedirect = '/',
  isPopup = false,
  isSilent = false,
}) => {
  const auth = useAuth();
  const [showError, setShowError] = useState<boolean>(false);

  // Check if we have something in sessionStorage and redirect to that.
  useEffect(() => {
    if (!auth.isLoading) {
      auth
        .signinCallback()
        .then(() => {
          if (!isPopup && !isSilent) {
            const redirectUri = sessionStorage.getItem('redirect-uri');
            if (redirectUri) {
              history.push(redirectUri);
            } else {
              history.push(defaultRedirect);
            }
          }
        })
        .catch((e) => {
          console.error(e);
          setShowError(true);
        });
    }
  }, [isPopup, auth]);

  if (showError && onError !== undefined) {
    return <>{onError()}</>;
  }
  return <>{children}</>;
};
