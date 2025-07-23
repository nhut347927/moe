import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPWAButtonProps {
  onInstallSuccess?: () => void;
  onInstallDismiss?: () => void;
}

const InstallPWAButton = ({
  onInstallSuccess,
  onInstallDismiss,
}: InstallPWAButtonProps) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(
    localStorage.getItem("pwaCanInstall") !== "false"
  );

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
      localStorage.setItem("pwaCanInstall", "true");
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setCanInstall(false);
      setDeferredPrompt(null);
      localStorage.setItem("pwaCanInstall", "false");
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
        setCanInstall(false);
        localStorage.setItem("pwaCanInstall", "false");
        onInstallSuccess?.();
      } else {
        onInstallDismiss?.();
      }
    } catch (error) {
      console.error("Lỗi khi hiển thị lời nhắc cài đặt PWA:", error);
    } finally {
      setDeferredPrompt(null);
    }
  };

  return canInstall ? (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2 text-sm px-3 py-2"
      onClick={handleClick}
      aria-label="Install app"
    >
      <Download className="w-4 h-4" />
      Install App
    </Button>
  ) : (
    <div>
      <p className="w-full justify-start gap-2 text-sm px-3 py-2">
        Installation option is not available. Please reload the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="w-full justify-start gap-2 text-sm px-3 py-2"
        aria-label="Reload to check installation availability"
      >
        Reload Page
      </button>
    </div>
  );
};

export default InstallPWAButton;
