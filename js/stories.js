"use strict"; 

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

// function generateStoryMarkup(story) {
//   // console.debug("generateStoryMarkup", story);

//   const hostName = story.getHostName();
//   return $(`
//       <li id="${story.storyId}">
//         <a href="${story.url}" target="a_blank" class="story-link">
//           ${story.title}
//         </a>
//         <small class="story-hostname">(${hostName})</small>
//         <small class="story-author">by ${story.author}</small>
//         <small class="story-user">posted by ${story.username}</small>
//       </li>
//     `);
// }

// PART 3:
// function generateStoryMarkup(story) {
//   const hostName = story.getHostName(); 
//   return $(`
//       <li id="${story.storyId}">
//         <span class="star">
//         <i class="far fa-star"> 
//         </i>
//         </span>
//         <a href="${story.url}" target="a_blank" class="story-link">
//           ${story.title}
//         </a>
//         <small class="story-hostname">(${hostName})</small>
//         <small class="story-author">by ${story.author}</small>
//         <small class="story-user">posted by ${story.username}</small>
//       </li>
//     `);
// }

// PART 3:
// function generateStoryMarkup(story) {
//   const hostName = story.getHostName(); 
//   const isFavorited = currentUser && currentUser.favorites.some(fav => fav.storyId === story.storyId);
//   const starClass = isFavorited ? "fas" : "far";

//   const $star = $(`
//     <span class="star">
//       <i class="${starClass} fa-star"></i>
//     </span>
//   `);

//   const $storyLink = $(`
//     <a href="${story.url}" target="_blank" class="story-link">${story.title}</a>
//   `);

//   const $storyMeta = $(`
//     <small class="story-hostname">(${hostName})</small>
//     <small class="story-author">by ${story.author}</small>
//     <small class="story-user">posted by ${story.username}</small>
//   `);

//   if (currentUser) {
//     $star.on("click", function() {
//       if (isFavorited) {
//         currentUser.removeFavorite(story);
//         $(this).find("i").toggleClass("fas far");
//       } else {
//         currentUser.addFavorite(story);
//         $(this).find("i").toggleClass("fas far");
//       }
//       saveUserCredentialsInLocalStorage();
//     });
//   } else {
//     $star.addClass("hidden");
//   }

//   return $(`
//     <li id="${story.storyId}"></li>
//   `).append($star, $storyLink, $storyMeta);
// }

function generateStoryMarkup(story, isMyStory) {
  const hostName = story.getHostName(); 
  const isFavorited = currentUser && currentUser.favorites.some(fav => fav.storyId === story.storyId);
  const starClass = isFavorited ? "fas" : "far";
  const $trashIcon = $(`<i class="fas fa-trash"></i>`);

  const $star = $(`
    <span class="star">
      <i class="${starClass} fa-star"></i>
    </span>
  `);

  const $storyLink = $(`
    <a href="${story.url}" target="_blank" class="story-link">${story.title}</a>
  `);

  const $storyMeta = $(`
    <small class="story-hostname">(${hostName})</small>
    <small class="story-author">by ${story.author}</small>
    <small class="story-user">posted by ${story.username}</small>
  `);

  if (currentUser) {
    $star.on("click", function() {
      if (isFavorited) {
        currentUser.removeFavorite(story);
        $(this).find("i").toggleClass("fas far");
      } else {
        currentUser.addFavorite(story);
        $(this).find("i").toggleClass("fas far");
      }
      saveUserCredentialsInLocalStorage();
    });
  } else {
    $star.addClass("hidden");
  }

  // PART 4:
  // if (isMyStory) {
  //   $trashIcon.on("click", function() {
  //     $story.remove();
  //     storyList.removeStory(currentUser, story);
  //   });
  // } else {
  //   $trashIcon.addClass("hidden");
  // }

  // if (isMyStory) {
  //   $trashIcon.on("click", function() {
  //     $story.remove();
  //     storyList.removeStory(currentUser, story.storyId);
  //   });
  if (isMyStory) {
    $trashIcon.on("click", function() {
      $story.remove();
      storyList.removeStory(currentUser, story.storyId);
      currentUser.ownStories = currentUser.ownStories.filter(s => s.storyId !== story.storyId);

      // check if there are any stories left after removing the current story
      if (currentUser.ownStories.length === 0) {
        
        const $noStoriesMsg = $("<p>").text("You don't have any submitted stories!");
        console.log('here')
        $allStoriesList.append($noStoriesMsg);
      }
    });
  } else {
    $trashIcon.addClass("hidden");
  }

  // ***
 

  const $story = $(`
    <li id="${story.storyId}"></li>
  `).append($trashIcon, $star, $storyLink, $storyMeta);

  return $story;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

$('#nav-favorites').on('click', function(evt) {
  evt.preventDefault();
  putFavoritesOnPage();
});

// STYLING MATCH:
// function putFavoritesOnPage() { 
//   $allStoriesList.empty();
//   hidePageComponents();
//   // check if the user has any favorites
//   if (currentUser.favorites.length === 0) {
//     const $noFavorites = $("<p>").text("No favorites to show!");
//     $allStoriesList.append($noFavorites);
//   } else {
//     // loop through all of our user's favorites and generate HTML for them
//     for (let story of currentUser.favorites) {
//       const $story = generateStoryMarkup(story);
//       $allStoriesList.append($story);
//     }
//   }

//   $allStoriesList.show();
// }

function putFavoritesOnPage() { 
  $allStoriesList.empty();
  hidePageComponents();
  
  // check if the user has any favorites
  if (currentUser.favorites.length === 0) {
    const $noFavorites = $("<p>").text("No favorites to show!");
    $allStoriesList.append($noFavorites);
  } else {
    // loop through all of our user's favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      const $star = $story.find(".star");
      
      // add event listener to star icon to remove favorite and refresh display
      $star.on("click", function() {
        currentUser.removeFavorite(story);
        putFavoritesOnPage();
      });
      
      $allStoriesList.append($story);
    }
  }

  $allStoriesList.show();
}

