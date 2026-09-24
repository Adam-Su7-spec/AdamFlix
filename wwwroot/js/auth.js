/**
 * AdamFlix Google OAuth 2.0 Integration
 */
window.AdamFlixAuth = {
  initializeGoogle: function(clientId, callbackInstance) {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: function(response) {
          callbackInstance.invokeMethodAsync('OnGoogleCredentialReceived', response.credential);
        }
      });
    }
  },

  promptGoogleSignIn: function() {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    }
  }
};
