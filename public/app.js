  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyBTJyfhWFsbdG0oTC08U45BNqo2WVDPP_I",
      authDomain: "chattbase-14018.firebaseapp.com",
      databaseURL: "https://chattbase-14018.firebaseio.com",
      storageBucket: "chattbase-14018.appspot.com",
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
   // Login with google
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
      var provider = new firebase.auth.FaceBookAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
          userCredential(result);
      }).catch(function(err) {
          alert('err:' + err);
      })
  }
  // Login with Github
  function loginWithGitHub() {
      var provider = new firebase.auth.GitHubAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
          userCredential(result);
      }).catch(function(err) {
          alert('err:' + err);
      })
  }
  // Login with Twitter
  function loginWithTwitter() {
      var provider =  new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithPopUp(provider).then(function(result) {
          userCredential(result);
      }).catch(function(err) {
          alert('err:' + err);
      })
  }

// Storing user credentials to database
function userCredential(result){
  var user = result.user;
  // console.log(user, 'user credentials')
  $('#avatar').val(user.photoUrl);
  $('#displayName').val(user.displayName);
  firebase.database().ref('users/' + user.uid).set({
    username: user.displayName,
    email: user.email,
    avatar: user.photoUrl
  });
}
