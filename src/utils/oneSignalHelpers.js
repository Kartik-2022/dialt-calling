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


  } catch (error) {
    console.error("Error", error);
  }
};

export const enablePushNotifications = async () => {
  try {

    console.log("Attempting to show Slidedown Prompt via react-onesignal.");

    const isPushSupported = await OneSignal.isPushNotificationsSupported();
    if (isPushSupported) {
      console.log("Push notifications are supported. Calling showSlidedownPrompt.");
      await OneSignal.showSlidedownPrompt({ force: true });
      console.log("OneSignal Slidedown Prompt shown via react-onesignal.");
    } else {
      console.warn("Push notifications not supported in this browser or OneSignal not initialized.");
    }
  } catch (error) {
    console.error("Error showing Slidedown Prompt via react-onesignal:", error);
  }
};
