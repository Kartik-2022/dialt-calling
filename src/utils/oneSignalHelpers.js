// src/utils/oneSignalHelpers.js
import OneSignal from 'react-onesignal';

export const initializeOneSignal = async (appId, allowLocalhostAsSecureOrigin = false) => {
  try {
    console.log("Attempting OneSignal");
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
    console.log("Attempting");

    const isPushSupported = await OneSignal.isPushNotificationsSupported();
    if (isPushSupported) {
      console.log("Push notifications");
      await OneSignal.showSlidedownPrompt({ force: true });
      console.log("Slidedown");
    } else {
      console.warn("Push notifications");
    }
  } catch (error) {
    console.error("Error", error);
  }
};


export const setEmailSubscription = async (email) => {
    try {
      await OneSignal.ready(async function() {
        console.log(`set email: ${email}`);
        await OneSignal.setEmail(email, {
        });
        console.log(`Email set ${email}`);
      });
    } catch (error) {
      console.error("Error", error);
    }
  };

  export const logoutEmailSubscription = async () => {
    try {
      await OneSignal.ready(async function() {
        console.log(" logout email");
        await OneSignal.logoutEmail();
        console.log("Email subscription logged out.");
      });
    } catch (error) {
      console.error("Error", error);
    }
  };


  
