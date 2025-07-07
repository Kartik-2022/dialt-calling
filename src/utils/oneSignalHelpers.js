// src/utils/oneSignalHelpers.js
import OneSignal from 'react-onesignal';

/**
 * Initializes the OneSignal SDK using react-onesignal.
 * This should be called once when your application starts.
 * @param {string} appId - Your OneSignal App ID.
 * @param {boolean} [allowLocalhostAsSecureOrigin=false] - Set to true for development on localhost.
 */
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
      // ADD THIS FOR VERBOSE DEBUGGING
      logLevel: 'trace' // This will make OneSignal log a lot more info
    });
    console.log("OneSignal initialized via react-onesignal.");

  } catch (error) {
    console.error("Error initializing OneSignal via react-onesignal:", error);
  }
};

/**
 * Prompts the user to enable push notifications using OneSignal's Slidedown Prompt.
 * This should be called when a user explicitly clicks a button.
 */
export const enablePushNotifications = async () => {
  try {
    // OneSignal methods should be available if init() has completed.
    // react-onesignal often queues these calls internally until ready.
    console.log("Attempting to show Slidedown Prompt via react-onesignal.");
    // We are no longer awaiting an external promise here.
    // We rely on OneSignal itself being ready.
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
