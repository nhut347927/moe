import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPWAButtonProps {
  trigger?: (onClick: () => Promise<void>) => React.ReactNode;
  onInstallSuccess?: () => void;
  onInstallDismiss?: () => void;
}

const InstallPWAButton = ({
  trigger,
  onInstallSuccess,
  onInstallDismiss,
}: InstallPWAButtonProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if app is already installed
    window.addEventListener("appinstalled", () => {
      setCanInstall(false);
      setDeferredPrompt(null);
      onInstallSuccess?.();
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", () => {});
    };
  }, [onInstallSuccess]);

  const handleClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        onInstallSuccess?.();
      } else {
        onInstallDismiss?.();
      }
    } catch (error) {
      console.error("Error prompting PWA install:", error);
    } finally {
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  // Don't render anything if installation is not possible
  if (!canInstall) return null;

  return trigger ? (
    <>{trigger(handleClick)}</>
  ) : (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
      aria-label="Install application"
    >
      Install App
    </button>
  );
};

export default InstallPWAButton;