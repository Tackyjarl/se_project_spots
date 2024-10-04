export function setSubmitText(
  button,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText;
  }
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  setSubmitText(submitButton, true, initialText, loadingText);
  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      setSubmitText(submitButton, false, initialText);
    });
}