$('#nav-my-stories').on('click', function(evt) {
  evt.preventDefault();
  putMyStoriesOnPage();
});

// function putMyStoriesOnPage() {  
//   $allStoriesList.empty();
//   hidePageComponents();
//   // loop through all of our user's stories and generate HTML for them
//   for (let story of currentUser.ownStories) {
//     const $story = generateStoryMarkup(story);
//     $allStoriesList.append($story);
//   }
//   $allStoriesList.show();
// }

// PART 4:
// function putMyStoriesOnPage() {  
//   $allStoriesList.empty();
//   hidePageComponents();
//   // loop through all of our user's stories and generate HTML for them
//   for (let story of currentUser.ownStories) {
//     const $story = generateStoryMarkup(story, true);
//     $allStoriesList.append($story);
//   }
//   $allStoriesList.show();
// }

// function putMyStoriesOnPage() {
//   $allStoriesList.empty();
//   hidePageComponents(); 
//   if (currentUser.ownStories.length === 0) {
//     $allStoriesList.append("<p>You don't have any submitted stories!</p>");
//   } else {
//     for (let story of currentUser.ownStories) {
//       const $story = generateStoryMarkup(story, true);
//       $allStoriesList.append($story);
//     }
//   }

//   $allStoriesList.show();
// }

function putMyStoriesOnPage() {  
  $allStoriesList.empty();
  hidePageComponents();
  if (currentUser.ownStories.length === 0) { 
    console.log('currentUser')
    console.log('currentUser.ownStories')
    console.log('currentUser.ownStories.length')
    const $noStoriesMsg = $("<p>").text("You don't have any submitted stories!");
    $allStoriesList.append($noStoriesMsg); 
  }
  // loop through all of our user's stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story, true);
    $allStoriesList.append($story);
  }   
  $allStoriesList.show();
}

// PART 2 SUBPART 2B:
/**
 * Handle submit of the new story form
 */
async function handleSubmit(event) {
  event.preventDefault();
  const $author = $('#author');
  const $title = $('#title');
  const $url = $('#url'); 
  const storyData = {
    title: $title.val(),
    author: $author.val(),
    url: $url.val()
  }; 
  await storyList.addStory(currentUser, storyData);
  $author.val('');
  $title.val('');
  $url.val(''); 
  hidePageComponents()
  await getAndShowStoriesOnStart();
}

/**
 * Add an event listener for the new story form submit
 */
$submitForm.on('submit', handleSubmit);

