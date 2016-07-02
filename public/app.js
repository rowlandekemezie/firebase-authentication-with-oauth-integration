  // variable for authentiation
  var AUTH0_CLIENT_ID = '2HkpGom87ZurLARHEOGqMyNr34XU6dzD';
  var AUTH0_DOMAIN = 'rownet.auth0.com';
  var API_KEY = 'AIzaSyBTJyfhWFsbdG0oTC08U45BNqo2WVDPP_I';
  var FIREBASE_AUTH0_DOMAIN = 'chattbase-14018.firebaseapp.com';
  var DATABASE_URL = 'https://chattbase-14018.firebaseio.com';
  var STORAGEBUCKET = 'chattbase-14018.appspot.com';


  // Initialize Firebase
  var config = {
      apiKey: API_KEY,
      authDomain: FIREBASE_AUTH0_DOMAIN,
      databaseURL: DATABASE_URL,
      storageBucket: STORAGEBUCKET
  };
  firebase.initializeApp(config);


  firebase.database().ref('stories').on('value', function(data) {
      $('#stories').empty();
      data.forEach(function(story) {
          generateStory(story);
      });
  });


  firebase.database().ref('story').on('value', function(data) {
      $('#story').empty()
      data.forEach(function(data) {
          var emoji = data.val()
          $('#story').append('<i class="em em-' + emoji + '"></i>')
      })
  })


  function generateStory(story) {
      var $div = $('<div>');
      $('#stories').prepend($div);
      story.forEach(function(data) {
          $($div).append('<i class="em em-' + data.val() + '"></i>');
      })
  }

  function generateRandomEmoji() {
      $('#options').empty();
      var number = randomNumber();

      for (var i = 0; i < 30; i++) {
          $('#options').append('<i class="em em-' + emoji[number] + '" onclick="addEmoji(' + number + ')"></i>')
      }
  }


  // implementing a random number function
  function randomNumber() {
      return Math.floor(Math.random() * (emojiLength - 0));
  }
  generateRandomEmoji();

  // Adding Emojis to the application
  function addEmoji(number) {
      var current = firebase.database().ref('story');
      current.transaction(function(data) {
          if (data) {
              if (Object.keys(data).length === 9) {
                  data.final = emoji[number];
                  firebase.database().ref('stories').push(data);
                  firebase.database().ref('story').remove();
              } else {
                  firebase.database().ref('story').push(emoji[number]);
              }
          } else {
              firebase.database().ref('story').push(emoji[number]);
          }
      })
  }
  // Login with google for use with the firebase Auth
  function loginWithGoogle() {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
          userCredential(result);
      }).catch(function(err) {
          alert('err:' + err);
      })
  }

  // Login with facebook
  function loginWithFacebook() {
      var provider = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
          userCredential(result);
      }).catch(function(err) {
          alert('err:' + err);
      })
  }
  // Login with Github
  function loginWithGithub() {
      var provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
          userCredential(result);
      }).catch(function(err) {
          alert('err:' + err);
      })
  }
  // Login with Twitter
  function loginWithTwitter() {
      var provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
          userCredential(result);
      }).catch(function(err) {
          alert('err:' + err);
      })
  }

  // Storing user credentials to database
  function userCredential(result) {
      var user = result.user;
      var profile = localStorage.getItem('profile');
      profile = JSON.parse(profile);
      if (profile) {
          $('#avatar').attr('src', profile.picture);
          $('#displayName').html(profile.name);
          firebase.database().ref('users/' + profile.user_id).set({
              username: profile.name,
              email: profile.email,
          });
      } else {
          var profile;

          for (var i = 0, n = localStorage.length; i < n; i++) {
              if (localStorage.key(i).match(/firebase:authUser:.*/)) {
                  profile = JSON.parse(localStorage.getItem(localStorage.key(i)));
              }
          }
          $('#avatar').attr('src', profile.photoURL);
          $('#displayName').html(profile.displayName);
          firebase.database().ref('users/' + profile.uid).set({
              username: profile.displayName,
              email: profile.email,
          });
      }
  }

  //  signout from firebase
  function logout() {
      localStorage.removeItem('profile')
      firebase.auth().signOut()
          .then(function() {
              console.log('You  are logged out');
          }, function(err) {
              console.log('err:' + err);
          })
  }

  // Auth with Auth0
  function loginWithAuth0() {
      var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
      var auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientID: AUTH0_CLIENT_ID });
      lock.show({ focusInput: false, popup: true }, function(err, profile, id_token) {
          localStorage.setItem('profile', JSON.stringify(profile));
          var options = {
              api: 'firebase',
              id_token: id_token,
              target: AUTH0_CLIENT_ID,
              scope: 'openid email name'
          };

          // Make a call to oauth /delegate
          auth0.getDelegationToken(options, function(err, result) {
              if (!err) {
                  firebase.auth().signInWithCustomToken(result.id_token).then(function(result) {
                      userCredential(result);
                  }).catch(function(err) {
                      console.log('err ' + err)
                  })

              }

          });

      }, function(err) {
          console.log('err: ' + err);
      });
  }


  // Ensure a user autheticates before he contribute
  firebase.auth().onAuthStateChanged(function(user) {
      var profile = localStorage.getItem('profile');
      profile = JSON.parse(profile);
      if (user) {
          $('#logout-btn').show();
          $('#signin-btn').hide();
          $('#contribute').show();
          $('#email').show().append('<span> Welcome: <strong>' + profile.name + '</strong></span>')
      } else {
          $('#logout-btn').hide();
          $('#signin-btn').show();
          $('#contribute').hide();
          $('#email').hide().empty();
      }
  });
