import "./index.css";
import {
  enableValidation,
  resetValidation,
  settings,
  disableButton,
} from "../scripts/validation.js";

import spotsLogoSrc from "../images/logo.svg";
const spotsLogo = document.getElementById("spots-logo");
spotsLogo.src = spotsLogoSrc;

const profileAvatar = document.getElementById("profile-avatar");

import { setSubmitText, handleSubmit } from "../utils/helpers.js";

import Api from "../utils/Api.js";
// import { make } from "core-js/core/object";
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "68c42e23-365b-43da-b5fb-6a601c1ca791",
    "Content-Type": "application/json",
  },
});

api
  .getInfo()
  .then(([cards, user]) => {
    cards.forEach((item) => {
      renderCard(item, "append");
    });
    profileAvatar.src = user.avatar;
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
  })
  .catch((err) => {
    console.error(err);
  });

let selectedCard;
let selectedCardId;

// Profile
const profileEditButton = document.querySelector(".profile__edit-button");
const newPostModalButton = document.querySelector(".profile__add-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const avatarModalButton = document.querySelector(".profile__avatar-button");

// Form
const profileForm = document.forms["edit-profile"];
const editProfileModal = document.querySelector("#edit-profile-modal");
const closeButtons = document.querySelectorAll(".modal__button-close");

const inputProfileName = editProfileModal.querySelector("#profile-name");
const inputProfileDescription = editProfileModal.querySelector(
  "#profile-description"
);
const editProfileModalSubmit = editProfileModal.querySelector(
  ".modal__button-submit"
);
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = document.forms["new-post"];
const inputNewPostLink = newPostModal.querySelector("#new-post-link-input");
const inputNewPostCaption = newPostModal.querySelector(
  "#new-post-caption-input"
);
const newPostModalSubmit = newPostModal.querySelector(".modal__button-submit");
const previewModal = document.querySelector("#image-preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const deleteModal = document.querySelector("#delete-image-modal");
const deleteForm = deleteModal.querySelector(".modal__delete");
const deleteCancelButton = deleteModal.querySelector(".modal__button-cancel");

// Avatar
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = avatarModal.querySelector("#edit-avatar");
const avatarModalSubmit = avatarModal.querySelector(".modal__button-submit");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Cards
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", closeModalClick);
  document.addEventListener("keydown", closeModalEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", closeModalClick);
  document.removeEventListener("keydown", closeModalEscape);
}

function closeModalClick(event) {
  if (event.target.classList.contains("modal")) {
    closeModal(event.target);
  }
}

function closeModalEscape(event) {
  if (event.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
}

profileEditButton.addEventListener("click", () => {
  inputProfileName.value = profileName.textContent;
  inputProfileDescription.value = profileDescription.textContent;
  resetValidation(editProfileModal, [
    inputProfileName,
    inputProfileDescription,
  ]);
  openModal(editProfileModal);
});

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

newPostModalButton.addEventListener("click", () => {
  openModal(newPostModal);
});

function handleProfileFormSubmit(evt) {
  function makeRequest() {
    return api
      .editUserInfo({
        name: inputProfileName.value,
        about: inputProfileDescription.value,
      })
      .then((data) => {
        profileName.textContent = data.name;
        profileDescription.textContent = data.about;
        disableButton(editProfileModalSubmit);
        closeModal(editProfileModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleAddFormSubmit(evt) {
  function makeRequest() {
    return api
      .addCard({
        name: inputNewPostCaption.value,
        link: inputNewPostLink.value,
      })
      .then((data) => {
        renderCard(data);
        disableButton(newPostModalSubmit);
        closeModal(newPostModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleAvatarFormSubmit(evt) {
  function makeRequest() {
    return api.editAvatarInfo({ avatar: avatarInput.value }).then((data) => {
      profileAvatar.setAttribute("src", data.avatar);
      disableButton(avatarModalSubmit);
      closeModal(avatarModal);
    });
  }
  handleSubmit(makeRequest, evt);
}

profileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleAddFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

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
  cardLikeElement.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  if (data.isLiked === true) {
    cardLikeElement.classList.add("card__button-like_liked");
  }

  const cardDeleteElement = cardElement.querySelector(".card__button-delete");
  cardDeleteElement.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalCaption.textContent = data.name;
    previewModalImage.alt = data.name;
  });
  return cardElement;
}

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

// DELETE CARD
function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  function makeRequest() {
    return api.deleteCard(selectedCardId).then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    });
  }
  handleSubmit(makeRequest, evt, "Deleting...");
}

deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

// LIKE CARD

function handleLike(evt, cardId) {
  const isLiked = evt.target.classList.contains("card__button-like_liked");
  if (isLiked) {
    api
      .removeLike(cardId)
      .then(() => {
        evt.target.classList.toggle("card__button-like_liked");
      })
      .catch(console.error);
  } else {
    api
      .addLike(cardId)
      .then(() => {
        evt.target.classList.toggle("card__button-like_liked");
      })
      .catch(console.error);
  }
}

enableValidation(settings);
