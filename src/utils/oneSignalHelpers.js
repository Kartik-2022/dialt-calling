// src/utils/oneSignalHelpers.js

export const initializeOneSignal = (appId, allowLocalhostAsSecureOrigin = false) => {
    if (window.OneSignal) {
      window.OneSignal.push(function() {
        console.log("OneSignal.push() callback for init is executing.");
        window.OneSignal.init({
          appId: appId,
          notifyButton: {
            enable: false,
          },
          welcomeNotification: {
            disable: true
          },
          allowLocalhostAsSecureOrigin: allowLocalhostAsSecureOrigin,
        }).then(() => {
          console.log("OneSignal resolved");
        }).catch(error => {
          console.error("Error", error);
        });
      });
    }
  };

  export const enablePushNotifications = () => {
    if (window.OneSignal) {
      window.OneSignal.push(function() {
        console.log("Current", window.OneSignal);
        console.log("Type", typeof window.OneSignal.showSlidedownPrompt);
  
        setTimeout(() => {
          if (typeof window.OneSignal.showSlidedownPrompt === 'function') {
            window.OneSignal.showSlidedownPrompt({ force: true }).then(() => {
              console.log("Slidedown ");
            }).catch(error => {
              console.error("Error setTimeout):", error);
            });
          } else {
            console.log( window.OneSignal);
          }
        }, 500);
      });
    }
  };
  