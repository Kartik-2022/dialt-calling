// src/utils/oneSignalHelpers.js
import OneSignal from 'react-onesignal';

export const initializeOneSignal = async (appId, allowLocalhostAsSecureOrigin = false) => {
  try {
    console.log("Attempting OneSignal initialization via react-onesignal...");
    await OneSignal.init({ 
      appId: appId,
      notifyButton: {
        enable: false,
      },
      welcomeNotification: {
        disable: true
      },
      allowLocalhostAsSecureOrigin: allowLocalhostAsSecureOrigin,
      requiresUserPrivacyConsent: false,
      notificationClickHandlerMatch: "origin",
      notificationClickHandlerAction: "focus",
    });
    console.log("OneSignal initialized via react-onesignal.");

  } catch (error) {
    console.error("Error initializing OneSignal via react-onesignal:", error);
  }
};

export const enablePushNotifications = async () => {
  try {

    const isPushSupported = await OneSignal.isPushNotificationsSupported();

    
    
    if (isPushSupported) {
      console.log("Push notifications are supported. Attempting to show Slidedown Prompt.");
      await OneSignal.showSlidedownPrompt({ force: true });
      console.log("OneSignal Slidedown Prompt shown via react-onesignal.");
    } else {
      console.warn("Push notifications not supported in this browser or OneSignal not initialized.");
    }
  } catch (error) {
    console.error("Error showing Slidedown Prompt via react-onesignal:", error);
  }
};
