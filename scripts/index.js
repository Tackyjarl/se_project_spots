const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

// Profile
const profileEditButton = document.querySelector(".profile__edit-button");
const newPostModalButton = document.querySelector(".profile__add-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Form
const profileForm = document.forms["edit-profile"];
const editProfileModal = document.querySelector("#edit-profile-modal");
const closeButtons = document.querySelectorAll(".modal__button-close");
const inputProfileName = editProfileModal.querySelector("#profile-name");
const inputProfileDescription = editProfileModal.querySelector(
  "#profile-description"
);
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = document.forms["new-post"];
const inputNewPostLink = newPostModal.querySelector("#new-post-link-input");
const inputNewPostCaption = newPostModal.querySelector(
  "#new-post-caption-input"
);
const previewModal = document.querySelector("#image-preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

// Cards
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

profileEditButton.addEventListener("click", () => {
  inputProfileName.value = profileName.textContent;
  inputProfileDescription.value = profileDescription.textContent;
  openModal(editProfileModal);
});

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

newPostModalButton.addEventListener("click", () => {
  openModal(newPostModal);
});

function handleProfileFormSubmit(event) {
  event.preventDefault();
  profileName.textContent = inputProfileName.value;
  profileDescription.textContent = inputProfileDescription.value;
  closeModal(editProfileModal);
}

function handleAddFormSubmit(event) {
  event.preventDefault();
  const inputValues = {
    name: inputNewPostCaption.value,
    link: inputNewPostLink.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(newPostModal);
  event.target.reset();
}

profileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleAddFormSubmit);

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  cardNameElement.textContent = data.name;

  const cardImageElement = cardElement.querySelector(".card__image");
  cardImageElement.setAttribute("src", data.link);
  cardImageElement.alt = data.name;

  const cardLikeElement = cardElement.querySelector(".card__button-like");
  cardLikeElement.addEventListener("click", () => {
    cardLikeElement.classList.toggle("card__button-like_liked");
  });

  const cardDeleteElement = cardElement.querySelector(".card__button-delete");
  cardDeleteElement.addEventListener("click", () => {
    const listItem = cardDeleteElement.closest(".card");
    listItem.remove();
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalCaption.textContent = data.name;
    previewModalImage.alt = data.name;
  });
  return cardElement;
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

initialCards.forEach((item) => {
  renderCard(item, "append");
});
